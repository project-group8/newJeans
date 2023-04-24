const {
  Prefer,
  Chat,
  CardPost,
  Comment,
  PostLike,
  CommentLike,
} = require("../models");
const { Op } = require("sequelize");

// selectprefer: 0 디폴트
// 7. 포스트 찬성 8. 포스트 반대.

class ChatRepository {
  /**
   * 포스트에 대해서 찬성표를 던집니다.
   */
  createUserChat = async (userIdx, title, maxParty, roomName) => {
    return await Chat.create({
      userIdx,
      title,
      maxParty,
      roomName,
    });
  };

  enterUserChat = async (chatIdx) => {
    return await Chat.findOne({
      where: { chatIdx },
      attributes: ["chatIdx", "roomName", "maxParty", "title"],
      include: [{ model: UserService, attributes: ["nickname"] }],
    });
  };
}

module.exports = ChatRepository;
