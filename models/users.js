"use strict";
const { Model } = require("sequelize");

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.PostLike, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });

      this.hasMany(models.CommentLike, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });

      this.hasMany(models.CardPost, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });

      this.hasMany(models.Comment, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });
      this.hasMany(models.ReplyComment, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });

      this.hasMany(models.Prefer, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });
    }
  }
  Users.init(
    {
      userIdx: {
        allowNull: false, // NOT NULL
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        allowNull: false, // NOT NULL
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false, // NOT NULL
        unique: true,
        type: DataTypes.STRING,
      },
      level: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "훈수 초보",
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING(8),
        defaultValue: "US000001",
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
      modelName: "Users",
    }
  );
  return Users;
};
