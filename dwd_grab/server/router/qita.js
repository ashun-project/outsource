var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../conf/db');
// var common = require('../conf/common');
var poolUser = mysql.createPool(db.mysql);
var mutipart= require('connect-multiparty');
var mutipartMiddeware = mutipart({
    uploadDir: './public/tmp'
});


// 获取公告
router.post('/grab/noticeList', function (req, res, next) {
    var obj = req.body;
    var sql = "SELECT * FROM notice where type = "+ obj.type +" order by create_date desc";
    if (obj.type == 'all') {
        sql = "SELECT * FROM notice where type < 2 or user_id = "+ obj.userId +" order by create_date desc";
    } else if (obj.type === 3) {
        sql = "SELECT * FROM notice where type = 3 and user_id = "+ obj.userId +" order by create_date desc";
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL noticeList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result});
            conn.release();
        })
    })
});

// 获取列表
router.post('/grab/bannerList', function (req, res, next) {
    var sql = "SELECT * FROM banner order by create_date desc";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL bannerList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result});
            conn.release();
        })
    })
});

// 文件上传
router.post('/upload',mutipartMiddeware,function (req,res) {  
    var fileName = '';
    var code = 1;
    if (req.files && req.files.file && req.files.file.path) {
        code = 0;
        fileName = req.files.file.path.replace(/\\/g, '\/').replace('public/tmp/', '');
    };
    res.json({code: code, fileName: fileName});
});

// 登录
router.post('/admin/login',function (req,res) {  
    var params = req.body;
    var sql = "SELECT * FROM admin_user WHERE account = 'dwdadmin'";
    if (params.userName !== 'dwdadmin') {
        res.json({code: 1, message: '帐号不存在'})
        return
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr,result) {
            var obj = result ? result[0] : {};
            if (obj.password !== params.password) {
                res.json({message: '密码错误', code: 1});
            } else {
                req.session.loginUser = {userName: params.userName, code: 0};
                res.json({code: 0, message: '登入成功'})
            }
            conn.release();
        })
    })
});

// 退出登录
router.post('/admin/signout', function (req, res, next) {
    req.session.loginUser = null;
    res.clearCookie('testapp');
    res.json({message:'退出成功', code: 0});
});




module.exports = router;