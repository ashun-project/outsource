var mysql = require('mysql');
var conf = require('../conf/db');
var encryption = require('../conf/md5');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');
var request = require('request');


function setRefund(account, amount, outorderno) {
    var updateSql = 'update t_user set amount = amount + ? where account = ?';
    pool.getConnection(function (err, connection) {
        if (err) logger.error(err);
        connection.query(updateSql, [amount, account], function(err, rows) {
            if(err) {
                logger.error('退款出错--' + outorderno + '--' + err);
            }
            connection.release();
        })
    })
}

function createOrders(list, amount, account) {
    var num = 0;
    return new Promise(function(resolve, reject){
        function setOrderList() {
            //处理逻辑
            var appkey = '5547e939f267071f';
            var phone = list[num];
            var outorderno = '';
            for (var i = 0; i < 16; i++) {
                outorderno += Math.floor(Math.random() * 10);
            }
            var md5 = encryption.md5(amount + phone + outorderno + "8N9wajaML7Jwxi1K3AqppzyhVJfkjayh");
            var url = 'https://api.jisuapi.com/mobilerecharge/recharge?appkey='+ appkey +'&mobile='+ phone +'&amount='+ amount +'&outorderno='+ outorderno +'&sign=' + md5;
            request(url, function (error, response, body) {
                // console.log(body, typeof body, response.body, typeof response.body);
                var resData = JSON.parse(response.body); // resData.status不等于0的话信息就有误了
                var result = resData.result || {};
                var addSql = 'insert into t_order(account, type, order_no, outorder_no, phone, amount, status, remark, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                if (resData.status !== 0 || result.rechargestatus === 2) {
                    setRefund(account, amount, outorderno);
                }
                pool.getConnection(function (err, connection) {
                    if (err) logger.error(err);
                    connection.query(addSql, [account, '急速数据', result.orderno, result.outorderno, result.mobile || phone, result.amount || amount, result.rechargestatus, resData.msg, new Date()], function(err, rows) {
                        if(err) {
                            logger.error('添加订单出错' + outorderno + '--' + err);
                        }
                        connection.release();
                        num++
                        if (num < list.length) {
                            setOrderList()
                        } else {
                            resolve();
                        }
                    })
                })
            })
        }
        setOrderList();
    })
}

module.exports = {
    queryAll: function (req, res, next) {
        var keys = ['amount', 'account', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_order" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_order"+ query.where;
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
    createOrder: function (req, res, next) {
        var query = req.body;
        var querySql = "SELECT * FROM t_user where account = '" + query.account + "'";
        var updateSql = 'update t_user set amount = amount - ? where account = ?';
        var list = query.list.filter(function(item) {
            return (/^1[23456789]\d{9}$/.test(item))
        })
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, rows) {
                if (err) {
                    common.jsonWrite(res, err, rows);
                    connection.release();
                } else {
                    var obj = rows[0] || {}
                    if (obj.account !== 'admin' && obj.amount < list.length * query.amount) {
                        res.json({code: 1, message: '余额不足'})
                        connection.release();
                        return
                    }
                    createOrders(list, query.amount, obj.account).then(function() {
                        if (obj.account === 'admin') {
                            common.jsonWrite(res, err, []);
                            connection.release();
                        } else {
                            connection.query(updateSql, [list.length * query.amount, query.account], function (err, result) {
                                common.jsonWrite(res, err, result);
                                connection.release();
                            })
                        }
                    })
                }
            });
        });
    },
    updateOrder: function (req, res, next) {
        var query = req.body;
        var updateSql = 'update t_order set status = ? where id = ?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [query.status, query.id], function (err, row) {
                if (query.status == 2 && row.changedRows === 1) {
                    setRefund(query.account, query.amount, query.outorder_no);
                }
                console.log(row, query.status)
                common.jsonWrite(res, err, row);
                connection.release();
            });
        });
    }
}