'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
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
    }
  }
  UserInfo.init({
    userInfoIdx: {
      allowNull: false, // NOT NULL
      primaryKey: true, // Primary Key (기본키)
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    status: {
      allowNull: false, 
      type: DataTypes.STRING(8),
      defaultValue:
      'US000001'
    },
    refreshToken: {
      allowNull: true, 
      type: DataTypes.STRING,
    },
    userImg: {
      allowNull: true, 
      type: DataTypes.STRING,
    },
    level: {
      allowNull: false, 
      type: DataTypes.STRING,
      defaultValue:'Lv1'
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
    modelName: 'UserInfo',
  });
  return UserInfo;
};