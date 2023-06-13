const {
  Users,
  Prefer,
  Chat,
  CardPost,
  Comment,
  PostLike,
  CommentLike,
  ChatSaves,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const { parseModelToFlatObject } = require("../helpers/sequelize.helper");

// selectprefer: 0 디폴트
// 7. 포스트 찬성 8. 포스트 반대.

class ChatRepository {
  createUserChat = async (userIdx, maxParty, roomName) => {
    const test = await Chat.create({
      userIdx: userIdx,
      maxParty: maxParty,
      roomName: roomName,
    });

    return test;
  };

  checkroomName = async (roomName) => {
    return await Chat.findOne({ where: { roomName } });
  };

  enterUserChat = async (splitNumber, splitPageNumber) => {
    const findUserChat = await Chat.findAll({
      order: [["createdAt", "DESC"]],
      offset: splitNumber * (splitPageNumber - 1), // * (page - 1) 페이지당 게시글 수만큼 건너뛰기
      limit: splitNumber, // 페이지당 게시글 수만큼 가져오기
      subQuery: false,
      attributes: ["chatIdx", "userIdx", "roomName", "maxParty"],
      raw: true,
    });

    const reName = await Promise.all(
      findUserChat.map(async (ele) => {
        const findUserNick = await Users.findOne({
          where: { userIdx: ele.userIdx },
          attributes: ["nickname"],
          raw: true,
        });
        return {
          chatIdx: ele.chatIdx,
          roomName: ele.roomName,
          maxParty: ele.maxParty,
          nickname: findUserNick.nickname,
        };
      })
    );

    return reName;
  };

  deleteUserChat = async (userIdx, roomName) => {
    return await Chat.destroy({ where: { userIdx, roomName } });
  };

  findChat = async (roomName) => {
    return await Chat.findOne({ where: { roomName } });
  };

  adminUser = async (roomName) => {
    const findUserChat = await Chat.findOne({
      where: { roomName },
      include: [{ model: Users, attributes: ["nickname"] }],
      raw: true,
    });

    // Manually change 'User.nickname' to 'nickname'
    const result = { ...findUserChat, nickname: findUserChat["User.nickname"] };
    delete result["User.nickname"];

    return result;
  };

  // nest done
  findChatSave = async (chatSaveIdx) => {
    const findChat = await ChatSaves.findOne({
      where: { chatSaveIdx: chatSaveIdx },
      attributes: ["saveData"],
      raw: true,
    });

    return findChat;
  };

  chatSave = async (saveDataChat) => {
    const findChat = await ChatSaves.create({
      saveData: saveDataChat,
    });

    return findChat;
  };

  doneChat = async () => {
    const allchatroom = await ChatSaves.findAll({
      attributes: ["chatSaveIdx", "room"],
    });

    return allchatroom;
  };
}

module.exports = ChatRepository;
