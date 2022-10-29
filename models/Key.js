const { DataTypes, Model } = require('sequelize');
const sequelize = require("../plugins/db")



class Key extends Model { }
Key.init({
  // 在这里定义模型属性
  pubKey: {
    type: DataTypes.STRING
  }
}, {
  // 这是其他模型参数
  sequelize, // 我们需要传递连接实例
  freezeTableName: true
});

module.exports = Key
