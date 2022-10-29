const { getPrivateKey } = require('./rsaControl')
const jwt = require('jsonwebtoken') //token生成包  JWT

module.exports = {
  async sendToken (userInfo) {
    let { username, userId } = userInfo
    let privateKey = await getPrivateKey()
    let token = jwt.sign({ username, userId, exp: ~~((Date.now() / 1000) + 24 * 3600 * 3) }, privateKey, { algorithm: 'RS256' });
    return token
  }
}