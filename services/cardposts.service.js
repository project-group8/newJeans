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

  /**
   * splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
   *
   * @param {*} maincategory
   * @param {*} category
   * @param {*} splitNumber
   * @param {*} splitPageNumber
   * @returns
   */
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

  /**
   * 로그인 한 유저일 경우에 상세페이지의 isLike를 판별합니다.
   *
   * @param {string} email
   * @param {UUID} postIdx
   * @returns
   */
  findOneUserLike = async (email, postIdx) => {
    const findOneUser = await this.cardpostsRepository.findOneUser(email);
    const userIdx = findOneUser.userIdx;
    const findOneUserLike = await this.cardpostsRepository.findOneIogInPost(
      userIdx,
      postIdx
    );

    return findOneUserLike;
  };

  // postIdx로 지정한 카드를 불러들입니다. 비로그인 유저이기 때문에 isLike는 false입니다.
  findOnePost = async (postIdx) => {
    const findOnePost = await this.cardpostsRepository.findOnePost(postIdx);

    return findOnePost;
  };

  /**
   * 지정한 카드의 content를 불러들입니다.
   *
   * @param {UUID} postIdx
   * @returns
   */
  findOnePostContents = async (postIdx) => {
    const findContents = await this.cardpostsRepository.findOnePostContents(
      postIdx
    );
    findContents.conCount = await this.preferRepository.postConCount(postIdx);
    findContents.proCount = await this.preferRepository.postProCount(postIdx);
    findContents.proInputValue = false;
    findContents.conInputValue = false;

    return findContents;
  };

  /**
   * 로그인 유저가 지정한 카드의 content를 불러들이고 어디에 투표했는지 봅니다.
   *
   * @param {UUID} postIdx
   * @returns
   */
  userFindOnePostContents = async (userIdx, postIdx) => {
    // 0. user가 투표 했는지 여부를 검증한다.
    // 1. user가 투표를 하지 않았다. false false
    // 2. user가 찬성에 투표했다.
    // 3. user가 반대에 투표했다.
    // final. 투표 결과는 모든 데이터가 공유해도 된다.

    // 현재 포스트를 검색한다 그리고 count를 측정한다.
    const findContents = await this.cardpostsRepository.findOnePostContents(
      postIdx
    );

    // 현재 포스트에서 user가 투표를 했는지 알아본다.
    const findPollUserCheckValue =
      await this.preferRepository.findPollUserCheckValue(userIdx, postIdx);

    // 투표를 했다면 어디에 했는지 검증한다.
    if (findPollUserCheckValue) {
      const { selectprefer } = findPollUserCheckValue;

      if (selectprefer == "7") {
        findContents.proInputValue = true;
        findContents.conInputValue = false;
        return findContents;
      } else if (selectprefer == "8") {
        findContents.proInputValue = true;
        findContents.conInputValue = false;
        return findContents;
      }
    }

    return findContents;
  };

  /**
   * 지정한 카드의 category 정보를 불러들입니다.
   *
   * @param {UUID} postIdx
   * @returns
   */
  findOnePostCategorys = async (postIdx) => {
    return await this.cardpostsRepository.findOnePostCategorys(postIdx);
  };

  /**
   * 포스트를 작성합니다.
   *
   * @param {UUID} userIdx
   * @param {string} title
   * @param {string} maincategory
   * @param {string} category
   * @param {string} desc
   * @param {string} tag
   * @param {string} imgUrl
   * @param {string} pollTitle
   * @param {string} pollType
   * @returns
   */
  postCard = async (
    userIdx,
    title,
    maincategory,
    category,
    desc,
    tag,
    imgUrl,
    pollTitle,
    pollType
  ) => {
    await this.cardpostsRepository.postCard(
      title,
      maincategory,
      category,
      desc,
      tag,
      imgUrl,
      userIdx,
      pollTitle,
      pollType
    );

    return;
  };

  /**
   * 포스트를 수정합니다.
   *
   * @param {UUID} userIdx
   * @param {UUID} postIdx
   * @param {string} title
   * @param {string} maincategory
   * @param {string} category
   * @param {string} desc
   * @param {string} tag
   * @param {string} imgUrl
   * @param {string} pollTitle
   * @returns
   */
  updatePost = async (
    userIdx,
    postIdx,
    title,
    maincategory,
    category,
    desc,
    tag,
    imgUrl,
    pollTitle
  ) => {
    await this.cardpostsRepository.updatePost(
      userIdx,
      postIdx,
      title,
      maincategory,
      category,
      desc,
      tag,
      imgUrl,
      pollTitle
    );

    return;
  };

  // 포스트를 삭제합니다.
  deletePost = async (userIdx, postIdx) => {
    await this.cardpostsRepository.deletePost(userIdx, postIdx);
    return;
  };
}

module.exports = CardpostsService;
