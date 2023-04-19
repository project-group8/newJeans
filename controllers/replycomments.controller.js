const Joi = require('joi');
const Boom = require('boom');
const logger = require("../middlewares/logger.js");
const ReplyCommentService = require('../services/replycomments.service');

const reCommentSchema = Joi.object({
    comment: Joi.string().required(), // 댓글 내용 require
  });

class ReplyCommentController {
  replycommentService = new ReplyCommentService();

   //답글 작성
  createReComment = async (req, res, next) => {
    try {
      const { postIdx, commentIdx } = req.params;
      const { comment } = req.body;
      const { userIdx } = res.locals.user;

      const resultSchema = await reCommentSchema.validate({ comment });
      if (resultSchema.error && comment.length < 1 ) {
        throw Boom.preconditionFailed('답글 내용을 입력해주세요.'); //412
      }

      const seletPost = await this.replycommentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.'); //404
      }

      const seletComment = await this.replycommentService.findComment(commentIdx)
      if (!seletComment) {
        throw Boom.notFound('해당 댓글은 존재하지 않습니다.'); 
      }

      await this.replycommentService.createReComment(
        commentIdx,
        postIdx,
        userIdx,
        comment
      );

      return res.status(200).json({
          message: '답글을 작성하였습니다.',
      });
    } catch (error) {
      next(error)
    }
  };

   //답글 조회
  getReComments = async (req, res, next) => {
    try {
      const { postIdx, commentIdx } = req.params;

      const seletPost = await this.replycommentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const seletComment = await this.replycommentService.findComment(commentIdx)
      if (!seletComment) {
        throw Boom.notFound('해당 댓글은 존재하지 않습니다.'); 
      }

      const seletReComments = await this.replycommentService.getReComments(commentIdx);

      return res.status(200).json({
        replys : seletReComments
      });
    } catch (error) {
      next(error)
    }
  };


   //답글 수정
  updateReComment = async (req, res, next) => {
    try {
      const { commentIdx, postIdx, replyIdx } = req.params;
      const { comment } = req.body;
      const { userIdx } = res.locals.user;

      const seletPost = await this.replycommentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const seletComment = await this.replycommentService.findComment(commentIdx)
      if (!seletComment) {
        throw Boom.notFound('해당 댓글은 존재하지 않습니다.'); 
      }

      const resultSchema = await reCommentSchema.validate({ comment });
      if (resultSchema.error && comment.length < 1 ) {
        throw Boom.preconditionFailed('답글 내용을 입력해주세요.');
      }

      const chkAuthComment = await this.replycommentService.findAuth( replyIdx, userIdx );
      if (!chkAuthComment) {
        throw Boom.forbidden('답글의 수정 권한이 없습니다.'); 
      }

      await this.replycommentService.updateReComment(
        replyIdx,
        comment,
        userIdx
      );

      return res.status(200).json({
        message: '답글을 수정하였습니다.',
      });
    } catch (error) {
      next(error)
    }
  };


   //답글 삭제
  deleteReComment = async (req, res, next) => {
    try {
      const { commentIdx, postIdx, replyIdx } = req.params;
      const { userIdx } = res.locals.user;

      const seletPost = await this.replycommentService.findPost(postIdx)
      if (!seletPost) {
        throw Boom.notFound('해당 게시글은 존재하지 않습니다.');
      }

      const seletComment = await this.replycommentService.findComment(commentIdx)
      if (!seletComment) {
        throw Boom.notFound('해당 댓글은 존재하지 않습니다.'); 
      }

      const chkAuthComment = await this.replycommentService.findAuth(replyIdx, userIdx);
      if (!chkAuthComment) {
        throw Boom.forbidden('답글의 삭제 권한이 없습니다.');
      }

      await this.replycommentService.deleteReComment(
        replyIdx
      );

      return res.status(200).json({
        message: '답글을 삭제하였습니다.',
      });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = ReplyCommentController;
