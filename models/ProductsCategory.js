const { DataTypes, Model } = require('sequelize');
const sequelize = require("../plugins/db")
const { encrypt } = require("../util/util")
class ProductsCategory extends Model { }

ProductsCategory.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // 在这里定义模型属性
  firstCategory: {
    type: DataTypes.STRING
  },
  secondCategory: {
    type: DataTypes.JSON
  },
  thirdCategory: {
    type: DataTypes.JSON
  }
}, {
  // 这是其他模型参数
  sequelize, // 我们需要传递连接实例
  freezeTableName: true
});

module.exports = ProductsCategory
