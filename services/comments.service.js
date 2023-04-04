require('dotenv').config();

const Boom = require('boom');
const CommentRepository = require('../repositories/comments.repository');

class CommentService {
  commentRepository = new CommentRepository();

  /**
   * @param {UUID} postIdx
   * @param {UUID} userIdx
   * @param {String} desc
   * @return 생성된 댓글
   */
  //댓글 생성
  createComment = async (postIdx, userIdx, desc) => {
    await this.commentRepository.findPost(postIdx);

    const writeUser = await this.commentRepository.createComment(
      postIdx,
      userIdx,
      desc
    );
    return writeUser;
  };

  /**
   * @param {UUID} postIdx
   * @return 조회한 댓글 목록
   */
  //댓글 조회
  findComment = async (postIdx) => {
    await this.commentRepository.findPost(postIdx);

    const comment = await this.commentRepository.findComments(postIdx);

    return {
    commentIdx: comment.commentIdx,
    postIdx: comment.postIdx,
    nickname: comment.User.nickname,
    desc: comment.desc,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    };
  }

  /**
   * @param {UUID} commentIdx
   * @param {String} desc
   * @param {UUID} userIdx
   * @return 수정된 행의 수
   */
  //댓글 수정
  updateComment = async (commentIdx, desc, userIdx) => {
    await this.commentRepository.findeAuth(
        commentIdx,
        userIdx
    );

    const modifyComment = await this.commentRepository.updateComment(
      commentIdx,
      userIdx,
      desc
    );
    return modifyComment;
  };

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   * @return 삭제된 행의 수
   */
  //댓글 삭제
  deleteComment = async (commentIdx, userIdx) => {
    await this.commentRepository.findeAuth(
        commentIdx,
        userIdx
    );

    const removeComment = await this.commentRepository.deleteComment(commentIdx);
    return removeComment;
  };
}

module.exports = CommentService;
