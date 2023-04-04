const { Likes } = require("../models");
class LikesRepository {
  postProInput = async (userIdx, postIdx) => {
    await Likes.create({ userIdx, postIdx });

    return;
  };

  postProCount = async (postIdx) => {
    const postProCount = await Likes.findAll({
      where: { postIdx: postIdx },
    });
    return postProCount.length;
  };
}

module.exports = LikesRepository;
