const CardpostsRepository = require("../repositories/cardposts.repository");

class CardpostsService {
  constructor() {
    this.cardpostsRepository = new CardpostsRepository();
  }

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (splitNumber, splitPageNumber) => {
    const findSplitCards = await this.cardpostsRepository.findSplitCards(
      splitNumber,
      splitPageNumber
    );

    return findSplitCards;
  };

  // [미구현] 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async () => {
    const findHotCards = await this.cardpostsRepository.findHotCards();

    return findHotCards;
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (postIdx) => {
    const findOnePost = await this.cardpostsRepository.findOnePost(postIdx);

    return findOnePost;
  };
}

module.exports = CardpostsService;
