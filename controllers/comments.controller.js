const Joi = require('joi');
const Boom = require('boom');
const CommentService = require('../services/comments.service');

const commentSchema = Joi.object({
    comment: Joi.string().required(), // 댓글 내용 require
  });

class CommentController {
  commentService = new CommentService();

   //댓글 작성
  createComment = async (req, res, next) => {
    try {
      const { postIdx } = req.params;
      const { comment, selectedTag } = req.body;
      const { userIdx } = res.locals.user;

      const resultSchema = await commentSchema.validate({ comment });
      if (resultSchema.error && comment.length < 1 ) {
        throw Boom.preconditionFailed('댓글 내용을 입력해주세요.'); //412
      }

      const seletPost = await this.commentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.'); //404
      }

      await this.commentService.createComment(
        postIdx,
        userIdx,
        comment,
        selectedTag
      );

      return res.status(200).json({
          message: '댓글을 작성하였습니다.',
      });
    } catch (error) {
      next(error)
    }
  };

   //댓글 조회
  getComments = async (req, res, next) => {
    try {
      const { postIdx } = req.params;

      const seletPost = await this.commentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const seletComments = await this.commentService.getComments(postIdx);

      return res.status(200).json({
        comments: seletComments,
      });
    } catch (error) {
        next(error)
    }
  };


   //댓글 수정
  updateComment = async (req, res, next) => {
    try {
      const { commentIdx, postIdx} = req.params;
      const { comment } = req.body;
      const { userIdx } = res.locals.user;

      const seletPost = await this.commentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const resultSchema = await commentSchema.validate({ comment });
      if (resultSchema.error && comment.length < 1 ) {
        throw Boom.preconditionFailed('댓글 내용을 입력해주세요.');
      }

      const chkAuthComment = await this.commentService.findAuth( commentIdx, userIdx );
      if (!chkAuthComment) {
        throw Boom.forbidden('댓글의 수정 권한이 없습니다.'); //403
      }

      await this.commentService.updateComment(
        commentIdx,
        comment,
        userIdx
      );

      return res.status(200).json({
        message: '댓글을 수정하였습니다.',
      });
    } catch (error) {
        next(error)
    }
  };


   //댓글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { commentIdx, postIdx } = req.params;
      const { userIdx } = res.locals.user;

      const seletPost = await this.commentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const chkAuthComment = await this.commentService.findAuth( commentIdx, userIdx );
      if (!chkAuthComment) {
        throw Boom.forbidden('댓글의 삭제 권한이 없습니다.');
      }

      await this.commentService.deleteComment(
        commentIdx,
      );

      return res.status(200).json({
        message: '댓글을 삭제하였습니다.',
      });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = CommentController;
