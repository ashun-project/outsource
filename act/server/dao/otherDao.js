var mysql = require('mysql');
var conf = require('../conf/db');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');
var fs = require("fs");

module.exports = {
    dianzhang: function (req, res, next) {
        if (!req.session.loginUser || !req.session.loginUser.userName) {
            res.json({code: 3301, message: '登录失效'});
            return
        }
        var params = req.body;
        var addSql = 'insert into t_dz(user_id, zodiac_id, user_name, issue, zodiac_title, zodiac_type, zodiac_img, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        var dataSql = [params.userId, params.zodiacId, params.userName, params.issue, params.zodiacTitle, params.zodiacType, params.zodiacImg, new Date()];
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(addSql, dataSql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    dlDianzhang: function (req, res, next) {
        if (!req.session.loginUser || !req.session.loginUser.userName) {
            res.json({code: 3301, message: '登录失效'});
            return
        }
        var params = req.body;
        var sql = "DELETE FROM t_dz WHERE user_id = " + params.userId;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(sql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    dianzhangList: function (req, res, next) {
        var keys = ['zodiac_id', 'issue'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_dz" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_dz"+ query.where;
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
    collectList: function (req, res, next) {
        var keys = ['zodiac_id', 'issue', 'user_id'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_collect" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_collect"+ query.where;
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
    addCollect: function (req, res, next) {
        if (!req.session.loginUser || !req.session.loginUser.userName) {
            res.json({code: 3301, message: '登录失效'});
            return
        }
        var params = req.body;
        var addSql = 'insert into t_collect(user_id, zodiac_id, user_name, issue, zodiac_title, zodiac_type, zodiac_img, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        var dataSql = [params.userId, params.zodiacId, params.userName, params.issue, params.zodiacTitle, params.zodiacType, params.zodiacImg, new Date()];
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(addSql, dataSql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    dlCollect: function (req, res, next) {
        if (!req.session.loginUser || !req.session.loginUser.userName) {
            res.json({code: 3301, message: '登录失效'});
            return
        }
        var params = req.body;
        var sql = "DELETE FROM t_collect WHERE user_id = " + params.userId;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(sql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    commentList: function (req, res, next) {
        var keys = ['zodiac_id', 'issue', 'examine', 'reply_id', 'user_id', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_pl" + query.where +" order by create_date desc" + query.limit;
        // console.log(querySql, '====')
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    },
    addComment: function (req, res, next) {
        if (!req.session.loginUser || !req.session.loginUser.userName) {
            res.json({code: 3301, message: '登录失效'});
            return
        }
        var examineData = fs.readFileSync(process.cwd() + '/common/c_examine.json','utf-8');
        var examine = JSON.parse(examineData);

        var params = req.body;
        var addSql = 'insert into t_pl(user_id, zodiac_id, user_name, issue, zodiac_title, reply_id, cont, user_tx, zodiac_type, zodiac_img, examine, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var dataSql = [params.userId, params.zodiacId, params.userName, params.issue, params.zodiacTitle, params.replyId, params.cont, params.userTx, params.zodiacType, params.zodiacImg, examine.is_examine, new Date()];
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(addSql, dataSql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    bannerList: function (req, res, next) {
        var querySql = "SELECT * FROM t_banner where type = "+ req.body.type +" order by create_date desc";
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    },
    noticeList: function (req, res, next) {
        var querySql = "SELECT * FROM t_notice order by create_date desc limit 0, 1";
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    }
}