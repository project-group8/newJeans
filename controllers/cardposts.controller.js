const Boom = require("boom");
const CardpostsService = require("../services/cardposts.service");

class CardpostsController {
  constructor() {
    this.cardpostsService = new CardpostsService();
  }

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (req, res, next) => {
    const { splitNumber, splitPageNumber } = req.query;

    try {
      const findSplitCards = await this.cardpostsService.findSplitCards(
        splitNumber,
        splitPageNumber
      );
      return res.status(200).json({ postCards: findSplitCards });
    } catch (error) {
      throw error;
    }
  };

  // [미구현] 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async (req, res, next) => {
    try {
      const hotPostCards = await this.cardpostsService.findHotCards();
      return res.status(200).json({ postCards: hotPostCards });
    } catch (error) {
      throw error;
    }
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (req, res, next) => {
    const { postIdx } = req.body;

    try {
      const findOnePost = this.cardpostsService.findOnePost(postIdx);

      return res.status(200).json({ post: findOnePost });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CardpostsController;
