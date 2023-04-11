const UserService = require("../services/users.service");

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
      res.set("X-Refresh-Token",`Bearer ${refresh_token}`)

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
    console.log(userData.email)
    // const {email, nickname} = userData
    const {access_token, refresh_token} = await this.userService.generateToken(userData.email);
    res.set("Authorization", `Bearer ${access_token}`);
    res.set("X-Refresh-Token",`Bearer ${refresh_token}`)
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
}
module.exports = UserController;
