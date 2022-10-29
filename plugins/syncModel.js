const User = require("../models/User")
const Role = require("../models/Role")
const Key = require("../models/Key")
const ProductsCategory = require("../models/ProductsCategory")
const Product = require("../models/Product")


const { pubKeyPath } = require('../config')
const fs = require('fs')
const { encrypt } = require("../util/util")
const { generateKeys } = require("../util/util")


const sequelize = require("./db");

sequelize.sync({ alter: true }).then(async () => {
  console.log("所有模型已同步");
  let public_key
  try {
    public_key = fs.readFileSync(pubKeyPath, 'utf8')
  } catch (error) {
    await generateKeys()
    public_key = fs.readFileSync(pubKeyPath, 'utf8')
    let sqlKey = await Key.findOne()
    sqlKey.set({ pubKey: public_key })
    await sqlKey.save()
  }
  let key = await Key.findOne()
  if (key.length === 0) {
    await Key.create({ pubKey: public_key })
  }
  let role = await Role.findOne()
  if (role.length === 0) {
    role = await Role.create({ roleName: "超级管理员", roleDescription: "拥有所有权限", roleAuth: [101, 10101, 102, 10201, 10202, 103, 10301, 10302, 104] })
    console.log("角色创建成功")
  }
  let user = await User.findAll()
  if (user.length === 0) {
    await User.create({ username: "admin", password: encrypt("123456"), role: role.toJSON().id })
    console.log("用户创建成功")
  }
  User.hasOne(Role, {
    foreignKey: 'id',
    sourceKey: 'role'
  })
}).catch(err => {
  console.log(err)
})
