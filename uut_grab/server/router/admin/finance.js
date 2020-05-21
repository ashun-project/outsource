var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../../conf/db');
var common = require('../../conf/common');
var poolUser = mysql.createPool(db.mysql);


// 获取充值列表
router.post('/admin/rechargeList', function (req, res, next) {
    var keys = ['depositor','amount','startTime','endTime','status','user_id','parent_top'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM recharge"+ query.where +" order by create_date desc" + query.limit;
    var countSql = "SELECT count(1) FROM recharge"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL rechargeList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            conn.query(countSql, function (errr,count) {
                var total = 0;
                if (count && count[0]) total = count[0]['count(1)']
                res.json({message: '查询成功', code: 0, list: result, total: total });
                conn.release();
            })
        })
    })
});
// 获取所有充值信息
router.post('/admin/allRechargeList', function (req, res, next) {
    var keys = ['status', 'parent_top'];
    var query = common.filterQuery(keys, req.body, true);
    var sql = "SELECT * FROM recharge"+ query.where +" order by create_date desc";
    // console.log(sql, '=====')
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL rechargeList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
});

// 充值审核
router.post('/admin/rechargeUpdate', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update recharge set status = "+ obj.status +", remark = '"+ obj.remark +"' where status = 1 and id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL rechargeUpdate==> " + err);
        conn.query(sqlUp, function (errr,row) {
            // console.log(row,'====')
            if (err) {
                res.json({message: '修改失败', code: 1 });
            } else {
                res.json({message: '修改成功', code: 0 });
                if (obj.status == 2 && row.changedRows === 1) {
                    examineRecharge(obj, 0);
                }
            }
            conn.release();
        })
    })
});
function examineRecharge(obj, num) {
    var sql = "update user set amount = amount + "+ obj.amount +" where id = "+ obj.userId;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL examine==> " + err);
        conn.query(sql, function (err, result) {
            if (err && num < 5) {
                // console.log(err, '===')
                examineRecharge(obj, num + 1)
            } 
            conn.release();
        })
    })
}

// 获取提现列表
router.post('/admin/withdrawList', function (req, res, next) {
    var keys = ['payee','amount','startTime','endTime','status','bank_no','user_id','parent_top'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM withdraw"+ query.where +" order by create_date desc" + query.limit;
    var countSql = "SELECT count(1) FROM withdraw"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL withdrawList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            conn.query(countSql, function (errr,count) {
                var total = 0;
                if (count && count[0]) total = count[0]['count(1)']
                res.json({message: '查询成功', code: 0, list: result, total: total });
                conn.release();
            })
        })
    })
});

// 获取所有提现信息
router.post('/admin/allWithdrawList', function (req, res, next) {
    var keys = ['status', 'parent_top'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM withdraw"+ query.where +" order by create_date desc";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL allWithdrawList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
});

// 提现审核
router.post('/admin/withdrawUpdate', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update withdraw set status = "+ obj.status +", remark = '"+ obj.remark +"' where status = 1 and id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL withdrawUpdate==> " + err);
        conn.query(sqlUp, function (errr,row) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '修改失败', code: 1 });
            } else {
                res.json({message: '修改成功', code: 0 });
                if (obj.status == 2 && row.changedRows === 1) {
                    examineWithdraw(obj, 0);
                }
            }
            conn.release();
        })
    })
});
function examineWithdraw(obj, num) {
    var sql = "update user set amount = amount - "+ obj.amount +" where id = "+ obj.userId;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL examine==> " + err);
        conn.query(sql, function (err, result) {
            if (err && num < 5) {
                // console.log(err, '===')
                examineWithdraw(obj, num + 1)
            } 
            conn.release();
        })
    })
}

// 公司银行卡信息
router.post('/admin/banks', function (req, res, next) {
    var keys = ['bank_no', 'status', 'payee', 'type', 'account_name'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM banks" + query.where + " order by id desc" + query.limit;
    var countSql = "SELECT count(1) FROM banks"+ query.where;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            conn.query(countSql, function (errr,count) {
                var total = 0;
                if (count && count[0]) total = count[0]['count(1)']
                res.json({message: '查询成功', code: 0, list: result, total: total });
                conn.release();
            })
        })
    })
});

// 修改银行卡信息
router.post('/admin/updateBanks', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update banks set status = "+ obj.status +", group_type = "+ obj.group_type +", bank_name = '"+ obj.bank_name +"', bank_no = '"+ obj.bank_no +"', bank_dot = '"+ obj.bank_dot +"', payee = '"+ obj.payee +"', remark = '"+ obj.remark +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateBanks==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            res.json({message: '修改成功', code: 0 });
            conn.release();
        })
    })
});

