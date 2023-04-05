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
  findSplitCards = async (splitNumber, splitPageNumber) => {
    const changesplitNumber = Number(splitNumber);
    const changesplitPageNumber = Number(splitPageNumber);

    const findSplitCards = await this.cardpostsRepository.findSplitCards(
      changesplitNumber,
      changesplitPageNumber
    );

    return findSplitCards;
  };

  // [테스트 필요] 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async () => {
    const findHotCards = await this.cardpostsRepository.findHotCards();

    return findHotCards;
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (postIdx) => {
    const findOnePost = await this.cardpostsRepository.findOnePost(postIdx);

    return findOnePost;
  };

  postCard = async (title, category, desc, tag, imgUrl) => {
    const findByID = await this.userRepository.findByID(email);
    const userIdx = findByID.userIdx;
    await this.cardpostsRepository.postCard(
      title,
      category,
      desc,
      tag,
      imgUrl,
      userIdx
    );

    return;
  };

  updatePost = async (postIdx, title, category, desc, tag, imgUrl) => {
    const nullCheck = await cardpostsRepository.nullCheck(
      postIdx,
      title,
      category,
      desc
    );

    const { checkTitle, checkCategory, checkDesc } = nullCheck;

    await this.cardpostsRepository.updatePost(
      postIdx,
      checkTitle,
      checkCategory,
      checkDesc,
      tag,
      imgUrl
    );

    return;
  };

  deletePost = async (postIdx) => {
    await this.cardpostsRepository.deletePost(postIdx);
    return;
  };

  postPoll = async (userIdx, postIdx, proInputValue, conInputValue) => {
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

  postPollResult = async (postIdx) => {
    return this.PostPollCount(postIdx);
  };

  PostPollCount = async (postIdx) => {
    const postProCount = await this.preferRepository.postProCount(postIdx);
    const postConCount = await this.preferRepository.postConCount(postIdx);

    return { proCount: postProCount, conCount: postConCount };
  };
}

module.exports = CardpostsService;
