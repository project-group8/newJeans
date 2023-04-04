require('dotenv').config();

const Boom = require('boom');
const CommentRepository = require('../repositories/comment.repository');
const CustomError = require('../middlewares/errorHandler');

class AuthService {
  commentRepository = new CommentRepository();

  /**
   * 댓글 생성
   * @param {Integer} quizId
   * @param {String} userId
   * @param {String} content
   * @return 생성된 댓글
   */
  writeComment = async (quizId, userId, content) => {
    const searchQuiz = await this.commentRepository.findQuiz(quizId);

    if (!searchQuiz) {
      throw Boom.notFound('해당 퀴즈 게시글은 존재하지 않습니다.', false);
    }

    const createUser = await this.commentRepository.writeComment(
      quizId,
      userId,
      content
    );

    return createUser;
  };

  /**
   * 댓글 조회
   * @param {Integer} quizId
   * @return 조회한 댓글 리스트
   */
  selectComments = async (quizId) => {
    const searchQuiz = await this.commentRepository.findQuiz(quizId);

    if (!searchQuiz) {
      throw Boom.forbidden('해당 퀴즈 게시글은 존재하지 않습니다.', false);
    }

    const selectComments = await this.commentRepository.selectComments(quizId);

    return selectComments;
  };

  /**
   * 댓글 수정
   * @param {Integer} commentId
   * @param {String} content
   * @param {String} userId
   * @return 수정된 행의 수
   */
  updateComment = async (commentId, content, userId) => {
    const serachQuizComment = await this.commentRepository.findQuizComment(
      commentId,
      userId
    );

    if (!serachQuizComment) {
      throw Boom.forbidden('댓글의 수정 권한이 없습니다.', false);
    }

    const updateComment = await this.commentRepository.updateComment(
      commentId,
      userId,
      content
    );

    return updateComment;
  };

  /**
   * 댓글 삭제
   * @param {Integer} commentId
   * @param {String} userId
   * @return 삭제된 행의 수
   */
  deleteComment = async (commentId, userId) => {
    const serachQuizComment = await this.commentRepository.findQuizComment(
      commentId,
      userId
    );

    if (!serachQuizComment) {
      throw Boom.forbidden('댓글의 삭제 권한이 없습니다.', false);
    }

    const deleteComment = await this.commentRepository.deleteComment(commentId);

    return deleteComment;
  };

  /**
   * 댓글 수정/삭제 권한 조회
   * @param {Integer} commentId
   * @param {String} userId
   * @returns Boom Error Handler
   */
  checkAuth = async (commentId, userId) => {
    const userAuthChk = await this.commentRepository.findUpdateAuth(commentId);
    if (userAuthChk.userId !== userId) {
      throw Boom.forbidden('권한이 없습니다.', false);
    }
  };
}

module.exports = AuthService;
