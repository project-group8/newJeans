const {
  Users,
  Prefer,
  Chat,
  CardPost,
  Comment,
  PostLike,
  CommentLike,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const { parseModelToFlatObject } = require("../helpers/sequelize.helper");

// selectprefer: 0 디폴트
// 7. 포스트 찬성 8. 포스트 반대.

class ChatRepository {
  /**
   * 포스트에 대해서 찬성표를 던집니다.
   */
  createUserChat = async (userIdx, maxParty, roomName) => {
    console.log("ㅇㄴ하ㅣㅁ너;히나어;");
    console.log(await Chat.count());
    const test = await Chat.create({
      userIdx: userIdx,
      maxParty: maxParty,
      roomName: roomName,
    });

    return test;
  };

  enterUserChat = async (splitNumber, splitPageNumber) => {
    const findUserChat = await Chat.findAll({
      order: [["createdAt", "DESC"]],
      offset: splitNumber * (splitPageNumber - 1), // * (page - 1) 페이지당 게시글 수만큼 건너뛰기
      limit: splitNumber, // 페이지당 게시글 수만큼 가져오기
      subQuery: false,
      attributes: ["chatIdx", "userIdx", "roomName", "maxParty"],
      include: [
        {
          model: Users,
          where: {
            userIdx: Sequelize.col("Chat.userIdx"),
          },
          attributes: ["nickname"],
        },
      ],
      group: ["Chat.userIdx"],
      raw: true,
    });
    const findCardPosts = findUserChat.map(parseModelToFlatObject);
    console.log(findUserChat);
    return findCardPosts;
  };
}

module.exports = ChatRepository;
