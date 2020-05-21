var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../conf/db');
// var common = require('../conf/common');
var poolUser = mysql.createPool(db.mysql);
var encryption = require('../conf/md5');

// 公司银行卡信息
router.post('/grab/banks', function (req, res, next) {
    var id = req.body.id;
    var sql = "SELECT * FROM banks where status = 2 and group_type = " + req.body.group_type;
    if (id) {
        sql += " and id = " + id;
    }
    // console.log(sql, '====')
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, banks: result});
            conn.release();
        })
    })
});

// 充值
router.post('/grab/recharge', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO recharge(amount,depositor,create_date,order_no,user_id,status,recharge_type,parent_top) VALUES ?";
    var orderNo = '';
    for (var i = 0; i < 16; i++) {
        orderNo += Math.floor(Math.random() * 10);
    }
    var infoData = [[
        obj.amount,
        obj.depositor,
        new Date(),
        'UUT' + orderNo,
        obj.id,
        1,
        obj.type,
        obj.parent_top
    ]];
    if (!obj.id) {
        res.json({message: '系统出错，请重新登入', code: 1});
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL recharge==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '提交订单失败', code: 1});
            } else {
                res.json({message: '提交信息成功', code: 0});
                // examine(obj);
            }
            conn.release();
        });
    })
});

// 充值列表
router.post('/grab/rechargeList', function (req, res, next) {
    var obj = req.body;
    var pageSize = obj.pageSize || 10;
    var limitNum = (obj.page - 1) * pageSize;
    if (obj.userId) {
        var sql = "SELECT * FROM recharge where user_id = "+ obj.userId +" order by create_date desc limit " + (limitNum + "," + pageSize);
    } else {
        var sql = "SELECT * FROM recharge where id = "+ obj.id;
    }
    
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL rechargeList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result});
            conn.release();
        })
    })
});

// 用户银行卡信息
router.post('/grab/userBanks', function (req, res, next) {
    var obj = req.body;
    var sql = "SELECT * FROM user_banks where user_id = "+ obj.userId + " order by id desc";
    
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL userBanks==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
});

// 绑定银行卡
router.post('/grab/bindBank', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO user_banks(bank_no,bank_name,payee,bank_dot,user_id) VALUES ?";
    var infoData = [[
        obj.bankNo,
        obj.bankName,
        obj.realName,
        obj.bankDot,
        obj.userId,
    ]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL bindBank==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            // console.log(err)
            res.json({message: '添加成功', code: 0 });
            conn.release();
        })
    })
});


// 提现
router.post('/grab/withdraw', function (req, res) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO withdraw(amount,user_id,create_date,order_no,status,withdraw_type,bank_no,bank_name,bank_dot,payee,parent_top) VALUES ?";
    var sql = "SELECT * FROM user where id = "+ obj.userId;
    var sqlWithdraw = "SELECT * FROM withdraw where status = 1 and user_id = "+ obj.userId;
    var sqlCount = "select count(1) FROM order_list where user_id = "+ obj.userId +" and TO_DAYS(create_date) = TO_DAYS(NOW())";
    var orderNo = '';
    for (var i = 0; i < 16; i++) {
        orderNo += Math.floor(Math.random() * 10);
    }
    var infoData = [[
        obj.amount,
        obj.userId,
        new Date(),
        'UUT' + orderNo,
        1,
        1,
        obj.bankNo,
        obj.bankName,
        obj.bankDot,
        obj.bankPayee,
        obj.parent_top
    ]];
    if (!obj.userId) {
        res.json({message: '系统出错，请重新登入', code: 1});
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL withdraw==> " + err);
        // 抢单数量是否足够
        conn.query(sqlCount, function (countErr, total) {
            if (countErr) {
                res.json({message: '系统出错', code: 1});
                conn.release();
                return
            }
            var totalNum = total[0]['count(1)'];
            if (totalNum < 30) {
                res.json({message: '未满30单', code: 1});
                conn.release();
                return
            }
            conn.query(sqlWithdraw, function (withdrErr, withdrawList) {
                if (withdrErr) {
                    res.json({message: '系统出错', code: 1});
                    conn.release();
                    return
                }
                conn.query(sql, function (errr, row) {
                    if (errr) {
                        res.json({message: '系统出错', code: 1});
                        conn.release();
                        return
                    }
                    var user = row[0] || {};
                    var errTxt = '';
                    var totalAmount = user.amount;
                    for (var j = 0; j < withdrawList.length; j++) {
                        totalAmount -= withdrawList[j].amount;
                    }
                    if (user.capital !== encryption.md5(obj.capital + "grab")) {
                        errTxt = '资金密码错误';
                    }
                    if (totalAmount < obj.amount) {
                        errTxt = '金额不足';
                    }
                    if (errTxt) {
                        res.json({message: errTxt, code: 1});
                        conn.release();
                        return
                    }
                    conn.query(sqlInfo, [infoData], function (err, result) {
                        if (err) {
                            console.log(err)
                            res.json({message: '提交订单失败', code: 1});
                        } else {
                            res.json({message: '提交申请成功', code: 0});
                            // examineWithdraw(obj);
                        }
                        conn.release();
                    });
                })
            })
        })
    })
});

// 提现列表
router.post('/grab/withdrawList', function (req, res, next) {
    var obj = req.body;
    var pageSize = obj.pageSize || 10;
    var limitNum = (obj.page - 1) * pageSize;
    if (obj.userId) {
        var sql = "SELECT * FROM withdraw where user_id = "+ obj.userId +" order by create_date desc limit " + (limitNum + "," + pageSize);
    } else {
        var sql = "SELECT * FROM withdraw where id = "+ obj.id;
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL withdrawList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result});
            conn.release();
        })
    })
});



module.exports = router;