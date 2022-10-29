const path = require('path')
module.exports = {
  host: '127.0.0.1',
  port: 3300,
  root: "root",
  password: "947264",
  dbPort: 3306,
  dbName: "my_manage_server",
  keyPath: path.join(process.cwd(), '/auth'),
  pubKeyPath: path.join(process.cwd(), '/auth/public.cer'),
  priKeyPath: path.join(process.cwd(), '/auth/private.cer'),
  userPath: path.join(process.cwd(), '/user/user.json'),
  uploadPath: path.join(process.cwd(), '/uploads'),
  uploadURL: 'http://127.0.0.1:3300',
  maxFileSize: Infinity
}
