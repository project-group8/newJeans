const { CardPost } = require("../models");

module.exports = async (req, res, next) => {
  const { postIdx } = req.params;

  // 조회수 증가
  const cardPost = await CardPost.findOne({ where: { postIdx } });
  const viewCount = cardPost.viewCount + 1;
  await cardPost.update({ viewCount });

  next();
  try {
  } catch (error) {
    res.send({ error });
  }
};
