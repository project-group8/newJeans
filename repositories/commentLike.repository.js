const { CommentLike, Users, sequelize, Comment } = require('../models');
const { parseModelToFlatObject } = require('../helpers/sequelize.helper');
const { Op } = require('sequelize');

class LikesRepository extends CommentLike {
  constructor() {
    super();
  }
  findLike = async (userIdx, commentIdx) => {
    const checklike = 
      await CommentLike.findOne({
        where: {
            userIdx,
            commentIdx,
        },
      });

    return checklike
  };

  likeUpdate = async (userIdx, commentIdx) => {
    const checklike = 
      await CommentLike.create({
        userIdx,
        commentIdx,
      });

    return checklike
  };

  likeUndo = async (userIdx, commentIdx) => {
    const checklike = 
      await CommentLike.destroy({
        where: {
            userIdx,
            commentIdx,
        },
      });

    return checklike
  };

  getAllLike = async (commentIdx) => {
    const checklike = 
      await CommentLike.findOne({
        where: {
            commentIdx,
        },
        attributes:[
            [sequelize.fn('COUNT', sequelize.col('CommentLike.commentLikeIdx')),'totalLikes']
        ]
      });

    return checklike
  };

}
module.exports = LikesRepository;