const PreferService = require("../services/prefer.service");
const Boom = require("boom");
class PreferController {
  constructor() {
    this.preferService = new PreferService();
  }

  // 좋아요 등록 및 취소
  postToggleLike = async (req, res, next) => {
    const { property, prefer } = req.query;
    const { userIdx } = res.locals.user;
    const { postIdx } = req.params;

    try {
      // 좋아요 토글 실행 코드
      if (prefer == "like") {
        const toggle = await this.preferService.postToggleLike(
          userIdx,
          postIdx,
          property
        );

        return res.status(200).json({ message: toggle });
      } else if (prefer == "dislike") {
        // 싫어요 토글 실행 코드
        const toggle = await this.preferService.postToggleDisLike(
          userIdx,
          postIdx,
          property
        );

        return res.status(200).json({ message: toggle });
      }
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PreferController;
