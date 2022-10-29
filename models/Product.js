const { DataTypes, Model } = require('sequelize');
const sequelize = require("../plugins/db")
class Product extends Model { }

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // 在这里定义模型属性
  productName: {
    type: DataTypes.STRING
  },
  productClassify: {
    type: DataTypes.STRING
  },
  productPrice: {
    type: DataTypes.STRING
  },
  productWeight: {
    type: DataTypes.STRING
  },
  productDescription: {
    type: DataTypes.STRING
  },
  productImages: {
    type: DataTypes.JSON
  }
}, {
  // 这是其他模型参数
  sequelize, // 我们需要传递连接实例
  freezeTableName: true
});

module.exports = Product
