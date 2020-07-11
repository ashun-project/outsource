var mysql = require('mysql');
var conf = require('../conf/db');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');

module.exports = {
    login: function(req, res, next) {
        var query = req.body;
        var querySql = 'SELECT * FROM t_user where account=?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, [query.account], function (err, result) {
                var obj = result ? (result[0] || {}) : {};
                if (!obj.account) {
                    res.json({ code: 1, message: '帐号不存在' });
                } else if (query.password !== obj.password) {
                    res.json({ code: 1, message: '密码错误' });
                } else {
                    req.session.loginUser = {userName: query.account, code: 0};
                    res.json({ code: 0, message: '登录成功' });
                }
                connection.release();
            })
        })
    },
    loginOut: function(req, res, next) {
        req.session.loginUser = null;
        res.clearCookie('testapp');
        res.json({message:'退出成功', code: 0});
    },
    loginInfo: function(req, res, next) {
        var query = req.body;
        var querySql = 'SELECT * FROM t_user where account=?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, [query.account], function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
}