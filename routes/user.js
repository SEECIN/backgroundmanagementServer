const express = require('express');
const router = express.Router();
const assert = require("http-assert")
const User = require("../models/User")
const Role = require("../models/Role")
const { Sequelize } = require('sequelize')

/* GET user listing. */
router.get('/', async (req, res, next) => {
  try {
    let user = await User.findAll({
      attributes: [Sequelize.col('Role.roleName'), 'id', 'username', 'role', 'status'],
      include: {
        model: Role,
        attributes: []
      },
      raw: true,
      order: ['createdAt']
    })
    res.send(200, {
      message: "用户列表获取成功",
      data: {
        userList: user
      }
    })
  } catch (error) {
    next(error)
  }
})

/* DELETE user listing. */
router.delete('/', async (req, res, next) => {
  const { id } = req.body
  try {
    let user = await User.findOne({ where: { id } })
    if (!user) {
      assert(false, 422, "您想删除的用户不存在")
    }
    await user.destroy()
    res.send(200, {
      message: "已删除该用户账号与信息",
    })
  } catch (error) {
    next(error)
  }
})

/* PUT user listing. */
router.put('/', async (req, res, next) => {
  const { username, status, role, id } = req.body
  try {
    let user = await User.findOne({ where: { id }, attributes: ['id', 'username', 'role', 'status'] })
    let message = status === user.status ? "用户信息修改成功" : "用户状态修改成功"
    user.set({
      username, status, role
    })
    await user.save()
    let roleData = await user.getRole()
    res.send(200, {
      message,
      data: {
        result: { ...user.dataValues, 'roleName': roleData.roleName }
      }
    })
  } catch (error) {
    next(error)
  }
})

/* POST user listing. */
router.post('/', async (req, res, next) => {
  const { username, password, role } = req.body
  console.log(username, password, role)
  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0 || !role || role?.trim()?.length === 0) {
      assert(false, 422, "请填写必填信息")
    }
    let user = await User.findOne({ where: { username } })
    if (user) {
      assert(false, 422, "该用户名已存在")
    }
    let result = await User.create({ username, password, role })
    let roleData = await result.getRole()
    res.send(200, {
      message: "用户添加成功",
      data: {
        result: { 'id': result.id, 'username': result.username, 'role': result.role, 'roleName': roleData.roleName, 'status': result.status }
      }
    })
  } catch (error) {
    next(error)
  }
})



module.exports = router;
