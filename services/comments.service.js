const CommentRepository = require('../repositories/comments.repository');

class CommentService {
  commentRepository = new CommentRepository();

  /**
   * @param {UUID} postIdx
   * @param {UUID} userIdx
   * @param {String} comment
   * @return 생성된 댓글
   */
  //댓글 생성
  createComment = async (postIdx, userIdx, comment) => {
    await this.commentRepository.findPost(postIdx);

    const writeComment = await this.commentRepository.createComment(
      postIdx,
      userIdx,
      comment
    );
    return writeComment;
  };

  /**
   * @param {UUID} postIdx
   * @return 조회한 댓글 목록
   */
  //댓글 조회
  getComments = async (postIdx) => {
    await this.commentRepository.findPost(postIdx);

    const comments = await this.commentRepository.getComments(postIdx);
    comments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return comments.map((comment) => {
      return {
        commentIdx: comment.commentIdx,
        postIdx: comment.postIdx,
        nickname: comment.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        };
    });
  };

  /**
   * @param {UUID} commentIdx
   * @param {String} comment
   * @param {UUID} userIdx
   * @return 수정된 행의 수
   */
  //댓글 수정
  updateComment = async (commentIdx, comment, userIdx, postIdx) => {
    await this.commentRepository.findPost(postIdx);

    await this.commentRepository.findeAuth(
        commentIdx,
        userIdx
    );

    const modifyComment = await this.commentRepository.updateComment(
      commentIdx,
      userIdx,
      comment
    );
    return modifyComment;
  };

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   * @return 삭제된 행의 수
   */
  //댓글 삭제
  deleteComment = async (commentIdx, userIdx, postIdx) => {
    await this.commentRepository.findPost(postIdx);

    await this.commentRepository.findeAuth(
        commentIdx,
        userIdx
    );

    const removeComment = await this.commentRepository.deleteComment(commentIdx);
    return removeComment;
  };

  findPost = async (postIdx) => {
    const selectPost = await this.commentRepository.findPost(postIdx);
    return selectPost;
  };

  findAuth = async (postIdx) => {
    const selectPost = await this.commentRepository.findPost(postIdx);
    return selectPost;
  };
}

module.exports = CommentService;
