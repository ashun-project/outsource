var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: true, // 是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒
  saveUninitialized: false, // 是指无论有没有session cookie，每次请求都设置个session cookie 
  secret: '123456', //  加密
  name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
      maxAge: 18000000
  }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
}));

app.all("*",function(req,res,next){
  // console.log(req.session.loginUser, req.url)
  // if (req.session.loginUser) {
  //   next()
  // } else {
  //   var url = [
  //     '/admin/login'
  //   ];
  //   if (url.indexOf(req.url) > -1) {
  //     next()
  //   } else {
  //     res.json({code: 3301, message: '登录已过期，请重新登录'})
  //   }
  // }
  next()
})

// 输出日志到目录
var fs = require('fs');
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/request.log'), { flags: 'a', encoding: 'utf8' }); // 记得要先把目录建好，不然会报错
app.use(logger('combined', { stream: accessLogStream }));

// 引入路由
var usersRouter = require('./routes/users');
var zodiacRouter = require('./routes/zodiac');
var noteRouter = require('./routes/note');
var otherRouter = require('./routes/other');
var adminRouter = require('./routes/admin');
app.use(usersRouter);
app.use(zodiacRouter);
app.use(noteRouter);
app.use(otherRouter);
app.use(adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log('程序出错了' + req.url, err.message);
  res.status(err.status || 500);
  res.json({code: 1, message: ''});
});

module.exports = app;
