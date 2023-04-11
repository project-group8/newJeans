const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../modules/multer");
const CardpostsController = require("../controllers/cardposts.controller");
const cardpostsController = new CardpostsController();

router.get("/", cardpostsController.findSplitCards);

router.get("/hotPostCard", cardpostsController.findHotCards);

router.get("/post/:postIdx", cardpostsController.findOnePost);

router.get("/post/:postIdx/getPoll", cardpostsController.postPollResult);

router.post(
  "/post/createPost",
  authMiddleware,
  upload.array("img", 4),
  cardpostsController.postCard
);

router.post(
  "/post/:postIdx/createPoll",
  authMiddleware,
  cardpostsController.postPoll
);

router.put(
  "/post/createPost/:postIdx",
  authMiddleware,
  cardpostsController.updatePost
);

router.delete(
  "/post/createPost/:postIdx",
  authMiddleware,
  cardpostsController.deletePost
);

module.exports = router;
