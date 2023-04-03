'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: "userIdx", // Users 모델의 userId 컬럼을
        foreignKey: "userIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });

      this.belongsTo(models.CardPost, {
        targetKey: "postIdx", // Users 모델의 userId 컬럼을
        foreignKey: "postIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Comment, {
        targetKey: "commentIdx", // Users 모델의 userId 컬럼을
        foreignKey: "commentIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });

      this.belongsTo(models.ReplyComment, {
        targetKey: "replyIdx", // Users 모델의 userId 컬럼을
        foreignKey: "replyIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  
  Likes.init({
    likeIdx: {
      allowNull: false, // NOT NULL
      primaryKey: true, // Primary Key (기본키)
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    userIdx: {
      allowNull: false, // NOT NULL
      type: DataTypes.UUID,
    },
    postIdx: {
      allowNull: false, // NOT NULL
      type: DataTypes.UUID,
    },
    commentIdx: {
      allowNull: false, // NOT NULL
      type: DataTypes.UUID,
    },
    replyIdx: {
      allowNull: false, // NOT NULL
      type: DataTypes.UUID,
    },
    createdAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};