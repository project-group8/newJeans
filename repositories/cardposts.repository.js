const { CardPost, Users, Comment, PostLike, Prefer } = require("../models");
const { parseModelToFlatObject } = require("../helpers/sequelize.helper");
const { Op, Sequelize } = require("sequelize");

const moment = require("moment");

const PreferRepository = require("./prefer.repository");

class CardpostsRepository {
  constructor() {
    this.preferRepository = new PreferRepository();
  }

  //로그인 한 유저라면 IsLike의 상태를 볼 수 있습니다.
  findOneIogInPost = async (userIdx, postIdx) => {
    const findOnePost = await CardPost.findOne({
      where: { postIdx: postIdx },
      attibutes: [
        "postIdx",
        "userIdx",
        "title",
        "desc",
        "createdAt",
        "viewCount",
      ],
    });
    // const addUserInfo = await UserInfo.findOne({
    //   where: { userIdx: findOnePost.userIdx },
    // });
    const addUser = await Users.findOne({
      where: { userIdx: findOnePost.userIdx },
    });
    const postCommentCount = await Comment.findAll({
      where: { postIdx: findOnePost.postIdx },
    });
    const PreferlikeCounts = await PostLike.count({
      where: { postIdx: findOnePost.postIdx },
    });
    const PreferUserSelete = await PostLike.findOne({
      where: { userIdx, postIdx },
    });

    const renamePost = {
      postIdx: findOnePost.postIdx,
      title: findOnePost.title,
      // userLevel: addUserInfo.level, 추후에 해제
      desc: findOnePost.desc,
      createdAt: findOnePost.createdAt,
      nickname: addUser.nickname,
      IsLike: PreferUserSelete ? true : false,
      postViewCount: findOnePost.viewCount,
      commentCount: postCommentCount.length || 0,
      likesCount: PreferlikeCounts || 0,
    };

    return renamePost;
  };

  /**
   * email을 대조해서 유저를 찾습니다.
   *
   * @param {string} email
   * @returns
   */
  findOneUser = async (email) => {
    const findOneUser = await Users.findOne({ where: { email } });

    return findOneUser;
  };

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (
    maincategory,
    category,
    splitNumber,
    splitPageNumber
  ) => {
    const findCardPosts = await this.cardfindAll(
      maincategory,
      splitNumber,
      splitPageNumber,
      category
    );

    return findCardPosts;
  };

  // 특정 로직을 세우고 7일 안에 작성된 가장 인기있는 게시물 5개를 가져옵니다.
  findHotCards = async () => {
    const hotCardfindAll = await this.hotCardfindAll();

    const postsWithIndex = await Promise.all(
      hotCardfindAll.map(async (post) => {
        const index = await calculatePostIndex(post.postIdx);
        return { post, index };
      })
    );

    const top3Posts = postsWithIndex
      .sort((a, b) => b.index - a.index)
      .slice(0, 5);

    const top3PostObjects = top3Posts.map((item) => item.post);

    return top3PostObjects;
  };

  // 지정한 카드의 contents를 불러들입니다.
  findOnePostContents = async (postIdx) => {
    const [findPost, conCount, proCount] = await Promise.all([
      await CardPost.findOne({
        where: { postIdx: postIdx },
        attibutes: ["postIdx", "imgUrl", "tag", "pollTitle", "pollType"],
      }),
      await this.preferRepository.postConCount(postIdx),
      await this.preferRepository.postProCount(postIdx),
    ]);

    const findPostRename = {
      pollTitle: findPost.pollTitle,
      pollType: findPost.pollType,
      imgUrl: !findPost.imgUrl
        ? ""
        : findPost.imgUrl.replace(/\s/g, "").substring(0, 4) == "http"
        ? findPost.imgUrl.replace(/\s/g, "").split(",")
        : [
            findPost.imgUrl
              .replace(/\s/g, "")
              .split(",")
              .slice(0, 2)
              .trim()
              .join(","),
          ],
      tag: !findPost.tag ? "" : findPost.tag.trim().split(","),
      proInputValue: false,
      conInputValue: false,
      conCount: conCount,
      proCount: proCount,
    };

    return findPostRename;
  };

  // 지정한 카드의 category 정보를 불러들입니다.
  findOnePostCategorys = async (postIdx) => {
    return await CardPost.findOne({
      where: { postIdx: postIdx },
      attibutes: ["maincategory", "category"],
    });
  };

  // postIdx로 지정한 카드를 불러들입니다. 비로그인 유저이기 떄문에 IsLike는 false.
  findOnePost = async (postIdx) => {
    const findOnePost = await CardPost.findOne({
      where: { postIdx: postIdx },
      attibutes: [
        "postIdx",
        "userIdx",
        "title",
        "desc",
        "createdAt",
        "viewCount",
      ],
    });
    // const addUserInfo = await UserInfo.findOne({
    //   where: { userIdx: findOnePost.userIdx },
    // });
    const addUser = await Users.findOne({
      where: { userIdx: findOnePost.userIdx },
    });
    const postCommentCount = await Comment.findAll({
      where: { postIdx: findOnePost.postIdx },
    });
    const PreferlikeCounts = await PostLike.count({
      where: { postIdx: findOnePost.postIdx },
    });

    const renamePost = {
      postIdx: findOnePost.postIdx,
      title: findOnePost.title,
      // userLevel: addUserInfo.level, 추후에 해제
      desc: findOnePost.desc,
      createdAt: findOnePost.createdAt,
      nickname: addUser.nickname,
      IsLike: false,
      postViewCount: findOnePost.viewCount,
      commentCount: postCommentCount.length || 0,
      likesCount: PreferlikeCounts || 0,
    };

    return renamePost;
  };

