const express = require('express');
const router = express.Router();
const { decrypt } = require("../util/util")
const assert = require("http-assert")
const { sendToken } = require("../util/sendToken")
const User = require("../models/User")
const Role = require("../models/Role")
const { Sequelize } = require('sequelize')

/* POST login page. */
router.post('/', async (req, res, next) => {
  let { username, password } = req.body
  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0) {
      assert(false, 422, "账号与密码必填")
    }
    let user = await User.findOne({
      where: {
        username
      },
      attributes: [Sequelize.col('Role.roleName'), Sequelize.col('Role.roleAuth'), 'id', 'username', 'password', 'role', 'status'],
      include: {
        model: Role,
        attributes: []
      },
      raw: true
    })
    if (!user?.username) {
      assert(false, 422, `账号${username}不存在`)
    }
    assert.equal(decrypt(password), decrypt(decrypt(user.password)), 422, '账号或密码错误')
    let token = await sendToken({ username: user.username, userId: user.id })
    delete user.password
    res.send(200, {
      message: "登录成功",
      data: {
        result: { ...user, token }
      }
    })
  } catch (error) {
    console.log(error)
    next(error)
  }

});

module.exports = router;
