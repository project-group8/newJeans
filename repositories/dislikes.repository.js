const { DisLikes } = require("../models");
class DisLikesRepository {
  postConInput = async (userIdx, postIdx) => {
    await DisLikes.create({ userIdx, postIdx });
    return;
  };

  postConCount = async (postIdx) => {
    const postConCount = await DisLikes.findAll({
      where: { postIdx: postIdx },
    });
    return postConCount.length;
  };
}

module.exports = DisLikesRepository;