  // 포스트를 작성합니다.
  postCard = async (
    title,
    maincategory,
    category,
    desc,
    tag,
    imgUrl,
    userIdx,
    pollTitle,
    pollType
  ) => {
    await CardPost.create({
      title,
      maincategory,
      category,
      desc,
      tag: tag || "",
      imgUrl: imgUrl || "",
      userIdx,
      viewCount: 0,
      pollTitle,
      pollType: pollType || "",
    });

    return;
  };

  // 포스트를 수정합니다.
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
    await CardPost.update(
      { title, maincategory, category, desc, tag, imgUrl, pollTitle },
      { where: { postIdx, userIdx } }
    );

    return;
  };

  // 포스트를 삭제합니다.
  deletePost = async (userIdx, postIdx) => {
    await CardPost.destroy({
      where: { postIdx, userIdx },
    });

    return;
  };

  // 인자값을 모두 넣게 되면 페이지네이션으로 작동합니다. 인자값이 없다면 모든 값을 찾아오는 기능을 합니다.
  cardfindAll = async (
    maincategory,
    splitNumber,
    splitPageNumber,
    category
  ) => {
    // 1. 메인카테고리 = 전체 AND 카테고리 = 전체.
    // 2. 메인카테고리 = 전체 AND 카테고리 = 선택카테고리
    // 3. 메인카테고리 = 유머, 진지 AND 카테고리 = 전체
    // 4. 메인카테고리 = 유머, 진지 AND 카테고리 = 선택카테고리

    const CardfindAll = await CardPost.findAll({
      where: {
        [Op.and]: [
          !maincategory ? {} : { maincategory },
          !category ? {} : { category },
        ],
      },
      order: [["createdAt", "DESC"]], // createdAt 역순으로 정렬
      offset: splitNumber * (splitPageNumber - 1), // * (page - 1) 페이지당 게시글 수만큼 건너뛰기
      limit: splitNumber, // 페이지당 게시글 수만큼 가져오기
      subQuery: false,
      attributes: [
        "postIdx",
        "maincategory",
        "category",
        "title",
        "desc",
        "createdAt",
        [Sequelize.col("viewCount"), "postViewCount"],
        "imgUrl",
      ],
      include: [
        { model: Users, attributes: ["nickname"] },
        {
          model: Comment,
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("commentIdx")),
              "commentCount",
            ],
          ],
        },
        {
          model: PostLike,
          attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("postLikeIdx")), "likesCount"],
          ],
        },
      ],
      group: ["CardPost.postIdx"],
      raw: true,
    });
    const findCardPosts = CardfindAll.map(parseModelToFlatObject);

    return findCardPosts;
  };

  // 7일 안에 작성된 게시글만 조회합니다.
  hotCardfindAll = async (
    maincategory,
    splitNumber,
    splitPageNumber,
    category
  ) => {
    // 1. 메인카테고리 = 전체 AND 카테고리 = 전체.
    // 2. 메인카테고리 = 전체 AND 카테고리 = 선택카테고리
    // 3. 메인카테고리 = 유머, 진지 AND 카테고리 = 전체
    // 4. 메인카테고리 = 유머, 진지 AND 카테고리 = 선택카테고리

    const sevenDaysAgo = moment().subtract(7, "days");
    const hotCardfindAll = await CardPost.findAll({
      where: {
        [Op.and]: [
          !maincategory ? {} : { maincategory },
          !category ? {} : { category },
          { createdAt: { [Op.gte]: sevenDaysAgo } },
        ],
      },
      order: [["createdAt", "DESC"]], // createdAt 역순으로 정렬
      offset:
        splitNumber && splitPageNumber
          ? splitNumber * (splitPageNumber - 1)
          : null, // * (page - 1) 페이지당 게시글 수만큼 건너뛰기
      limit: splitNumber ? splitNumber : null, // 페이지당 게시글 수만큼 가져오기
      attributes: [
        "postIdx",
        "maincategory",
        "category",
        "title",
        "desc",
        "createdAt",
        [Sequelize.col("viewCount"), "postViewCount"],
        [
          Sequelize.literal("CASE WHEN imgUrl = '' THEN false ELSE true END"),
          "isImg",
        ],
      ],
      include: [
        { model: Users, attributes: ["nickname"] },
        {
          model: Comment,
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("commentIdx")),
              "commentCount",
            ],
          ],
        },
        {
          model: PostLike,
          attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("postLikeIdx")), "likesCount"],
          ],
        },
      ],
      group: ["CardPost.postIdx"],
      raw: true,
    });
    const findCardPosts = hotCardfindAll.map(parseModelToFlatObject);

    return findCardPosts;
  };
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// index = 조회수 + (좋아요 * 3~5) + (댓글 수 * 5~10)
async function calculatePostIndex(postId) {
  const post = await CardPost.findOne({
    where: { postIdx: postId },
    include: [
      {
        model: PostLike,
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("postLikeIdx")), "likesCount"],
        ],
      },
      {
        model: Comment,
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("commentIdx")), "commentCount"],
        ],
      },
    ],
    group: ["CardPost.postIdx"],
    raw: true,
  });

  const index =
    post.viewCount +
    post["PostLikes.likesCount"] * getRandomIntInclusive(3, 5) +
    post["Comments.commentCount"] * getRandomIntInclusive(5, 10);

  return index;
}

module.exports = CardpostsRepository;
