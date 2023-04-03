const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

const CardpostsController = require("../controllers/cardposts.controller");
const cardpostsController = new CardpostsController();

//authMiddleware 장착해야함
router.get("/", cardpostsController.findSplitCards);

router.get("/hotPostCard", cardpostsController.findHotCards);

router.get("/post/:postIdx", cardpostsController.findOnePost);

// router.get("/:gameId", gamesController.getOneGame);

// router.post("/", authMiddleware, gamesController.postGame);

// router.put("/:gameId", authMiddleware, gamesController.updateOption);

// router.delete("/:gameId", authMiddleware, gamesController.deleteOneGame);

module.exports = router;
