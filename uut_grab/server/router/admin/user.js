var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../../conf/db');
var common = require('../../conf/common');
var poolUser = mysql.createPool(db.mysql);
var requestIp = require('request-ip');


// 获取用户列表
router.post('/admin/userList', function (req, res, next) {
    var keys = ['phone', 'minAmount', 'maxAmount', 'startTime', 'endTime', 'invite', 'id', 'parent_top'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM user" + query.where +" order by create_date desc" + query.limit;
    var countSql = "SELECT count(1) FROM user"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL userList==> " + err);
        conn.query(sql, function (errList,result) {
            if (errList) {
                res.json({message: '查询失败', code: 1 });
                conn.release();
            } else {
                conn.query(countSql, function (errr,count) {
                    var total = 0;
                    if (count && count[0]) total = count[0]['count(1)']
                    res.json({message: '查询成功', code: 0, list: result, total: total });
                    conn.release();
                })
            }
        })
    })
});
router.post('/admin/allUserList', function (req, res, next) {
    var sql = "SELECT * FROM user where parent_top != '888888' order by create_date desc";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL userList==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
});

// 修改用户信息
router.post('/admin/updateUser', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update user set phone = "+ obj.phone +", password = '"+ obj.password +"', status = "+ obj.status +", group_type = "+ obj.group_type +" where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateBanks==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            res.json({message: '修改成功', code: 0 });
            conn.release();
        })
    })
});

// 用户加减款
router.post('/admin/addSubAmount', function (req, res, next) {
    var obj = req.body;
    var orderNo = '';
    for (var i = 0; i < 16; i++) {
        orderNo += Math.floor(Math.random() * 10);
    }
    var sqlInfo = "INSERT INTO recharge(amount,depositor,order_no,user_id,status,recharge_type,create_date,as_type,parent_top) VALUES ?";
    var infoData = [[obj.handleAMount, 'UU平台', 'UUT' + orderNo, obj.id, 1, 0, new Date(), obj.as_type, obj.parent_top]];
    if (obj.type === '2') {
        sqlInfo = "INSERT INTO withdraw(amount,user_id,order_no,status,withdraw_type,bank_no,bank_name,bank_dot,payee,create_date,as_type,parent_top) VALUES ?";
        infoData = [[obj.handleAMount, obj.id, 'UUT' + orderNo, 1, 0, '暂无', '暂无', '暂无', 'UU平台', new Date(), obj.as_type, obj.parent_top]];
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addSubAmount==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '操作失败', code: 1});
            } else {
                res.json({message: '操作成功', code: 0});
            }
            conn.release();
        });
    })
});

// 重置资金密码
router.post('/admin/resetCapital', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update user set capital = '' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateBanks==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            res.json({message: '修改成功', code: 0 });
            conn.release();
        })
    })
});

// 获取用户银行卡列表
router.post('/admin/userBankList', function (req, res, next) {
    var keys = ['payee', 'bank_no', 'user_id'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM user_banks" + query.where +" order by id desc" + query.limit;
    var countSql = "SELECT count(1) FROM user_banks"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL userList==> " + err);
        conn.query(sql, function (errList,result) {
            if (errList) {
                res.json({message: '查询失败', code: 1 });
                conn.release();
            } else {
                conn.query(countSql, function (errr,count) {
                    var total = 0;
                    if (count && count[0]) total = count[0]['count(1)']
                    res.json({message: '查询成功', code: 0, list: result, total: total });
                    conn.release();
                })
            }
        })
    })
});

// 更新银行卡
router.post('/admin/updateUserBanks', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update user_banks set bank_dot = '"+ obj.bank_dot +"', bank_name = '"+ obj.bank_name +"', bank_no = '"+ obj.bank_no +"', payee = '"+ obj.payee +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateUserBanks==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            res.json({message: '修改成功', code: 0 });
            conn.release();
        })
    })
});

// 获取用户地址列表
router.post('/admin/userAddresssList', function (req, res, next) {
    var keys = ['phone', 'name', 'user_id'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM address" + query.where +" order by id desc" + query.limit;
    var countSql = "SELECT count(1) FROM address"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL userAddresssList==> " + err);
        conn.query(sql, function (errList,result) {
            if (errList) {
                res.json({message: '查询失败', code: 1 });
                conn.release();
            } else {
                conn.query(countSql, function (errr,count) {
                    var total = 0;
                    if (count && count[0]) total = count[0]['count(1)']
                    res.json({message: '查询成功', code: 0, list: result, total: total });
                    conn.release();
                })
            }
        })
    })
});

// 用户地址更新
router.post('/admin/updateAddress', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update address set phone = '"+ obj.phone +"', name = '"+ obj.name +"', city = '"+ obj.city +"', address = '"+ obj.address +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateAddress==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            res.json({message: '修改成功', code: 0 });
            conn.release();
        })
    })
});

// 注册
router.post('/admin/addUser', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO user(phone,password,invite,level,create_date,parent_id,parent_top,ip) VALUES ?";
    var sqlVP = "SELECT * FROM user WHERE binary invite = '" + obj.invite +"' or phone = '" + obj.phone +"'";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addUser==> " + err);
        conn.query(sqlVP, function (errP,vpResult) {
            if (errP) {
                res.json({message: '查询数据失败', code: 1});
                conn.release();
                return
            }
            var dbs = vpResult || [];
            var rpPhone = dbs.filter(item => item.phone === obj.phone)[0];
            var parent = dbs.filter(item => item.invite === obj.invite)[0];
            if (rpPhone) {
                res.json({message: '手机号码已存在', code: 1});
                conn.release();
                return
            } else if (!parent && obj.invite) {
                res.json({message: '邀请码无效', code: 1});
                conn.release();
                return
            } else {
                common.inviteCode().then(newInvite => {
                    var level = obj.invite ? parent.level + 1 : 1;
                    var parentId = obj.invite ? parent.id : 0;
                    var parentTop = obj.invite ? parent.parent_top : newInvite;
                    var IP = requestIp.getClientIp(req);
                    var infoData = [[obj.phone,obj.password,newInvite,level,new Date(),parentId,parentTop,IP]];
                    conn.query(sqlInfo, [infoData], function (err, result) {
                        if (err) {
                            console.log(err)
                            res.json({message: '数据插入失败', code: 1});
                        } else {
                            res.json({message: '添加成功', code: 0});
                        }
                        conn.release();
                    });
                }).catch(function () {
                    res.json({message: '数据插入失败', code: 1});
                    conn.release();
                })
            }
        })
    })
});

// 获取短信验证列表
// router.post('/admin/userBankList', function (req, res, next) {
//     var keys = ['payee', 'bank_no', 'user_id'];
//     var query = common.filterQuery(keys, req.body, true)
//     var sql = "SELECT * FROM user_banks" + query.where;
//     // console.log(sql)
//     poolUser.getConnection(function (err, conn) {
//         if (err) console.log("POOL userList==> " + err);
//         conn.query(sql, function (errr,result) {
//             result = result || []
//             res.json({ message: '查询成功', code: 0, list: result });
//             conn.release();
//         })
//     })
// });

module.exports = router;
