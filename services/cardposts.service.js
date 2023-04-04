const CardpostsRepository = require("../repositories/cardposts.repository");
const UserRepository = require("../repositories/users.repository");
const LikesRepository = require("../repositories/likes.repository");
const DisLikesRepository = require("../repositories/dislikes.repository");
class CardpostsService {
  constructor() {
    this.cardpostsRepository = new CardpostsRepository();
    this.likesRepository = new LikesRepository();
    this.userRepository = new UserRepository();
    this.disLikesRepository = new DisLikesRepository();
  }

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (splitNumber, splitPageNumber) => {
    const findSplitCards = await this.cardpostsRepository.findSplitCards(
      splitNumber,
      splitPageNumber
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
    await this.cardpostsRepository.updatePost(
      postIdx,
      title,
      category,
      desc,
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
      throw error;
    }

    if (proInputValue == true) {
      await this.likesRepository.postProInput(userIdx, postIdx);

      return PostPollCount(postIdx);
    } else if (conInputValue == true) {
      await this.disLikesRepository.postConInput(userIdx, postIdx);

      return PostPollCount(postIdx);
    }
  };

  postPollResult = async (postIdx) => {
    return PostPollCount(postIdx);
  };
}

async function PostPollCount(postIdx) {
  const postProCount = await this.likesRepository.postProCount(postIdx);
  const postConCount = await this.disLikesRepository.postConCount(postIdx);

  return { proCount: postProCount, conCount: postConCount };
}

module.exports = CardpostsService;
