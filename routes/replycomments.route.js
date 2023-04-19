const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const ReplyCommentController = require('../controllers/replycomments.controller');
const replyCommentController = new ReplyCommentController();

// 답글 작성 
router.post('/:postIdx/:commentIdx', authMiddleware, replyCommentController.createReComment);
// 답글 조회
router.get('/:postIdx/:commentIdx', replyCommentController.getReComments);
// 답글 수정 
router.put('/:postIdx/:commentIdx/:replyIdx', authMiddleware, replyCommentController.updateReComment);
// 답글 삭제 
router.delete('/:postIdx/:commentIdx/:replyIdx', authMiddleware, replyCommentController.deleteReComment);


module.exports = router;
