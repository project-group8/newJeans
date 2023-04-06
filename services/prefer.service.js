const PreferRepository = require("../repositories/prefer.repository");
const CardpostsRepository = require("../repositories/cardposts.repository");
const Boom = require("boom");

class PreferService {
  constructor() {
    this.preferRepository = new PreferRepository();
    this.cardpostsRepository = new CardpostsRepository();
  }

  // 좋아요 등록 및 취소
  postToggleLike = async (userIdx, postIdx, property) => {
    // 쿼리스트링으로 들어온 property를 Model에 맞게 변환 합니다.
    switch (property) {
      case "post":
        property = "1";
        break;
      case "comment":
        property = "3";
        break;
      case "replycomment":
        property = "5";
        break;
      default:
        throw Boom.badRequest(`${property}가 올바르지 않습니다.`);
    }

    const existsPosts = await this.cardpostsRepository.findOnePost(postIdx);

    if (!existsPosts) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    try {
      const isLike = await this.preferRepository.findPostUserCheck(
        userIdx,
        postIdx
      );

      if (!isLike) {
        await this.preferRepository.AddLike(postIdx, userIdx, property);
        const message = "좋아요를 등록하였습니다.";

        return message;
      } else if (isLike.selectprefer == property) {
        await this.preferRepository.DeleteLike(postIdx, userIdx, property);
        const message = "좋아요를 취소하였습니다.";

        return message;
      }
    } catch (error) {
      throw Boom.badRequest(
        "좋아요 토글 과정에서 알 수없는 에러가 발생 했습니다."
      );
    }
  };

  // 싫어요 등록 및 취소
  postToggleDisLike = async (userIdx, postIdx, property) => {
    // 쿼리스트링으로 들어온 property를 Model에 맞게 변환 합니다.
    switch (property) {
      case "post":
        property = "2";
        break;
      case "comment":
        property = "4";
        break;
      case "replycomment":
        property = "6";
        break;
      default:
        throw Boom.badRequest(`${property}가 올바르지 않습니다.`);
    }

    const existsPosts = await this.cardpostsRepository.findOnePost(postIdx);

    if (!existsPosts) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    try {
      const isLike = await this.preferRepository.findPostUserCheck(
        userIdx,
        postIdx
      );

      if (!isLike) {
        await this.preferRepository.AddDisLike(postIdx, userIdx, property);
        const message = "싫어요를 등록하였습니다.";

        return message;
      } else if (isLike.selectprefer == property) {
        await this.preferRepository.DeleteDisLike(postIdx, userIdx, property);
        const message = "싫어요를 취소하였습니다.";

        return message;
      }
    } catch (error) {
      throw Boom.badRequest(
        "싫어요 토글 과정에서 알 수없는 에러가 발생 했습니다."
      );
    }
  };
}

module.exports = PreferService;
