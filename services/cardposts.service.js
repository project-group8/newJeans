const CardpostsRepository = require("../repositories/cardposts.repository");
const UserRepository = require("../repositories/users.repository");
const PreferRepository = require("../repositories/prefer.repository");
const Boom = require("boom");
class CardpostsService {
  constructor() {
    this.cardpostsRepository = new CardpostsRepository();
    this.userRepository = new UserRepository();
    this.preferRepository = new PreferRepository();
  }

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (
    maincategory,
    category,
    splitNumber,
    splitPageNumber
  ) => {
    switch (maincategory) {
      case "전체":
        maincategory = null;
        break;
    }
    switch (category) {
      case "전체":
        category = null;
        break;
    }

    const changesplitNumber = Number(splitNumber);
    const changesplitPageNumber = Number(splitPageNumber);

    const findSplitCards = await this.cardpostsRepository.findSplitCards(
      maincategory,
      category,
      changesplitNumber,
      changesplitPageNumber
    );

    return findSplitCards;
  };

  // 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async () => {
    const findHotCards = await this.cardpostsRepository.findHotCards();

    return findHotCards;
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (postIdx) => {
    const findOnePost = await this.cardpostsRepository.findOnePost(postIdx);

    return findOnePost;
  };

  // 포스트를 작성합니다.
  postCard = async (
    email,
    title,
    maincategory,
    category,
    desc,
    tag,
    imgUrl,
    pollTitle
  ) => {
    const findByID = await this.userRepository.findByID(email);
    const userIdx = findByID.userIdx;
    await this.cardpostsRepository.postCard(
      title,
      maincategory,
      category,
      desc,
      tag,
      imgUrl,
      userIdx,
      pollTitle
    );

    return;
  };

  // 포스트를 수정합니다.
  updatePost = async (
    email,
    postIdx,
    title,
    maincategory,
    category,
    desc,
    tag,
    imgUrl,
    pollTitle
  ) => {
    const findByID = await this.userRepository.findByID(email);
    const userIdx = findByID.userIdx;

    const nullCheck = await cardpostsRepository.nullCheck(
      postIdx,
      title,
      maincategory,
      category,
      desc
    );

    const { checkTitle, checkMainCategory, checkCategory, checkDesc } =
      nullCheck;

    await this.cardpostsRepository.updatePost(
      userIdx,
      postIdx,
      checkTitle,
      checkMainCategory,
      checkCategory,
      checkDesc,
      tag,
      imgUrl,
      pollTitle
    );

    return;
  };

  // 포스트를 삭제합니다.
  deletePost = async (email, postIdx) => {
    const findByID = await this.userRepository.findByID(email);
    const userIdx = findByID.userIdx;
    await this.cardpostsRepository.deletePost(userIdx, postIdx);
    return;
  };

  // 포스트에 투표합니다.
  postPoll = async (email, postIdx, proInputValue, conInputValue) => {
    const findByID = await this.userRepository.findByID(email);
    const userIdx = findByID.userIdx;
    if (proInputValue == true && conInputValue == true) {
      throw Boom.badRequest("값을 둘다 true로 줄 수 없습니다.");
    }

    if (proInputValue == true) {
      await this.preferRepository.postProInput(userIdx, postIdx);

      return this.PostPollCount(postIdx);
    } else if (conInputValue == true) {
      await this.preferRepository.postConInput(userIdx, postIdx);

      return this.PostPollCount(postIdx);
    }
  };

  // 포스트의 결과를 봅니다.
  postPollResult = async (postIdx) => {
    return this.PostPollCount(postIdx);
  };

  // 포스트 좋아요와 싫어요의 카운트를 봅니다.
  PostPollCount = async (postIdx) => {
    const postProCount = await this.preferRepository.postProCount(postIdx);
    const postConCount = await this.preferRepository.postConCount(postIdx);

    return { proCount: postProCount, conCount: postConCount };
  };
}

module.exports = CardpostsService;
