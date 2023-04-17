const CommentLikeService = require('../services/commentLike.service');
const Boom = require('boom');

class CommentLikeController {
  constructor() {
    this.commentLikeService = new CommentLikeService();
  }

  updateLike = async (req, res, next) => {
    try {
      const { commentIdx } = req.params;
      const { userIdx } = res.locals.user;
    
        if (!commentIdx) {
            throw Boom.notFound('해당 댓글이 존재하지 않습니다.');
        }

        let isLike = await this.commentLikeService.findLike( userIdx, commentIdx );

        if (!isLike) {
            await this.commentLikeService.likeUpdate( userIdx, commentIdx );
      
            return res.status(200).json({ message: '댓글의 좋아요를 등록하였습니다' });
          } else {
            await this.commentLikeService.likeUndo( userIdx, commentIdx );
    
            return res.status(200).json({ message: '댓글의 좋아요를 취소하였습니다.' });
          }
      } catch (error) {
        next(error);
      }
  }

  getAllLike = async (req, res, next) => {
    try {
      const { commentIdx } = req.params;

      if (!commentIdx) {
        throw Boom.notFound('해당 댓글이 존재하지 않습니다.');
    }

      const likes = await this.commentLikeService.getAllLike( commentIdx );

      return res.status(200).json({ likes });
    } catch (error) {
     next(error);
    }
  
}

  
}

module.exports = CommentLikeController;
