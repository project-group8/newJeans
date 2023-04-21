const ReplyCommentRepository = require('../repositories/replycomments.repository');

class ReplyCommentService {
  replycommentRepository = new ReplyCommentRepository();
  /* **************************************************주 기능************************************************** */
  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   * @param {String} comment
   * @return 생성된 대댓글
   */
  //답글 생성
  createReComment = async (commentIdx, postIdx, userIdx, comment) => {

    const writeReComment = await this.replycommentRepository.createReComment(
      commentIdx,
      postIdx,
      userIdx,
      comment
    );
    return writeReComment;
  };

  /**
   * @param {UUID} postIdx
   * @param {UUID} commentIdx
   * @return 조회한 답글 목록
   */
  //답글 조회
  getReComments = async (commentIdx) => {

    const recomments = await this.replycommentRepository.getReComments(commentIdx);
    recomments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return recomments.map((recomment) => {
      return {
        replyIdx: recomment.replyIdx,
        commentIdx: recomment.commentIdx,
        postIdx: recomment.postIdx,
        nickname: recomment.nickname,
        comment: recomment.comment,
        createdAt: recomment.createdAt,
        updatedAt: recomment.updatedAt,
        };
    });
  };
  /**
   * @param {UUID} commentIdx
   * @param {String} comment
   * @param {UUID} userIdx
   * @param {UUID} postIdx
   * @param {UUID} replyIdx
   * @return 수정된 행의 수
   */
  //답글 수정
  updateReComment = async (replyIdx, comment, userIdx) => {

    const modifyReComment = await this.replycommentRepository.updateReComment(
      replyIdx,
      comment,
      userIdx,
    );
    return modifyReComment;
  };

  /**
   * @param {UUID} replyIdx
   * @param {UUID} userIdx
   * @return 삭제된 행의 수
   */
  //답글 삭제
  deleteReComment = async (replyIdx) => {

    const removeReComment = await this.replycommentRepository.deleteReComment(replyIdx);
    return removeReComment;
  };
  /* **************************************************부가 기능************************************************** */
  //게시글 확인
  findPost = async (postIdx) => {
    const selectPost = await this.replycommentRepository.findPost(postIdx);
    return selectPost;
  };

  //댓글 확인
  findComment = async (commentIdx) => {
    const selectPost = await this.replycommentRepository.findComment(commentIdx);
    return selectPost;
  };

  //권한 확인
  findAuth = async (replyIdx, userIdx) => {
    const selectPost = await this.replycommentRepository.findAuth(replyIdx, userIdx);
    return selectPost;
  };
}

module.exports = ReplyCommentService;
