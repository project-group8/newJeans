const PostLikeRepository = require("../repositories/postlike.repository");
const CardpostsRepository = require("../repositories/cardposts.repository");
const Boom = require("boom");

class PostLikeService {
  constructor() {
    this.postLikeRepository = new PostLikeRepository();
    this.cardpostsRepository = new CardpostsRepository();
  }

  /**
   * 좋아요 등록 및 취소
   *
   * @param {string} email
   * @param {UUID} tableIdx
   * @returns
   */
  postToggleLike = async (email, tableIdx) => {
    const findOneUser = await this.cardpostsRepository.findOneUser(email);
    const userIdx = findOneUser.userIdx;

    const existsPosts = await this.postLikeRepository.findUserLike(tableIdx);

    if (!existsPosts) {
      throw Boom.notFound("좋아요 할 수있는 글이 존재하지 않습니다.");
    }

    try {
      const isLike = await this.postLikeRepository.findPostUserCheck(
        userIdx,
        tableIdx
      );

      if (!isLike) {
        await this.postLikeRepository.AddLike(tableIdx, userIdx);
        const message = "좋아요를 등록하였습니다.";

        return message;
      } else {
        await this.postLikeRepository.DeleteLike(tableIdx, userIdx);
        const message = "좋아요를 취소하였습니다.";

        return message;
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostLikeService;
