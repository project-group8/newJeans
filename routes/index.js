const express = require("express");
const router = express.Router();

const usersRouter = require("./users.route");
const cardPostsRouter = require("./cardposts.route");
const preferRouter = require("./prefer.route");
const replycommentsRouter = require("./replycomments.route"); // 추후에 기능 구현 할 수도 있음
const commentsRouter = require("./comments.route");
const commentLikesRouter = require('./commentLike.route.js');
const postlikeRouter = require("./postlike.route");

router.use("/user", usersRouter);
router.use("/postCards", cardPostsRouter);
router.use("/prefer", preferRouter);
router.use("/comment", commentsRouter);
router.use("/reply", replycommentsRouter);
router.use('/commentLike', commentLikesRouter);
router.use("/postlike", postlikeRouter);

module.exports = router;
