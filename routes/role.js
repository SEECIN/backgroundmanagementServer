const express = require('express');
const router = express.Router();
const assert = require("http-assert")
const Role = require("../models/Role")

/* GET role listing. */
router.get('/', async (req, res, next) => {
  try {
    let roleList = await Role.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: ['createdAt'] })
    res.send(200, {
      message: "角色列表获取成功",
      data: {
        roleList
      }
    })
  } catch (error) {
    next(error)
  }
})

/* PUT role listing. */
router.put('/', async (req, res, next) => {
  const { roleName, roleDescription, roleAuth, id } = req.body
  try {
    let role = await Role.findOne({ where: { id }, attributes: ['id', 'roleName', 'roleAuth', 'roleDescription'] })
    if (!role) assert(false, 422, "您想修改的角色不存在")
    role.set({
      roleName, roleDescription, roleAuth
    })
    await role.save()
    res.send(200, {
      message: "角色信息修改成功",
      data: {
        result: role
      }
    })
  } catch (error) {
    next(error)
  }
})

/* DELETE role listing. */
router.delete('/', async (req, res, next) => {
  const { id } = req.body
  try {
    let role = await Role.findOne({ where: { id } })
    if (!role) {
      assert(false, 422, "您想删除的角色不存在")
    }
    await role.destroy()
    res.send(200, {
      message: "已删除该角色信息",
    })
  } catch (error) {
    next(error)
  }
})

/* post role listing. */
router.post('/', async (req, res, next) => {
  const { roleName, roleDescription, roleAuth } = req.body
  try {
    let role = await Role.create({ roleName, roleDescription, roleAuth })
    res.send(200, {
      message: "角色添加成功",
      data: {
        result: role
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
