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

    // 가지고있는 Access Token 확인
    const myToken = verifyToken(authToken);

    // 만약 만료가 되었을때
    if (myToken == "jwt expired") {
      // Access Token 디코드
      const userInfo = jwt.decode(authToken, process.env.SECRET_KEY);

      // 디코드 한 값에서 아이디 가져와서 선언
      const email = userInfo.email;

      let refreshToken;

      // DB에 있는 Refresh Token 찾아오기
      await Users.findOne({ where: { email } }).then((u) => {
        refreshToken = u.refreshToken;

        // 가지고있는 Refresh Token 확인
        const myRefreshToken = verifyToken(refreshToken);

        // 만약 Refresh Token 만료가 되었을때
        if (myRefreshToken == "jwt expired") {
          res.send({ errorMessage: "로그인 후에 사용하세요." });
        } else {
          // Access Token 발급
          const myNewToken = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
          });
          res.set("Authorization", `Bearer ${myNewToken}`);
        }
      });
    } else {
      const { email } = jwt.verify(authToken, process.env.SECRET_KEY);
      const user = await Users.findAll({ where: { email } });
      res.locals.user = user[0].dataValues;
      next();
    }
  } catch (err) {
    res.send({ errorMessage: err + " :로그인 후에 사용하세요." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return err.message;
  }
}
