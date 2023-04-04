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

      this.hasMany(models.Poll, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });

      this.hasMany(models.UserInfo, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });
      this.hasMany(models.CardPost, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });
      this.hasMany(models.Likes, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });
      this.hasMany(models.DisLikes, {
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
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false, // NOT NULL
        unique: true,
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
      modelName: "Users",
    }
  );
  return Users;
};
