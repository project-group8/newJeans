const UserService = require("../services/users.service");
const { sign, verify, refreshVerify } = require('../utils/jwt-util');
const jwt = require('jsonwebtoken');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //로그인
  userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const {nickname} = await this.userService.findNickname(email);
      await this.userService.userLogin(email, password);

      const {access_token, refresh_token} = await this.userService.generateToken(email);
      res.set("Authorization", `Bearer ${access_token}`);
      res.set("refreshtoken",refresh_token)

      return res.status(201).json({ message: "로그인에 성공했습니다",
      nickname,
      });
    } catch (error) {
      next(error);
    }
  };

  //카카오 로그인
  kakaoLogin = async (req, res) => {
    const {code} = req.body;
    const authToken = await this.userService.getKakaoToken(code)
    const userData = await this.userService.getKakaoUser(authToken)
    const email = userData.email
    // console.log(email)
    // const {email, nickname} = userData
    const {access_token, refresh_token} = await this.userService.generateToken(email);
    res.set("Authorization", `Bearer ${access_token}`);
    res.set("refreshtoken",refresh_token)
    // res.send(JSON.stringify(userData)); // 프론트엔드에서 확인하려고
    return res.status(201).json({ message: "로그인에 성공했습니다",
      nickname: userData.nickname,
      });
    };


  /**
   * @param {import("express").Request} req - express Request
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //회원가입
  userSignup = async (req, res, next) => {
    try {
      const { email, password, passwordConfirm, nickname } = req.body;
      await this.userService.userSignup(email, password, passwordConfirm, nickname);

      return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //모든 유저 조회
  getAllusers = async (req, res, next) => {
    try {
      const users = await this.userService.getAllusers();

      res.status(200).json({ allUsers: users });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {import("express").Response} res - express Response
   * @param {import("express").NextFunction} next - express Response
   * **/
  //로그아웃
  userlogout = async (req, res, next) => {
    try {
      res.clearHeaders;

      res.status(200).json({ message: "로그아웃이 잘 되었습니다." });
    } catch (error) {
      next(error);
    }
  };
  refresh = async (req, res) => {
    // access token과 refresh token의 존재 유무를 체크합니다.
    if (req.headers.authorization && req.headers.refreshtoken) {
      const authToken = req.headers.authorization.split('Bearer ')[1];
      const refreshToken = req.headers.refreshtoken;
  
      // access token 검증 -> expired여야 함.
      const authResult = verify(authToken);
  
      // access token 디코딩하여 user의 정보를 가져옵니다.
      const decoded = jwt.decode(authToken);
    
      // 디코딩 결과가 없으면 권한이 없음을 응답.
      if (decoded === null) {
        res.status(401).send({
          ok: false,
          message: 'No authorized!',
        });
      }
    
      /* access token의 decoding 된 값에서
        유저의 id를 가져와 refresh token을 검증합니다. */
      const refreshResult = refreshVerify(refreshToken, decoded.email);
  
      // 재발급을 위해서는 access token이 만료되어 있어야합니다.
      if (authResult.ok === false && authResult.message === 'jwt expired') {
        // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
        if (refreshResult.ok === false) {
          res.status(401).send({
            ok: false,
            message: 'No authorized!',
          });
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          const newAccessToken = sign(email);
  
          res.status(200).send({ // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
            ok: true,
            data: {
              accessToken: newAccessToken,
              refreshToken,
            },
          });
        }
      } else {
        // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
        res.status(400).send({
          ok: false,
          message: 'Acess token is not expired!',
        });
      }
    } else { // access token 또는 refresh token이 헤더에 없는 경우
      res.status(400).send({
        ok: false,
        message: 'Access token and refresh token are need for refresh!',
      });
    }
  };
}
module.exports = UserController;
