const { Prefer } = require("../models");

class PreferRepository {
  postProInput = async (userIdx, postIdx) => {
    await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: "7", // 포스트 찬성
    });

    return;
  };

  postConInput = async (userIdx, postIdx) => {
    await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: "8", // 포스트 반대
    });

    return;
  };

  postProCount = async (postIdx) => {
    return await Prefer.count({
      where: { postIdx: postIdx, selectprefer: "7" },
    });
  };

  postConCount = async (postIdx) => {
    return await Prefer.count({
      where: { postIdx: postIdx, selectprefer: "8" },
    });
  };
}

module.exports = PreferRepository;
