const Mock = require('mockjs')
const { DataTypes, Model } = require('sequelize')

function formatCategory(data) {

  let child = []
  data['secondCategory'].map((item, idx) => {
    child.push({
      ...item,
      child: data['thirdCategory'][item["categoryName"]]
    })
  })
  return {
    id: data.id,
    categoryName: data['firstCategory'],
    tagData: {
      text: "一级",
      type: ""
    },
    child
  }
}
module.exports = {
  formatCategory
}
