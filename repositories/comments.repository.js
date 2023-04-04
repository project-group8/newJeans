const { CardPost, Comment, Users } = require('../models');
const { parseModelToFlatObject } = require('../helpers/sequelize.helper');
class CommentRepository extends Comment {
  
   /**
   * @param {UUID} postIdx
   */
  //게시글 검색
  findPost = async (postIdx) => {
    const searchPost = await CardPost.findOne({ where: { postIdx } });
    return searchPost;
  };

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   */
  //댓글 검색
  findComment = async (commentIdx, userIdx) => {
    const searchComment = await Comment.findOne({
      where: { commentIdx, userIdx },
    });
    return searchComment;
  };

  /**
   * @param {UUID} postIdx
   * @param {UUID} userIdx
   * @param {String} desc
   */
  //댓글 생성
  createComment = async (postIdx, userIdx, desc) => {
    const writeComment = await Comment.create({
      postIdx,
      userIdx,
      desc,
    });
    return writeComment;
  };

  /**
   * @param {UUID} commentIdx
   * @param {UUID} userIdx
   * @param {String} desc
   */
  //댓글 수정
  updateComment = async (commentIdx, userIdx, desc) => {
    const modifyComment = await Comment.update(
      { desc },
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

  /**
   * @param {UUID} postIdx
   */
  //댓글 조회
  findComments = async (postIdx) => {
    const selectComments = await Comment.findAll({
      where: {
        postIdx,
      },
      attributes: ['commentIdx', 'postIdx', 'desc', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      group: ['Comment.commentIdx'],
      order: [['createdAt', 'DESC']], // 생성일 기준으로 내림차순 정렬
      raw: true, // raw: true를 하면 데이터를 JSON 형태로 반환해준다.
    });
    const allSelectComment = selectComments.map(parseModelToFlatObject);
    return allSelectComment;
  };

  /**
   *
   * @param {UUID} commentIdx
   */
  //권한 확인
  findeAuth = async (commentIdx, userIdx) => {
    const chkAuth = await Comment.findOne({
      where: { commentIdx, userIdx },
    });
    return chkAuth;
  };
}

module.exports = CommentRepository;
