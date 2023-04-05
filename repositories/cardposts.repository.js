const { CardPost, Users, UserInfo, Comment, Prefer } = require("../models");
const moment = require("moment");

class CardpostsRepository {
  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다. [작동하는지 확인하고 수정하기]
  findSplitCards = async (splitNumber, splitPageNumber) => {
    const findCardPosts = await CardPost.findAll({
      order: [["createdAt", "DESC"]], // createdAt 역순으로 정렬
      offset: splitNumber * (splitPageNumber - 1), // * (page - 1) 페이지당 게시글 수만큼 건너뛰기
      limit: splitNumber, // 페이지당 게시글 수만큼 가져오기
      attributes: [
        "postIdx",
        "userIdx",
        "category",
        "title",
        "desc",
        "createdAt",
        "viewCount",
        "imgUrl",
      ],
    });

    const renameSplitCards = await Promise.all(
      findCardPosts.map(async (ele) => {
        const addUserInfo = await UserInfo.findOne({
          where: { userIdx: ele.userIdx },
        });
        const addUser = await Users.findOne({
          where: { userIdx: ele.userIdx },
        });
        const postCommentCount = await Comment.findAll({
          where: { postIdx: ele.postIdx },
        });

        return {
          postIdx: ele.postIdx,
          category: ele.category,
          userLevel: addUserInfo.level,
          title: ele.title,
          desc: ele.desc,
          createdAt: ele.createdAt,
          nickname: addUser.nickname,
          postViewCount: ele.viewCount,
          commentCount: postCommentCount.length || 0,
          isImg: ele.imgUrl ? true : false,
        };
      })
    );

    return renameSplitCards;
  };

  // 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async () => {
    const findCardPosts = await CardPost.findAll({
      attributes: [
        "postIdx",
        "userIdx",
        "category",
        "title",
        "desc",
        "createdAt",
        "viewCount",
        "imgUrl",
      ],
    });

    const renameSplitCards = await Promise.all(
      findCardPosts.map(async (ele) => {
        const addUserInfo = await UserInfo.findOne({
          where: { userIdx: ele.userIdx },
        });
        const addUser = await Users.findOne({
          where: { userIdx: ele.userIdx },
        });
        const postCommentCount = await Comment.findAll({
          where: { postIdx: ele.postIdx },
        });

        return {
          postIdx: ele.postIdx,
          category: ele.category,
          userLevel: addUserInfo.level,
          title: ele.title,
          desc: ele.desc,
          createdAt: ele.createdAt,
          nickname: addUser.nickname,
          postViewCount: ele.viewCount,
          commentCount: postCommentCount.length || 0,
          isImg: ele.imgUrl ? true : false,
        };
      })
    );

    const postsWithIndex = await Promise.all(
      renameSplitCards.map(async (post) => {
        const index = await calculatePostIndex(post.postIdx);
        return { post, index };
      })
    );

    const top3Posts = postsWithIndex
      .sort((a, b) => b.index - a.index)
      .slice(0, 3);

    const top3PostObjects = top3Posts.map((item) => item.post);

    return top3PostObjects;
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (postIdx) => {
    const findOnePost = await CardPost.findOne({
      where: { postIdx: postIdx },
      attibutes: [
        "postIdx",
        "userIdx",
        "category",
        "title",
        "desc",
        "createdAt",
        "viewCount",
        "imgUrl",
        "tag",
      ],
    });
    const addUserInfo = await UserInfo.findOne({
      where: { userIdx: findOnePost.userIdx },
    });
    const addUser = await Users.findOne({
      where: { userIdx: findOnePost.userIdx },
    });
    const postCommentCount = await Comment.findAll({
      where: { postIdx: findOnePost.postIdx },
    });
    const PreferlikeCounts = await Prefer.count({
      where: { postIdx: findOnePost.postIdx, selectprefer: "1" },
    });

    const PreferdisLikesCounts = await Prefer.count({
      where: { postIdx: findOnePost.postIdx, selectprefer: "2" },
    });

    const renamePost = {
      postIdx: findOnePost.postIdx,
      title: findOnePost.title,
      userLevel: addUserInfo.level,
      category: findOnePost.category,
      desc: findOnePost.desc,
      createdAt: findOnePost.createdAt,
      nickname: addUser.nickname,
      postViewCount: findOnePost.viewCount,
      commentCount: postCommentCount.length || 0,
      likesCount: PreferlikeCounts || 0,
      disLikesCount: PreferdisLikesCounts || 0,
      imgUrl: !findOnePost.imgUrl
        ? ""
        : findOnePost.imgUrl.replace(/\s/g, "").substring(0, 4) == "http"
        ? findOnePost.imgUrl.replace(/\s/g, "").split(",")
        : [
            findOnePost.imgUrl
              .replace(/\s/g, "")
              .split(",")
              .slice(0, 2)
              .trim()
              .join(","),
          ],
      tag: !findOnePost.tag ? "" : findOnePost.tag.trim().split(","),
    };

    return renamePost;
  };

  postCard = async (title, category, desc, tag, imgUrl, userIdx) => {
    await CardPost.create({
      title,
      category,
      desc,
      tag: tag || "",
      imgUrl: imgUrl || "",
      userIdx,
      viewCount: 0,
    });

    return;
  };

  updatePost = async (postIdx, title, category, desc, tag, imgUrl) => {
    await CardPost.update(
      { title, category, desc, tag, imgUrl },
      { where: { postIdx: postIdx } }
    );

    return;
  };

  // title, category, desc값이 비워져있다면 포스트 수정하기 전의 값을 반환합니다.
  nullCheck = async (postIdx, title, category, desc) => {
    const checkTitle = nullFill(title, CardPost, postIdx);
    const checkCategory = nullFill(category, CardPost, postIdx);
    const checkDesc = nullFill(desc, CardPost, postIdx);

    return { checkTitle, checkCategory, checkDesc };
  };

  deletePost = async (postIdx) => {
    await CardPost.destroy({
      where: { postIdx: postIdx },
    });

    return;
  };
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function calculatePostIndex(postId) {
  const post = await CardPost.findByPk(postId);
  const daysElapsed = moment().diff(post.createdAt, "days");

  const index =
    (post.viewCount +
      ((await Prefer.findAll({
        where: { postIdx: post.postIdx, selectprefer: "1" },
      }).length) || 0) *
        getRandomIntInclusive(3, 5) +
      ((await Comment.count({ where: { postIdx: post.postIdx } }).length) ||
        0) *
        getRandomIntInclusive(5, 10)) /
    Math.pow(daysElapsed, 0.8);

  return index;
}

// Model table을 설정하고 postIdx에 맞는 value 프로퍼티를 찾습니다.
// 인자 value가 값이 없다면 설정한 table에서 value값을 찾아서 돌려줍니다.
async function nullFill(value, table, postIdx) {
  if (!value) {
    const fill = await table.findOne({
      where: { postIdx },
      attibutes: [`${value}`],
    });
    return fill.value;
  } else {
    return value;
  }
}

module.exports = CardpostsRepository;
