const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const CommentController = require('../controllers/comments.controller');

const commentController = new CommentController();

// 댓글 작성 
router.post('/postCards/post/:postIdx/comments', authMiddleware, commentController.createComment);
// 댓글 조회
router.get('/postCards/post/:postIdx/comments', commentController.getComments);
// 댓글 수정 
router.put('/postCards/post/:postIdx/comments/:commentIdx', authMiddleware, commentController.updateComment);
// 댓글 삭제 
router.delete('/postCards/post/:postIdx/comments/:commentIdx', authMiddleware, commentController.deleteComment);
// 댓글 권한 조회
// router.get('/authChk/:commentId', authMiddleware, commentController.getAuth);

module.exports = router;
