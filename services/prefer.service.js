const PreferRepository = require("../repositories/prefer.repository");
const CardpostsRepository = require("../repositories/cardposts.repository");
const Boom = require("boom");

class PreferService {
  constructor() {
    this.preferRepository = new PreferRepository();
    this.cardpostsRepository = new CardpostsRepository();
  }

  // 포스트에 투표합니다.
  postPoll = async (userIdx, postIdx, proInputValue, conInputValue) => {
    try {
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
    } catch (error) {
      next(error);
    }
  };

  // 포스트의 결과를 봅니다.
  postPollResult = async (postIdx) => {
    try {
      return this.PostPollCount(postIdx);
    } catch (error) {
      next(error);
    }
  };

  // 포스트 좋아요와 싫어요의 카운트를 봅니다.
  PostPollCount = async (postIdx) => {
    const findOnepost = await this.cardpostsRepository.findOnePost(postIdx);

    try {
      if (!findOnepost) {
        throw Boom.badData("postIdx 값의 포스트가 존재하지 않습니다.");
      }

      const postProCount = await this.preferRepository.postProCount(postIdx);
      const postConCount = await this.preferRepository.postConCount(postIdx);

      return { proCount: postProCount, conCount: postConCount };
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PreferService;
