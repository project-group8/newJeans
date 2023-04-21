const { CardPost, Comment, Users, ReplyComment } = require('../models');
const { parseModelToFlatObject } = require('../helpers/sequelize.helper');
class ReplyCommentRepository extends ReplyComment {
  
/* **************************************************주 기능************************************************** */

  /**
   * @param {UUID} commentIdx
   * @param {UUID} postIdx
   * @param {UUID} userIdx
   * @param {String} comment
   */
  //답글 생성
  createReComment = async (commentIdx, postIdx, userIdx, comment) => {
    const writeReComment = await ReplyComment.create({
      commentIdx,
      postIdx,
      userIdx,
      comment,
    });
    return writeReComment;
  };

  /**
   * @param {UUID} commentIdx
   */
  //답글 조회
  getReComments = async (commentIdx) => {
    const selectReComments = await ReplyComment.findAll({
      where: {
        commentIdx,
      },
      attributes: ['replyIdx','commentIdx', 'postIdx', 'comment', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      group: ['ReplyComment.replyIdx'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    const allSelectReComment = selectReComments.map(parseModelToFlatObject);
    return allSelectReComment;
  };

  /**
   * @param {UUID} replyIdx
   * @param {UUID} userIdx
   * @param {String} comment
   */
  //답글 수정
  updateReComment = async (replyIdx, comment, userIdx) => {
    const modifyReComment = await ReplyComment.update(
      { comment },
      { where: { replyIdx, userIdx } }
    );
    return modifyReComment;
  };

  /**
   * @param {UUID} replyIdx
   */
  //답글 삭제
  deleteReComment = async (replyIdx) => {
    const removeReComment = ReplyComment.destroy({
      where: { replyIdx },
    });
    return removeReComment;
  };

  /* **************************************************부가 기능************************************************** */

     /**
   * @param {UUID} postIdx
   */
  //게시글 검색
  findPost = async (postIdx) => {
    const searchPost = await CardPost.findOne({
      where: { postIdx } 
    });
    return searchPost;
  };

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   */
  //댓글 검색
  findComment = async (commentIdx) => {
    const searchComment = await Comment.findOne({
      where: { commentIdx },
    });
    return searchComment;
  };

  /**
   *
   * @param {UUID} commentIdx
   */
  //권한 확인
  findAuth = async (replyIdx, userIdx) => {
    const chkAuth = await ReplyComment.findOne({
      where: { replyIdx, userIdx },
    });
    return chkAuth;
  };
}

module.exports = ReplyCommentRepository;
