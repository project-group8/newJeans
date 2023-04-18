const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  const [authType, authToken] = (authorization ?? "").split(" ");

  try {
    // 비로그인 유저 통과 if문
    if (authType !== "Bearer" || !authToken) {
      return next();
    }

    const { email } = jwt.verify(authToken, process.env.SECRET_KEY);
    const user = await Users.findAll({ where: { email } });
    res.locals.user = user[0].dataValues;
    next();
  } catch (err) {
    res.send({ errorMessage: err + " :로그인 후에 사용하세요." });
  }
};
