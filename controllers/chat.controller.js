const CardpostsRepository = require("../repositories/cardposts.repository");
const ChatRepository = require("../repositories/chat.repository");
const ChatService = require("../services/chat.service");

const Boom = require("boom");
class ChatController {
  constructor() {
    this.chatService = new ChatService();
    this.cardpostsRepository = new CardpostsRepository();
    this.chatRepository = new ChatRepository();
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

      const checkroomName = await this.chatRepository.checkroomName(roomName);

      if (checkroomName) {
        throw Boom.badRequest("중복된 방 이름이 존재합니다.");
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
   * 채팅방 정보를 봅니다.  nest done
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

  // nest done
  deleteUserChat = async (req, res, next) => {
    const { roomName } = req.params;
    const { email } = res.locals.user;

    try {
      if (!email) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!roomName) {
        throw Boom.notFound(`roomName은 비어있을 수 없습니다.`);
      }

      const findOneUser = await this.cardpostsRepository.findOneUser(email);
      const userIdx = findOneUser.userIdx;
      await this.chatService.deleteUserChat(userIdx, roomName);

      return res.status(200).json({ message: `${roomName} 채팅방 삭제 성공` });
    } catch (error) {
      next(error);
    }
  };

  adminUser = async (req, res, next) => {
    const { roomName } = req.params;

    const transRoomName = String(roomName);

    if (!roomName) {
      throw Boom.badRequest("roomName을 입력하세요.");
    }

    const findRoomAdmin = await this.chatService.adminUser(transRoomName);
    const { nickname } = findRoomAdmin;

    return res.status(200).json({ nickname });
  };

  findChatSave = async (req, res, next) => {
    const { chatSaveIdx } = req.params;

    if (!chatSaveIdx) {
      throw Boom.badRequest("chatSaveIdx 입력하세요.");
    }

    const findRoomAdmin = await this.chatService.findChatSave(chatSaveIdx);

    const { saveData } = findRoomAdmin;

    return res.status(200).json({ saveData });
  };

  chatSave = async (req, res, next) => {
    const { saveDataChat } = req.body;

    if (!saveDataChat) {
      throw Boom.badRequest("saveDataChat 입력하세요.");
    }

    await this.chatService.chatSave(saveDataChat);

    return res.status(200).json({ msg: "데이터 저장에 성공했습니다." });
  };

  doneChat = async (req, res, next) => {
    const allchatroom = await this.chatService.doneChat();

    return res.status(200).json({ doneChats: allchatroom });
  };
}

module.exports = ChatController;
