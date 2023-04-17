const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authMiddlewareLike = require('../middlewares/authMiddlewareLike');

const CommentLikeController = require('../controllers/commentLike.controller');
const commentLikeController = new CommentLikeController();

router.get('/:commentIdx', authMiddlewareLike, commentLikeController.getAllLike);
router.put('/:commentIdx', authMiddleware, commentLikeController.updateLike);


module.exports = router;