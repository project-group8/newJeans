const ChatRepository = require("../repositories/chat.repository");
const Boom = require("boom");

class ChatService {
  constructor() {
    this.chatRepository = new ChatRepository();
  }

  // 채팅방을 개설합니다.
  createUserChat = async (userIdx, title, maxParty, roomName) => {
    try {
      return await this.chatRepository.createUserChat(
        userIdx,
        title,
        maxParty,
        roomName
      );
    } catch (error) {
      error;
    }
  };

  // 채팅방 정보를 봅니다.
  enterUserChat = async (chatIdx) => {
    try {
      return await this.chatRepository.enterUserChat(chatIdx);
    } catch (error) {
      error;
    }
  };
}

module.exports = ChatService;
