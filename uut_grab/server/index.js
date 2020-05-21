var express = require('express')
var app = express();
var cookie = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


// app.all("*",function(req,res,next){
//   //设置允许跨域的域名，*代表允许任意域名跨域
//   res.header("Access-Control-Allow-Origin","*");
//   //允许的header类型
//   res.header("Access-Control-Allow-Headers","content-type");
//   //跨域允许的请求方式 
//   res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method.toLowerCase() == 'options')
//       res.sendStatus(200);  //让options尝试请求快速结束
//   else
//       next();
// })


app.use(cookie());
app.use(session({
    resave: true, // 是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒
    saveUninitialized: false, // 是指无论有没有session cookie，每次请求都设置个session cookie 
    secret: '123456', //  加密
    name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 1800000000
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.all("*",function(req,res,next){
    if (req.session.loginUser) {
        // if (req.url.indexOf('admin') > -1 && req.session.loginUser.userName !== 'uutadmin') {
        //     res.json({code: 3301, message: '帐号错误，请重新登录'})
        // } else {
        //     next()
        // }
        next()
    } else {
        // var url = [
        //     '/admin/login',
        //     '/grab/register',
        //     '/grab/info',
        //     '/grab/login',
        //     '/grab/verifyCode',
        //     '/grab/retrieve',
        //     '/grab/signout',
        //     '/admin/signout'
        // ];
        // if (url.indexOf(req.url) > -1) {
        //     next()
        // } else {
        //     res.json({code: 3301, message: '登录已过期，请重新登录'})
        // }
        next()
    }
})

var user = require('./router/user');
var banks = require('./router/banks');
var order = require('./router/order');
var qita = require('./router/qita');
var adminFinance = require('./router/admin/finance');
var adminUser = require('./router/admin/user');
var adminOrder = require('./router/admin/order');
var adminStore = require('./router/admin/store');
var adminSystem = require('./router/admin/system');
app.use(express.static(path.join(__dirname, 'public')));
app.use(user);
app.use(banks);
app.use(order);
app.use(qita);
app.use(adminFinance);//财务管理
app.use(adminUser);   //会员管理
app.use(adminOrder);   //抢单管理
app.use(adminStore);   //商品管理
app.use(adminSystem);   //系统管理

app.listen(8889);