const { Sequelize } = require('sequelize')
const { host, dbPort, dbName, root, password } = require("../config")
const sequelize = new Sequelize(dbName, root, password, {
  host: host,
  port: dbPort,
  dialect: 'mysql'
})

//数据库连接
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(error => {
  console.error('Unable to connect to the database:', error);
})

module.exports = sequelize