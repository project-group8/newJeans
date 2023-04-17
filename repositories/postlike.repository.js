const { CardPost, PostLike } = require("../models");

// selectprefer: 0 디폴트
// 7. 포스트 찬성 8. 포스트 반대.

class PostLikeRepository {
  /**
   * property 테이블에 조건에 맞는 데이터가 존재하는지 검색합니다.
   */
  findUserLike = async (tableIdx) => {
    return await CardPost.findOne({
      where: { postIdx: tableIdx },
    });
  };

  /**
   * 포스트에 좋아요 혹은 싫어요를 했는지 판단 합니다.
   *
   * @param {UUID} userIdx
   * @param {UUID} tableIdx
   * @returns
   */
  findPostUserCheck = async (userIdx, tableIdx) => {
    return await PostLike.findOne({
      where: { userIdx, postIdx: tableIdx },
    });
  };

  /**
   *  좋아요를 생성 합니다.
   *
   * @param {UUID} tableIdx
   * @param {UUID} userIdx
   * @returns
   */
  AddLike = async (tableIdx, userIdx) => {
    return await PostLike.create({ userIdx, postIdx: tableIdx });
  };

  /**
   * 좋아요를 취소 합니다.
   *
   * @param {UUID} tableIdx
   * @param {UUID} userIdx
   * @returns
   */
  DeleteLike = async (tableIdx, userIdx) => {
    return await PostLike.destroy({
      where: { userIdx, postIdx: tableIdx },
    });
  };
}

module.exports = PostLikeRepository;
