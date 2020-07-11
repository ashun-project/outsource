var mysql = require('mysql');
var conf = require('../conf/db');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');

module.exports = {
    queryAll: function (req, res, next) {
        console.log(req.session.loginUser, '======')
        if (req.session.loginUser.userName !== 'admin') {
            res.json({code: 1, message: '没有权限'});
            return
        }
        var keys = ['id', 'account', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_user" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_user"+ query.where;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                if (err) {
                    common.jsonWrite(res, err, result);
                    connection.release();
                } else {
                    connection.query(countSql, function (errC, count) {
                        var total = 0;
                        if (count && count[0]) total = count[0]['count(1)'];
                        common.jsonWrite(res, errC, {total: total, list: result});
                        connection.release();
                    })
                }
            });
        });
    },
    updatePassword: function(req, res, next) {
        if (req.session.loginUser.userName !== 'admin') {
            res.json({code: 1, message: '没有权限'});
            return
        }
        var query = req.body;
        var updateSql = 'update t_user set password=? where id=?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [query.password, query.id], function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    updateAmount: function(req, res, next) {
        if (req.session.loginUser.userName !== 'admin') {
            res.json({code: 1, message: '没有权限'});
            return
        }
        var query = req.body;
        var typeStr = query.as_type === '1' ? '+' : '-';
        var updateSql = 'update t_user set amount = amount '+ typeStr +' ? where id=?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [query.handleAMount, query.id], function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    addUser: function(req, res, next) {
        if (req.session.loginUser.userName !== 'admin') {
            res.json({code: 1, message: '没有权限'});
            return
        }
        var query = req.body;
        var addSql = 'insert into t_user(account, password, amount, create_date) VALUES (?, ?, ?, ?)';
        var querySql = "SELECT * FROM t_user where account = '" + query.account + "'";
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function(err, rows) {
                if (rows && rows.length) {
                    res.json({ code: 1, message: '帐号已存在' });
                    connection.release();
                } else {
                    connection.query(addSql, [query.account, query.password, Number(query.amount), new Date()], function (err, result) {
                        common.jsonWrite(res, err, result);
                        connection.release();
                    })
                }
            })
        })
    }
}