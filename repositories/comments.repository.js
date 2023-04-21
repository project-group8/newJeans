const { CardPost, Comment, Users, CommentLike } = require('../models');
const { Sequelize } = require("sequelize");
const { parseModelToFlatObject } = require('../helpers/sequelize.helper');
class CommentRepository extends Comment {
  
/* **************************************************주 기능************************************************** */

  /**
   * @param {UUID} postIdx
   * @param {UUID} userIdx
   * @param {String} comment
   */
  //댓글 생성
  createComment = async (postIdx, userIdx, comment, selectedTag) => {
    const writeComment = await Comment.create({
      postIdx,
      userIdx,
      comment,
      selectedTag
    });
    return writeComment;
  };

  /**
   * @param {UUID} postIdx
   */
  //댓글 전체 조회
  getComments = async (postIdx) => {
    const selectComments = await Comment.findAll({
      where: {
        postIdx,
      },
      attributes: ['commentIdx', 'postIdx', 'comment', 'selectedTag', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: CommentLike,
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('commentLikeIdx')),'likesCount']
          ]
        },
      ],
      group: ['Comment.commentIdx'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    const allSelectComment = selectComments.map(parseModelToFlatObject);
    return allSelectComment;
  };

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   * @param {String} comment
   */
  //댓글 수정
  updateComment = async (commentIdx, userIdx, comment) => {
    const modifyComment = await Comment.update(
      { comment },
      { where: { commentIdx, userIdx } }
    );
    return modifyComment;
  };

  /**
   * @param {UUID} commentIdx
   */
  //댓글 삭제
  deleteComment = async (commentIdx) => {
    const removeComment = Comment.destroy({
      where: { commentIdx },
    });
    return removeComment;
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
  findAuth = async (commentIdx, userIdx) => {
    const chkAuth = await Comment.findOne({
      where: { commentIdx, userIdx },
    });
    return chkAuth;
  };
}

module.exports = CommentRepository;
