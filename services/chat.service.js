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

  adminUser = async (roomName) => {
    if (!this.chatRepository.findChat(roomName)) {
      throw Boom.badRequest("해당 채팅방이 존재하지 않습니다.");
    }

    const adminfind = await this.chatRepository.adminUser(roomName);

    return adminfind;
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

  findChatSave = async (chatSaveIdx) => {
    const findChatSave = await this.chatRepository.findChatSave(chatSaveIdx);

    return findChatSave;
  };

  chatSave = async (saveDataChat) => {
    const chatSave = await this.chatRepository.chatSave(saveDataChat);

    return chatSave;
  };

  doneChat = async () => {
    const allchatroom = await this.chatRepository.doneChat();

    return allchatroom;
  };
}

module.exports = ChatService;
