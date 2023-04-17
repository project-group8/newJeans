"use strict";
const { Model } = require("sequelize");

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CardPost, {
        targetKey: "postIdx", // Users 모델의 userId 컬럼을
        foreignKey: "postIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Users, {
        targetKey: "userIdx", // Users 모델의 userId 컬럼을
        foreignKey: "userIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  PostLike.init(
    {
      postLikeIdx: {
        allowNull: false, // NOT NULL
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userIdx: {
        allowNull: false, // NOT NULL
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      postIdx: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "PostLike",
    }
  );
  return PostLike;
};
