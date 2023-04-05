const ReplyCommentRepository = require('../repositories/replycomments.repository');

class ReplyCommentService {
  replycommentRepository = new ReplyCommentRepository();

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   * @param {String} comment
   * @return 생성된 대댓글
   */
  //대댓글 생성
  createReComment = async (commentIdx, userIdx, comment) => {
    await this.replycommentRepository.findPost(postIdx);

    await this.replycommentRepository.findComment(commentIdx);

    const writeReComment = await this.replycommentRepository.createReComment(
      commentIdx,
      userIdx,
      comment
    );
    return writeReComment;
  };

  /**
   * @param {UUID} postIdx
   * @param {UUID} commentIdx
   * @return 조회한 대댓글 목록
   */
  //대댓글 조회
  getReComments = async (postIdx, commentIdx) => {
    await this.replycommentRepository.findPost(postIdx);

    await this.replycommentRepository.findComment(commentIdx);

    const recomment = await this.replycommentRepository.getReComments(commentIdx);

    return {
    replyIdx: recomment.replyIdx,
    commentIdx: recomment.commentIdx,
    postIdx: recomment.postIdx,
    nickname: recomment.nickname,
    comment: recomment.comment,
    createdAt: recomment.createdAt,
    updatedAt: recomment.updatedAt,
    };
  }

  /**
   * @param {UUID} commentIdx
   * @param {String} comment
   * @param {UUID} userIdx
   * @param {UUID} postIdx
   * @param {UUID} replyIdx
   * @return 수정된 행의 수
   */
  //대댓글 수정
  updateReComment = async (commentIdx, comment, userIdx, postIdx, replyIdx) => {
    await this.replycommentRepository.findPost(postIdx);

    await this.replycommentRepository.findComment(commentIdx);

    await this.replycommentRepository.findeAuth(
        replyIdx,
        userIdx
    );

    const modifyReComment = await this.replycommentRepository.updateReComment(
      replyIdx,
      userIdx,
      comment
    );
    return modifyReComment;
  };

  /**
   * @param {UUID} replyIdx
   * @param {UUID} userIdx
   * @return 삭제된 행의 수
   */
  //대댓글 삭제
  deleteReComment = async (commentIdx, userIdx, postIdx, replyIdx) => {
    await this.replycommentRepository.findPost(postIdx);

    await this.replycommentRepository.findComment(commentIdx);

    await this.replycommentRepository.findeAuth(
        replyIdx,
        userIdx
    );

    const removeReComment = await this.replycommentRepository.deleteReComment(replyIdx);
    return removeReComment;
  };
}

module.exports = ReplyCommentService;
