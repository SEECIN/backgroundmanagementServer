const express = require('express');
const router = express.Router();
const assert = require("http-assert")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Product = require("../models/Product")

const { uploadPath, uploadURL, maxFileSize } = require('../config');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let filePath = path.join(uploadPath, req.baseUrl.slice(1) + "Images")
    fs.existsSync(filePath) || fs.mkdirSync(filePath)
    cb(null, filePath)
  },
  filename: function(req, file, cb) {
    const { ext, base, name } = path.parse(file.originalname)
    cb(null, name + '-' + Date.now() + ext)
  }
})

const upload = multer({ storage, limits: { fileSize: maxFileSize } })

/* GET product listing. */
router.get('/', async (req, res, next) => {
  try {
    let result = await Product.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: ['createdAt'] })
    res.send(200, {
      message: "商品列表获取成功",
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

/* PUT product listing. */
router.put('/', async (req, res, next) => {
  const { id, deleteImageUrl, productClassify, productDescription, productName, productPrice, productWeight } = req.body
  let message
  try {
    let product = await Product.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'updatedAt'] }, order: ['createdAt'] })
    if (!product) assert(false, 422, "商品信息不存在")
    let jsonData = product?.toJSON()
    if (deleteImageUrl) {
      jsonData.productImages.map((item, idx) => {
        if (item === deleteImageUrl) jsonData.productImages.splice(idx, 1)
      })
      let filePath = deleteImageUrl.replace(uploadURL, '').replace("/", "")
      fs.unlink(path.join(uploadPath, filePath), () => {
        message = "图片删除成功"
      })
      product.set(jsonData)
    } else {
      product.set({ productClassify, productDescription, productName, productPrice, productWeight })
      message = "商品信息修改成功"
    }
    let result = await product.save()
    res.send(200, {
      message,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

/* DELETE product listing. */
router.delete('/', async (req, res, next) => {
  const { id } = req.body
  try {
    let product = await Product.findOne({ where: { id } })
    if (!product) {
      assert(false, 422, "您想删除的商品不存在")
    }
    await product.destroy()
    res.send(200, {
      message: "已删除该商品信息",
    })
  } catch (error) {
    next(error)
  }
})

/* post product listing. */
router.post('/', upload.any(), async (req, res, next) => {
  let { id, productPrice, productWeight, productName, productDescription, productClassify } = req.body
  let productImages, result
  try {
    if (req.files.length > 0) {
      productImages = req.files.map(item => path.join(uploadURL, path.parse(item.destination).name, item.filename).replace(/\\/g, '/').replace('http:/', 'http://'))
    }
    if (!id) {
      if (!productPrice.includes(".")) productPrice = productPrice + ".00"
      if (!productWeight.includes(".")) productWeight = productWeight + ".00"
      result = await Product.create({ productPrice, productWeight, productName, productDescription, productClassify, productImages })
      message = "商品添加成功"
    } else {
      let product = await Product.findOne({ where: { id }, attributes: { exclude: ['createdAt', 'updatedAt'] }, order: ['createdAt'] })
      let jsonData = product.toJSON()
      jsonData.productImages ? jsonData.productImages.push(...productImages) : jsonData.productImages = productImages
      product.set(jsonData)
      result = await product.save()
      message = "商品图片添加成功"
    }

    res.send(200, {
      message,
      data: {
        result
      }
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router
