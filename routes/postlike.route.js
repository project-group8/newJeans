const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const PostLikeController = require("../controllers/postlike.controller");
const postLikeController = new PostLikeController();

//nest done
router.put(
  "/post/:tableIdx",
  authMiddleware,
  postLikeController.postToggleLike
);

module.exports = router;
