const ChatRepository = require("../repositories/chat.repository");
const Boom = require("boom");

class ChatService {
  constructor() {
    this.chatRepository = new ChatRepository();
  }

  // 채팅방을 개설합니다.
  createUserChat = async (userIdx, maxParty, roomName) => {
    try {
      const userIdxtest1 = String(userIdx);
      const maxPartytest2 = Number(maxParty);
      const roomNametest3 = String(roomName);

      return await this.chatRepository.createUserChat(
        userIdxtest1,
        maxPartytest2,
        roomNametest3
      );
    } catch (error) {
      error;
    }
  };

  deleteUserChat = async (userIdx, roomName) => {
    return await this.chatRepository.deleteUserChat(userIdx, roomName);
  };

  // 채팅방 정보를 봅니다.
  enterUserChat = async (splitNumber, splitPageNumber) => {
    try {
      const changesplitNumber = Number(splitNumber);
      const changesplitPageNumber = Number(splitPageNumber);
      const findCardPosts = await this.chatRepository.enterUserChat(
        changesplitNumber,
        changesplitPageNumber
      );

      return findCardPosts;
    } catch (error) {
      error;
    }
  };
}

module.exports = ChatService;
