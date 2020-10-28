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
                    req.session.loginUser = {userName: query.account, password: obj.password, code: 0};
                    res.json({ code: 0, message: '登录成功', data: {userName: query.account, nickName: obj.nick_name, id: obj.id, tx: obj.tx} });
                }
                connection.release();
            })
        })
    },
    register: function(req, res, next) {
        var query = req.body;
        var addSql = 'insert into t_user(account, password, create_date, nick_name) VALUES (?, ?, ?, ?)';
        var querySql = "SELECT * FROM t_user where account = '" + query.account + "'";
        if (!query.nickName || !query.password || query.account.length < 6 || query.account.length > 12 || query.nickName.length > 6) {
            res.json({code: 1, message: '填写数据有误'});
            return
        }
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function(err, rows) {
                if (rows && rows.length) {
                    res.json({ code: 1, message: '帐号已存在' });
                    connection.release();
                } else {
                    connection.query(addSql, [query.account, query.password, new Date(), query.nickName], function (err, result) {
                        common.jsonWrite(res, err, result);
                        connection.release();
                    })
                }
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
    updatePassword: function(req, res, next) {
        var query = req.body;
        var updateSql = 'update t_user set password=? where id=?';
        if (!req.session.loginUser) {
            res.json({code: 3301, message: '登录失效'});
            return
        }
        if (req.session.loginUser.password !== query.oldPassword) {
            res.json({code: 1, message: '旧密码错误'});
            return
        }
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [query.newPassword, query.id], function (err, result) {
                req.session.loginUser.password = query.newPassword;
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    uploadTx: function(req, res, next) {
        if (req.files && req.files.file && req.files.file.path) {
            var id = req.body.userId;
            var tx = req.body.userTx;
            var updateSql = 'update t_user set tx=? where id=?';
            var fileName = req.files.file.path.replace(/\\/g, '\/').replace('public/tmp/', '');
            pool.getConnection(function (err, connection) {
                if (err) logger.error(err);
                connection.query(updateSql, [fileName, Number(id)], function (err, result) {
                    res.json({code: 0, maessge: '上传成功', fileName: fileName});
                    common.moveFile('tx', fileName);
                    if (tx) {
                        common.deleteImg('/tx/' + tx);
                    }
                    connection.release();
                })
            })
        } else {
            res.json({code: 1, maessge: '上传失败', fileName: ''});
        };
        
    }
}