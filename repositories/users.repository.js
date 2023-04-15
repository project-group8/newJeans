const { Users } = require("../models");

class UserRepository extends Users {
  constructor() {
    super();
  }

  /**
   * @param {String} email
   */
  //email 매칭 (로그인, 회원가입)
  findByID = async (email) => {
    const findUser = await Users.findOne({
      where: { email },
    });
    return findUser;
  };

  findNickname = async (email) => {
    const nickname = await Users.findOne({
      attributes: ["nickname"],
      where: { email },
    });
    return nickname;
  };

  /**
   * @param {String} email
   * @param {String} password
   */
  //user정보 생성(회원가입)
  userSignup = async (email, password, nickname) => {
    const createUser = await Users.create({ email, password, nickname });
    return createUser;
  };

  //user정보 조회
  getAllusers = async () => {
    const user = await Users.findAll({
      attributes: [
        "email",
        "password",
        "userIdx",
        "nickname",
        "createdAt",
        "updatedAt",
      ],
    });
    return user;
  };
}

module.exports = UserRepository;
