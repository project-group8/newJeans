const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const ReplyCommentController = require('../controllers/replycomments.controller');
const replyCommentController = new ReplyCommentController();

// 대댓글 작성 
router.post('/:postIdx/:commentIdx', authMiddleware, replyCommentController.createReComment);
// 대댓글 조회
router.get('/:postIdx/:commentIdx', replyCommentController.getReComments);
// 대댓글 수정 
router.put('/:postIdx/:commentIdx/:replyIdx', authMiddleware, replyCommentController.updateReComment);
// 대댓글 삭제 
router.delete('/:postIdx/:commentIdx/:replyIdx', authMiddleware, replyCommentController.deleteReComment);


module.exports = router;
