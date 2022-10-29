const { DataTypes, Model } = require('sequelize');
const sequelize = require("../plugins/db")
const { encrypt } = require("../util/util")
class User extends Model { }

User.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    set(val) {
      this.setDataValue('password', encrypt(val))
    }
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  // 这是其他模型参数
  sequelize, // 我们需要传递连接实例
  freezeTableName: true
});

module.exports = User
