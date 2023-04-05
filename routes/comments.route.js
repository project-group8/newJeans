const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const CommentController = require('../controllers/comments.controller');
const commentController = new CommentController();

// 댓글 작성 
router.post('/:postIdx', authMiddleware, commentController.createComment);
// 댓글 조회
router.get('/:postIdx', commentController.getComments);
// 댓글 수정 
router.put('/:postIdx/:commentIdx', authMiddleware, commentController.updateComment);
// 댓글 삭제 
router.delete('/:postIdx/:commentIdx', authMiddleware, commentController.deleteComment);


module.exports = router;
