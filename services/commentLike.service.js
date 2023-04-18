const CommentLikeRepository = require('../repositories/commentLike.repository');


class CommentLikeService {
  constructor() {
    this.commentLikeRepository = new CommentLikeRepository();
  }
  findLike = async (userIdx, commentIdx) => {
    const checklike = 
      await this.commentLikeRepository.findLike(userIdx, commentIdx);
    
    return checklike
  };

  likeUpdate = async (userIdx, commentIdx) => {
    const checkUpdate = 
      await this.commentLikeRepository.likeUpdate(userIdx, commentIdx);
    
    return checkUpdate
  };

  likeUndo = async (userIdx, commentIdx) => {
    const checkUndo = 
      await this.commentLikeRepository.likeUndo(userIdx, commentIdx);
    
    return checkUndo
  };
  
  getAllLike = async (commentIdx) => {
    const getLike = 
      await this.commentLikeRepository.getAllLike(commentIdx);
    
    return getLike
  };
}
  module.exports = CommentLikeService;