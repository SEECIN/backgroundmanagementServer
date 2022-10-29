const express = require('express');
const router = express.Router();
const assert = require("http-assert")
const ProductsCategory = require("../models/ProductsCategory")
const { formatCategory } = require("../util/format")
const Mock = require('mockjs')
/* GET user listing. */
router.get('/', async (req, res, next) => {
  try {
    let productsCategorys = await ProductsCategory.findAll({
      attributes: ['id', 'firstCategory', 'secondCategory', 'thirdCategory'],
      order: ['createdAt']
    })
    let result = productsCategorys.map(item => {
      return formatCategory(item.toJSON())
    })
    res.send(200, {
      message: "分类信息获取成功",
      data: {
        result
      }
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/* DELETE user listing. */
router.delete('/', async (req, res, next) => {
  const data = req.body
  let result
  let rootName = data.tagData.text === "一级" ? data.categoryName : data.rootName
  try {
    let productsCategory = await ProductsCategory.findOne({ where: { firstCategory: rootName } })
    if (!productsCategory) assert(false, 422, "此分类参数不存在")
    let jsonData = productsCategory.toJSON()
    if (data.tagData.text === "一级") {
      await productsCategory.destroy()
      result = {
        id: jsonData.id,
        empty: true
      }
    }
    if (data.tagData.text === "二级") {
      jsonData.secondCategory.map((item, idx) => {
        if (data.categoryName === item.categoryName) {
          jsonData.secondCategory.splice(idx, 1)
          delete jsonData.thirdCategory[data.categoryName]
        }
      })
      if (jsonData.secondCategory.length === 0) {
        await productsCategory.destroy()
        result = {
          id: jsonData.id,
          empty: true
        }
      } else {
        productsCategory.set({ ...jsonData })
        result = await productsCategory.save()
        result = formatCategory(result.toJSON())
      }
    }
    if (data.tagData.text === "三级") {
      jsonData.thirdCategory[data.parentName].map((item, idx) => {
        if (data.id === item.id) {
          jsonData.thirdCategory[data.parentName].splice(idx, 1)
        }
      })
      if (jsonData.thirdCategory[data.parentName].length === 0) {
        jsonData.secondCategory.map((item, idx) => {
          if (data.parentName === item.categoryName) {
            jsonData.secondCategory.splice(idx, 1)
            delete jsonData.thirdCategory[data.parentName]
          }
        })
      }
      if (jsonData.secondCategory.length === 0) {
        await productsCategory.destroy()
        result = {
          id: jsonData.id,
          empty: true
        }
      } else {
        productsCategory.set({ ...jsonData })
        result = await productsCategory.save()
        result = formatCategory(result.toJSON())
      }
    }

    res.send(200, {
      message: "已删除此商品分类参数信息",
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

/* PUT user listing. */
router.put('/', async (req, res, next) => {
  const formData = req.body
  let result, jsonData, productsCategory
  let rootName = formData.tagData.text === "一级" ? formData.categoryName : formData.rootName
  try {
    if (formData.tagData.text === "一级") {
      productsCategory = await ProductsCategory.findOne({ where: { id: formData.id } })
      jsonData = productsCategory?.toJSON()
      if (!productsCategory) assert(false, 422, "分类参数信息不存在")
      let allCategorys = await ProductsCategory.findAll({ where: { firstCategory: rootName } })
      if (allCategorys.length > 0 || jsonData.firstCategory === formData.categoryName) assert(false, 422, "分类参数名称已存在")
      jsonData.firstCategory = formData.categoryName
      jsonData.secondCategory.map(item => item.rootName = formData.categoryName)
      for (let key in jsonData.thirdCategory) {
        jsonData.thirdCategory[key].map(item => item.rootName = formData.categoryName)
      }
      productsCategory.set({ ...jsonData })
      result = await productsCategory.save()
    } else {
      productsCategory = await ProductsCategory.findOne({ where: { firstCategory: rootName } })
      jsonData = productsCategory?.toJSON()
      if (!jsonData) assert(false, 422, "分类参数信息不存在")
      let ergodicData = formData.tagData.text === "二级" ? jsonData.secondCategory : jsonData.thirdCategory[formData.parentName]
      console.log(jsonData)
      let hasSameName = ergodicData.filter(item => item.categoryName === formData.categoryName)
      if (hasSameName.length > 0) assert(false, 422, "分类参数名称已存在")
      ergodicData.map(item => {
        if (formData.id === item.id) {
          item.categoryName = formData.categoryName
        }
      })
      productsCategory.set({ ...jsonData })
      result = await productsCategory.save()
    }

    result = formatCategory(result.toJSON())
    res.send(200, {
      message: "分类参数名称修改成功",
      data: {
        result
      }
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/* POST user listing. */
router.post('/', async (req, res, next) => {
  const { firstCategory, secondCategory, thirdCategory } = req.body
  try {
    let result
    let firstCategoryData = await ProductsCategory.findOne({ where: { firstCategory }, attributes: ['id', 'firstCategory', 'secondCategory', 'thirdCategory'] })
    jsonData = firstCategoryData?.toJSON()
    if (!firstCategoryData) {
      result = await ProductsCategory.create({
        firstCategory,
        secondCategory: [{
          id: Mock.mock('@natural()') + Mock.mock('@string(6, 10)'),
          tagData: {
            text: "二级",
            type: "success"
          },
          rootName: firstCategory,
          categoryName: secondCategory
        }],
        thirdCategory: {
          [secondCategory]: [{
            id: Mock.mock('@string(6, 10)') + Mock.mock('@natural()'),
            tagData: {
              text: "三级",
              type: "warning"
            },
            rootName: firstCategory,
            parentName: secondCategory,
            categoryName: thirdCategory
          }]
        }
      })
    } else {
      let hasSecondCategory = jsonData['secondCategory'].filter(item => {
        return item.categoryName === secondCategory
      })
      if (hasSecondCategory.length === 0) {
        jsonData.secondCategory.push({
          id: Mock.mock('@natural()') + Mock.mock('@string(6, 10)'),
          tagData: {
            text: "二级",
            type: "success"
          },
          rootName: firstCategory,
          categoryName: secondCategory
        })
        jsonData.thirdCategory[secondCategory] = [{
          id: Mock.mock('@string(6, 10)') + Mock.mock('@natural()'),
          tagData: {
            text: "三级",
            type: "warning"
          },
          rootName: firstCategory,
          parentName: secondCategory,
          categoryName: thirdCategory
        }]
      } else {
        let hasThirdCategory = jsonData['thirdCategory'][secondCategory].filter(item => {
          return item.categoryName === thirdCategory
        })
        if (hasThirdCategory.length !== 0) assert(false, 422, "此分类参数已存在")
        jsonData.thirdCategory[secondCategory].push({
          id: Mock.mock('@string(6, 10)') + Mock.mock('@natural()'),
          tagData: {
            text: "三级",
            type: "warning"
          },
          rootName: firstCategory,
          parentName: secondCategory,
          categoryName: thirdCategory
        })
      }
      firstCategoryData.set({ ...jsonData })
      result = await firstCategoryData.save()
    }
    result = formatCategory(result.toJSON())
    res.send(200, {
      message: "分类参数添加成功",
      data: {
        result
      }
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
})


module.exports = router;
