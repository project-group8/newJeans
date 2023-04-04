const Joi = require('joi');
const Boom = require('boom');
const CommentService = require('../services/comments.service');

const commentSchema = Joi.object({
    desc: Joi.string().required(), // 댓글 내용 require
  });

class CommentController {
  commentService = new CommentService();

   //댓글 작성
  createComment = async (req, res, next) => {
    try {
      const { postIdx } = req.params;
      const { desc } = req.body;
      const { userIdx } = res.locals.user;

      const resultSchema = await commentSchema.validate({ desc });
      if (resultSchema.error && desc.length < 1 ) {
        throw Boom.preconditionFailed('댓글 내용을 입력해주세요.');
      }

      const searchPost = await this.commentService.searchPost(postIdx)
      if (!searchPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      await this.commentService.createComment(
        postIdx,
        userIdx,
        desc
      );

      return res.status(200).json({
          message: '댓글을 작성하였습니다.',
      });
    } catch (error) {
        logger.error(error.message);
        throw error;
      }
  };

   //댓글 조회
  getComments = async (req, res, next) => {
    try {
      const { postIdx } = req.params;

      const searchPost = await this.commentService.searchPost(postIdx)
      if (!searchPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const getComments = await this.commentService.getComments(postIdx);

      return res.status(200).json({
        comments: getComments,
      });
    } catch (error) {
        logger.error(error.message);
        throw error;
      }
  };


   //댓글 수정
  updateComment = async (req, res, next) => {
    try {
      const { commentIdx } = req.params;
      const { desc } = req.body;
      const { userIdx } = res.locals.user;
      const resultSchema = await commentSchema.validate({ desc });
      
      // 스키마를 이용해 데이터를 검증한다
      if (resultSchema.error && desc.length < 1 ) {
        throw Boom.preconditionFailed('댓글 내용을 입력해주세요.');
      }

      await this.commentService.updateComment(
        commentIdx,
        desc,
        userIdx
      );

        return res.status(200).json({
          message: '댓글을 수정하였습니다.',
        });
    } catch (err) {
        logger.error(error.message);
        throw error;
    }
  };


   //댓글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { commentIdx } = req.params;
      const { userIdx } = res.locals.user;

      await this.commentService.deleteComment(
        commentIdx,
        userIdx
      );

      return res.status(200).json({
        message: '댓글을 삭제하였습니다.',
      });
    } catch (err) {
      logger.error(error.message);
      throw error;
  }
  };

   //댓글 권한 확인
  getAuth = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = res.locals.user;
      await this.commentService.checkAuth(commentId, userId);

      return res.status(200).json({
        message: '수정 및 삭제 권한이 확인 되었습니다.',
      });
    } catch (err) {
      logger.error(error.message);
      throw error;
  }
  };
}

module.exports = CommentController;
