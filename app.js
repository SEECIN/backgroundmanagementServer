const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressJwt = require('express-jwt')
const cors = require('cors')

require("./plugins/syncModel")
const pubKeyRouter = require('./routes/getPubKey');
const loginRouter = require('./routes/login');
const UserRouter = require('./routes/user');
const RoleRouter = require('./routes/role');
const ProductsCategoryRouter = require('./routes/productsCategory');
const ProductsRouter = require('./routes/product');

const app = express();

const { getPublicKeySync } = require('./util/rsaControl')

app.use(cors({
  "origin": '*', //true 设置为 req.origin.url
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //容许跨域的请求方式
  "allowedHeaders": "x-requested-with,Authorization,token, content-type", //跨域请求头
  "preflightContinue": false, // 是否通过next() 传递options请求 给后续中间件 
  "maxAge": 1728000, //options预验结果缓存时间 20天
  "credentials": true, //携带cookie跨域
  "optionsSuccessStatus": 200 //options 请求返回状态码
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(expressJwt({
  secret: getPublicKeySync(),//解密秘钥 
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
}).unless({ path: ["/getPubKey", "/login"] })
)

app.use('/getPubKey', pubKeyRouter);
app.use('/login', loginRouter);
app.use('/user', UserRouter);
app.use('/role', RoleRouter);
app.use('/productsCategory', ProductsCategoryRouter);
app.use('/product', ProductsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
const ERROR_LOGIN_CODE = 422
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({
    code: err.status,
    message: err.message
  })
});

module.exports = app;
