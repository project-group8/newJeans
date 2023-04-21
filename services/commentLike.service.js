const CommentLikeRepository = require('../repositories/commentLike.repository');


class CommentLikeService {
  constructor() {
    this.commentLikeRepository = new CommentLikeRepository();
  }
  findLike = async (userIdx, postIdx, commentIdx) => {
    const checklike = 
      await this.commentLikeRepository.findLike(userIdx, postIdx, commentIdx);
    
    return checklike
  };

  likeUpdate = async (userIdx, postIdx, commentIdx) => {
    const checkUpdate = 
      await this.commentLikeRepository.likeUpdate(userIdx, postIdx, commentIdx);
    
    return checkUpdate
  };

  likeUndo = async (userIdx, postIdx, commentIdx) => {
    const checkUndo = 
      await this.commentLikeRepository.likeUndo(userIdx, postIdx, commentIdx);
    
    return checkUndo
  };
  
  getAllLike = async (commentIdx) => {
    const getLike = 
      await this.commentLikeRepository.getAllLike(commentIdx);
    
    return getLike
  };
}
  module.exports = CommentLikeService;