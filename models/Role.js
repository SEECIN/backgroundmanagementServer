const { DataTypes, Model } = require('sequelize');
const sequelize = require("../plugins/db")
class Role extends Model { }

Role.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  roleName: {
    type: DataTypes.STRING
  },
  roleDescription: {
    type: DataTypes.STRING
  },
  roleAuth: {
    type: DataTypes.JSON
  }
}, {
  // 这是其他模型参数
  sequelize, // 我们需要传递连接实例
  freezeTableName: true
});

module.exports = Role
