const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authMiddlewareLike = require('../middlewares/authMiddlewareLike');

const CommentLikeController = require('../controllers/commentLike.controller');
const commentLikeController = new CommentLikeController();

router.get('/:commentIdx', commentLikeController.getAllLike);
router.put('/:postIdx/:commentIdx', authMiddleware, commentLikeController.updateLike);

module.exports = router;