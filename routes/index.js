const express = require("express");
const router = express.Router();

// const usersRouter = require("./users.route");
const cardPostsRouter = require("./cardposts.route");
// const likesRouter = require("./likes.route");
// const disLikesRouter = require("./dislikes.route");
// const replycommentsRouter = require("./replycomments.route"); // 추후에 기능 구현 할 수도 있음
const commentsRouter = require("./comments.route");

// router.use("/user", usersRouter);
router.use("/postCards", cardPostsRouter);
// router.use("/like", likesRouter);
// router.use("/dislike", disLikesRouter);
// router.use("/postCards/post/:postIdx", commentsRouter);
// router.use(
//   "/postCards/post/:postIdx/comments/:commentIdx",
//   replycommentsRouter
// );

module.exports = router;
