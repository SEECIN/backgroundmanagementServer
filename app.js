const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressJwt = require('express-jwt')

require("./plugins/syncModel")
const pubKeyRouter = require('./routes/getPubKey');
const loginRouter = require('./routes/login');
const UserRouter = require('./routes/user');
const RoleRouter = require('./routes/role');
const ProductsCategoryRouter = require('./routes/productsCategory');
const ProductsRouter = require('./routes/product');

const app = express();

const { getPublicKeySync } = require('./util/rsaControl')
// const { generateKeys } = require("./util/util")
// generateKeys()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

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
