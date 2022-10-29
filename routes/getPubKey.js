const express = require('express');
const router = express.Router();
const Key = require("../models/Key")

/* GET pubKey listing. */
router.get('/', async (req, res, next) => {
  try {
    let key = await Key.findAll()
    console.log(key);
    res.send(200, {
      message: "pubKey获取成功",
      data: {
        pubKey: key[0]?.dataValues.pubKey
      }
    })
  } catch (error) {
    next(error)
  }

});

module.exports = router;
