"use strict";
const { Model } = require("sequelize");

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CardPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Prefer, {
        sourceKey: "postIdx",
        foreignKey: "postIdx",
      });

      this.hasMany(models.PostLike, {
        sourceKey: "postIdx",
        foreignKey: "postIdx",
      });

      this.hasMany(models.Comment, {
        sourceKey: "postIdx",
        foreignKey: "postIdx",
      });

      this.hasMany(models.ReplyComment, {
        sourceKey: "postIdx",
        foreignKey: "postIdx",
      });

      this.belongsTo(models.Users, {
        targetKey: "userIdx", // Users 모델의 userId 컬럼을
        foreignKey: "userIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  CardPost.init(
    {
      postIdx: {
        allowNull: false, // NOT NULL
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userIdx: {
        allowNull: false, // NOT NULL
        type: DataTypes.UUID,
      },
      title: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      desc: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      maincategory: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        //진지
        //유머
      },
      category: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        // 패션/뷰티
        // 맛집/요리/음식
        // 경제/재테크
        // 썸/연애
        // 취미/운동
        // 스포츠
        // 여행
        // 결혼
        // 게임
        // 반려동물
        // 가족
        // 취업/자격증
        // 일상
        // 기타
      },
      tag: {
        allowNull: true, // NOT NULL
        type: DataTypes.STRING,
      },
      imgUrl: {
        allowNull: true, // NOT NULL
        type: DataTypes.STRING,
      },
      viewCount: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      pollTitle: {
        allowNull: true,
        type: DataTypes.STRING,
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
      modelName: "CardPost",
    }
  );
  return CardPost;
};
