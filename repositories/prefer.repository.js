const { Prefer } = require("../models");
const { Op } = require("sequelize");

// selectprefer: 0 디폴트
// 1. 포스트에 대한 좋아요 2. 포스트에 대한 싫어요.
// 3. 댓글에 대한 좋아요. 4 댓글에 대한 싫어요.
// 5. 대댓글에 대한 좋아요 6. 대댓글에 대한 싫어요.
// 7. 포스트 찬성 8. 포스트 반대.

class PreferRepository {
  // 포스트에 대해서 찬성표를 던집니다.
  postProInput = async (userIdx, postIdx) => {
    await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: "7", // 포스트 찬성
    });

    return;
  };

  // 포스트에 대해서 반대표를 던집니다.
  postConInput = async (userIdx, postIdx) => {
    await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: "8", // 포스트 반대
    });

    return;
  };

  // 포스트의 찬성표를 집계합니다.
  postProCount = async (postIdx) => {
    return await Prefer.count({
      where: { postIdx: postIdx, selectprefer: "7" },
    });
  };

  // 포스트의 반대표를 집계합니다.
  postConCount = async (postIdx) => {
    return await Prefer.count({
      where: { postIdx: postIdx, selectprefer: "8" },
    });
  };

  // 포스트에 좋아요 혹은 싫어요를 했는지 판단 합니다.
  findPostUserCheck = async (userIdx, postIdx) => {
    const findLikes = await Prefer.findOne({
      where: {
        postIdx: postIdx,
        userIdx: userIdx,
      },
    });

    return findLikes;
  };

  // 좋아요를 생성 합니다.
  AddLike = async (postIdx, userIdx, property) => {
    console.log(
      "postIdx :",
      postIdx,
      "userIdx :",
      userIdx,
      "property :",
      property
    );
    const addLike = await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: property,
    });
    return await addLike.save();
  };

  // 좋아요를 취소 합니다.
  DeleteLike = async (postIdx, userIdx, property) => {
    return await Prefer.destroy({
      where: { postIdx: postIdx, userIdx: userIdx, selectprefer: property },
    });
  };

  // 싫어요를 생성 합니다.
  AddDisLike = async (postIdx, userIdx, property) => {
    const addLike = await Prefer.create({
      postIdx: postIdx,
      userIdx: userIdx,
      selectprefer: property,
    });

    return await addLike.save();
  };

  // 싫어요를 취소 합니다.
  DeleteDisLike = async (postIdx, userIdx, property) => {
    return await Prefer.destroy({
      where: { postIdx: postIdx, userIdx: userIdx, selectprefer: property },
    });
  };
}

module.exports = PreferRepository;
