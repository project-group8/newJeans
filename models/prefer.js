"use strict";
const { Model } = require("sequelize");

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prefer extends Model {
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
    }
  }
  Prefer.init(
    {
      preferIdx: {
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
        allowNull: false,
        type: DataTypes.UUID,
      },
      selectprefer: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "0",
        // 0 디폴트
        // 1. 포스트에 대한 좋아요 2. 포스트에 대한 싫어요. // 분리 예정
        // 7. 포스트 찬성 8. 포스트 반대.
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
    },
    {
      sequelize,
      modelName: "Prefer",
    }
  );
  return Prefer;
};
