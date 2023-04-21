const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const allusersMiddleware = require("../middlewares/allusersMiddleware");
const postCountUpMiddleware = require("../middlewares/postCountUpMiddleware");
const router = express.Router();
const upload = require("../modules/multer");
const CardpostsController = require("../controllers/cardposts.controller");
const cardpostsController = new CardpostsController();

// 쿼리스트링에 따라서 페이지 네이션 기능을 합니다.
router.get("/", cardpostsController.findSplitCards);

// 인기게시글 3개 가져오기
router.get("/hotPostCard", cardpostsController.findHotCards);

// 게시글 상세 가져오기 1.
router.get(
  "/post/:postIdx",
  allusersMiddleware,
  postCountUpMiddleware,
  cardpostsController.findOnePost
);

// 게시글 상세 가져오기 2.Contents
router.get(
  "/post/contents/:postIdx",
  allusersMiddleware,
  cardpostsController.findOnePostContents
);

// 게시글 상세 가져오기 3. Categorys
router.get("/post/category/:postIdx", cardpostsController.findOnePostCategorys);

// 게시글 작성하기
router.post(
  "/post/createPost",
  authMiddleware,
  upload.array("img", 4),
  cardpostsController.postCard
);

// 게시글 수정하기
router.put(
  "/post/createPost/:postIdx",
  authMiddleware,
  upload.array("img", 4),
  cardpostsController.updatePost
);

// 게시글 삭제하기
router.delete(
  "/post/createPost/:postIdx",
  authMiddleware,
  cardpostsController.deletePost
);

module.exports = router;
