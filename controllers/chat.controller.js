const CardpostsRepository = require("../repositories/cardposts.repository");
const ChatService = require("../services/chat.service");
const Boom = require("boom");
class ChatController {
  constructor() {
    this.chatService = new ChatService();
    this.cardpostsRepository = new CardpostsRepository();
  }

  /**
   * 채팅방을 생성합니다.
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  createUserChat = async (req, res, next) => {
    const { maxParty, roomName } = req.body;
    const { email } = res.locals.user;

    try {
      if (!email) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!maxParty || !roomName) {
        throw Boom.notFound(` maxParty,  roomName은 비어있을 수 없습니다.`);
      }

      const findOneUser = await this.cardpostsRepository.findOneUser(email);
      const userIdx = findOneUser.userIdx;
      await this.chatService.createUserChat(userIdx, maxParty, roomName);

      return res.status(200).json({ message: `${userIdx}의 채팅방 생성 성공` });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 채팅방 정보를 봅니다.
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  enterUserChat = async (req, res, next) => {
    const { splitNumber, splitPageNumber } = req.query;

    try {
      if (!splitNumber || !splitPageNumber) {
        throw Boom.notFound(
          `splitPageNumber, splitNumber은 비어있을 수 없습니다.`
        );
      }

      const result = await this.chatService.enterUserChat(
        splitNumber,
        splitPageNumber
      );

      return res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ChatController;
