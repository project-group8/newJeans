require("dotenv").config();

// const fetch = require("node-fetch");
const Joi = require("joi");
const UserRepository = require("../repositories/users.repository");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const {
  createHashPassword,
  comparePassword,
} = require("../modules/cryptoUtils.js");
const Boom = require("boom");
const logger = require("../middlewares/logger.js");

const re_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const re_password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,12})/; //특수문자 필수
const re_password = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,12}$/;

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(re_password).required(),
});

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * @param {String} email
   * @param {String} password
   */
  //로그인
  userLogin = async (email, password) => {
    try {
      const user = await this.userRepository.findByID(email);

      if (!user) {
        throw Boom.notFound("존재하지 않는 이메일 주소입니다");
      }

      const comparePw = await comparePassword(password, user.password);

      if (!comparePw) {
        throw Boom.unauthorized("패스워드를 확인해주세요.");
      }
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  //카카오 로그인 토큰
  getKakaoToken = async (code) => {
    try {
      const baseUrl = "https://kauth.kakao.com/oauth/token";
      const config = {
      client_id: process.env.KAKAO_REST_API_KEY,
      grant_type: "authorization_code",
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      client_secret: process.env.KAKAO_REST_SECRET,
      code: code
      };
      const params = new URLSearchParams(config).toString();
      
      const finalUrl = `${baseUrl}?${params}`;
      console.log(finalUrl)
      const kakaoTokenRequest = await fetch(finalUrl, {
      method: "POST",
      headers: {
      "Content-type": "application/json", // 이 부분을 명시하지않으면 text로 응답을 받게됨
      },
      });
      const authToken = await kakaoTokenRequest.json();
      return authToken
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
  //카카오 로그인 회원정보
  getKakaoUser = async (authToken) => {
    const baseUrl = "https://kapi.kakao.com/v2/user/me"
    const kakaoTokenRequest = await fetch(baseUrl, {
      method: "GET",
      headers: {
      "Content-type": "application/x-www-form-urlencoded", // 이 부분을 명시하지않으면 text로 응답을 받게됨
      Authorization: `Bearer ${authToken.access_token}`
      },
      });
      const userData = await kakaoTokenRequest.json();
      // console.log(userData.properties.nickname)
      const email = userData.kakao_account.email
      const nickname = userData.kakao_account.profile.nickname

      // console.log(userData.kakao_account.profile.nickname)
      // console.log(userData.kakao_account.email)
      return {email: email,
              nickname: nickname
      }
  }

  /**
   * @param {String} email
   */
  //토큰 생성
  generateToken = async (email) => {
    const access_token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const refresh_token = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return {access_token, refresh_token};
  };

  kakaoGenerateToken = async (email) => {
    const access_token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const refresh_token = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return {access_token, refresh_token};
  };

  /**
   * @param {String} email
   * @param {String} password
   */
  //회원가입
  userSignup = async (email, password, passwordConfirm, nickname) => {
    try {
      await userSchema.validate({ email, password });

      if (email.search(re_email) === -1) {
        throw Boom.badRequest("유효하지 않은 이메일 주소 입니다.");
      }

      if (password.search(re_password) === -1) {
        throw Boom.badRequest("유효하지 않은 패스워드 입니다.");
      }

      if (password !== passwordConfirm) {
        throw Boom.badRequest("패스워드 확인과 일치 하지 않습니다.");
      }

      const existingUser = await this.userRepository.findByID(email);
      if (existingUser) {
        throw Boom.conflict("중복된 이메일 주소 입니다");
      }

      const existingNickname = await this.userRepository.findNickname(nickname);
      if (existingNickname) {
        throw Boom.conflict("중복된 닉네임 입니다");
      }

      const hashedPassword = await createHashPassword(password);

      await this.userRepository.userSignup(email, hashedPassword, nickname);
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  //모든 유저 조회
  getAllusers = async () => {
    const allUsers = await this.userRepository.getAllusers();
    allUsers.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return allUsers.map((user) => {
      return {
        email: user.email,
        passwd: user.password,
        nickname: user.nickname,
        userIdx: user.userIdx,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  };

  findNickname = async (email) => {
    const nickname = await this.userRepository.findNickname(email);
    return nickname
  };
}
module.exports = UserService;