// 添加银行卡
router.post('/admin/addBanks', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO banks(payee,bank_name,bank_no,bank_dot,status,remark,type,group_type) VALUES ?";
    var infoData = [[obj.payee, obj.bank_name, obj.bank_no, obj.bank_dot, obj.status,obj.remark,obj.type,obj.group_type]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL recharge==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '添加失败', code: 1});
            } else {
                res.json({message: '添加成功', code: 0});
            }
            conn.release();
        });
    })
});

// 添加微信或者支付宝
router.post('/admin/addPay', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO banks(account_name,qr_code,status,type,group_type) VALUES ?";
    var infoData = [[obj.account_name,obj.qr_code,obj.status,obj.type,obj.group_type]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addPay==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '添加失败', code: 1});
            } else {
                common.moveFile('pay', obj.qr_code);
                res.json({message: '添加成功', code: 0});
            }
            conn.release();
        });
    })
});

// 修改支付信息
router.post('/admin/updatePay', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update banks set status = "+ obj.status +", group_type = "+ obj.group_type +", account_name = '"+ obj.account_name +"', qr_code = '"+ obj.qr_code +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updatePay==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '修改失败', code: 1 });
            } else {
                res.json({message: '修改成功', code: 0 });
                if (obj.oldCode !== obj.qr_code) {
                    common.moveFile('pay', obj.qr_code);
                    common.deleteImg('pay/' + obj.oldCode);
                }
            }
            conn.release();
        })
    })
});


// 删除银行卡信息跟支付信息
router.post('/admin/deleteBank', function (req, res, next) {
    var obj = req.body;
    var sql = "DELETE FROM banks where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL deleteBank==> " + err);
        conn.query(sql, function (errr,result) {
            // console.log(errr,'====')
            if (obj.qr_code) {
                common.deleteImg('pay/' + obj.qr_code);
            }
            res.json({message: '删除成功', code: 0 });
            conn.release();
        })
    })
});


// 获取佣金列表
router.post('/admin/commissionList', function (req, res, next) {
    var user = req.body.user;
    if (!user || !user.id) {
        res.json({message: '数据有误', code: 1 });
        return
    }
    var sql = "select * FROM order_list where user_level <= "+ (user.level + 3) +" and user_level > "+ user.level +" and DATE_FORMAT(create_date,'%Y%m%d') = '" + req.body.date + "'";
    var sqlUser = "select * FROM user where level <= "+ (user.level + 3) +" and level > "+ user.level +" and parent_top = '"+ user.parent_top +"'";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL commissionList==> " + err);
        conn.query(sqlUser, function (errUser, userList) {
            if (errUser) {
                res.json({message: '查询代理用户失败', code: 1 });
                conn.release();
                return
            }
            conn.query(sql, function (err, orderList) {
                if (err) {
                    console.log(err, '====')
                    res.json({message: '查询订单失败', code: 1 });
                    conn.release();
                    return
                }
                var uList = getUserList(userList, user.id);
                var result = getOrderList(uList, orderList, user.level);
                // console.log(userList, orderList, '===')
                res.json({message: '查询成功', code: 0, result: result });
                conn.release();
            })
        })
        
    })
})
function getOrderList(uList, oList, level) {
    // console.log(uList, '===', oList)
    var list = [];
    var total = 0;
    var commissin = [0, 16, 8, 4];
    for (var i = 0; i < oList.length; i++) {
        var filterUser = uList.filter(item => item.id === oList[i].user_id);
        if (filterUser.length) {
            oList[i].phone = filterUser[0].phone;
            var profit = oList[i].earn / 100 * commissin[oList[i].user_level - level];
            var newObj = {
                create_date: oList[i].create_date,
                level: oList[i].user_level - level,
                phone: filterUser[0].phone,
                amount: oList[i].earn
            }
            total += profit;
            list.push(newObj);
        }
    }
    return {list: list, total: total}
}
function getUserList(list, parentId) {
    var levelNum = 1;
    var levelList = list.filter(item => item.parent_id == parentId);
    filterChilds(levelList);
    function filterChilds(parents) {
        var arr = [];
        for (var i = 0; i  < parents.length; i++) {
            arr = arr.concat(list.filter(item => item.parent_id == parents[i].id));
        }
        levelNum += 1;
        if (arr.length && levelNum <= 3) {
            levelList = levelList.concat(arr);
            filterChilds(arr)
        }
    }
    return levelList;
}
// 获取佣金列表===========------结束


module.exports = router;
