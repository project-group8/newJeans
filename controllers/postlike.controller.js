const PostLikeService = require("../services/postlike.service");
const Boom = require("boom");
class PostLikeController {
  constructor() {
    this.postLikeService = new PostLikeService();
  }

  /**
   * Post 좋아요 토글
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  postToggleLike = async (req, res, next) => {
    const { email } = res.locals.user;
    const { tableIdx } = req.params;

    if (!tableIdx) {
      throw Boom.badRequest("tableIdx 값은 비어있을 수 없습니다.");
    }

    try {
      // 좋아요 토글 실행 코드
      const toggle = await this.postLikeService.postToggleLike(email, tableIdx);
      return res.status(200).json({ message: toggle });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PostLikeController;
