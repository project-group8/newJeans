const {
  CardPost,
  Users,
  UserInfo,
  Comment,
  Likes,
  DisLikes,
} = require("../models");

class CardpostsRepository {
  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (splitNumber, splitPageNumber) => {
    const findCardPosts = await CardPost.findAll({
      offset: splitNumber * (splitPageNumber - 1), // * (page - 1) 페이지당 게시글 수만큼 건너뛰기
      limit: splitNumber, // 페이지당 게시글 수만큼 가져오기
      attibutes: [
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
          where: { userIdx: userIdx },
        });
        const addUser = await Users.findOne({
          where: { userIdx: userIdx },
        });
        const postCommentCount = await Comment.findAll({
          where: { postIdx: postIdx },
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
          isImg: imgUrl ? true : false,
        };
      })
    );

    return renameSplitCards;
  };

  // [테스트 필요] 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async () => {
    const findCardPosts = await CardPost.findAll({
      attibutes: [
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
          where: { userIdx: userIdx },
        });
        const addUser = await Users.findOne({
          where: { userIdx: userIdx },
        });
        const postCommentCount = await Comment.findAll({
          where: { postIdx: postIdx },
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
          isImg: imgUrl ? true : false,
        };
      })
    );

    const postsWithIndex = await Promise.all(
      renameSplitCards.map(async (post) => {
        const index = await calculatePostIndex(post.postIdx);
        return { ...post.toJSON(), index };
      })
    );

    const top3Posts = postsWithIndex
      .sort((a, b) => b.index - a.index)
      .slice(0, 3);
    return top3Posts;
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

    const renamePost = Promise.all(
      findOnePost.map(async (ele) => {
        const addUserInfo = await UserInfo.findOne({
          where: { userIdx: userIdx },
        });
        const addUser = await Users.findOne({
          where: { userIdx: userIdx },
        });
        const postCommentCount = await Comment.findAll({
          where: { postIdx: postIdx },
        });
        const likesCounts = await Likes.findAll({
          where: { postIdx: postIdx },
        });
        const disLikesCounts = await DisLikes.findAll({
          where: { postIdx: postIdx },
        });
        return {
          postIdx: ele.postIdx,
          title: ele.title,
          userLevel: addUserInfo.level,
          category: ele.category,
          desc: ele.desc,
          createdAt: ele.createdAt,
          nickname: addUser.nickname,
          postViewCount: ele.viewCount,
          commentCount: postCommentCount.length || 0,
          likesCount: likesCounts.length || 0,
          disLikesCount: disLikesCounts.length || 0,
          imgUrl: !ele.imgUrl
            ? ""
            : ele.imgUrl.replace(/\s/g, "").substring(0, 4) == "http"
            ? ele.imgUrl.replace(/\s/g, "").split(",")
            : [
                ele.imgUrl
                  .replace(/\s/g, "")
                  .split(",")
                  .slice(0, 2)
                  .trim()
                  .join(","),
              ],
          tag: !ele.tag ? "" : ele.tag.trim().split(","),
        };
      })
    );

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
    (post.postViewCount +
      (await Likes.findAll(post.postIdx).length) * getRandomIntInclusive(3, 5) +
      (await Comment.findAll(post.postIdx).length) *
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
