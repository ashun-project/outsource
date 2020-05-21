var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../../conf/db');
var common = require('../../conf/common');
var poolUser = mysql.createPool(db.mysql);


// 获取订单列表
router.post('/admin/orderList', function (req, res, next) {
    var keys = ['user_id', 'order_no', 'status', 'startTime', 'endTime','parent_top'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM order_list" + query.where +" order by create_date desc" + query.limit;
    var countSql = "SELECT count(1) FROM order_list"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL orderList==> " + err);
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

// 每日收益
// router.post('/admin/profitList', function (req, res, next) {
//     var keys = [];
//     var query = common.filterQuery(keys, req.body)
//     var sql = "SELECT * FROM user" + query.where +" order by create_date desc";
//     // console.log(sql)
//     poolUser.getConnection(function (err, conn) {
//         if (err) console.log("POOL updateBanks==> " + err);
//         conn.query(sql, function (errr,result) {
//             // console.log(errr,'====')
//             res.json({message: '查询成功', code: 0, list: result });
//             conn.release();
//         })
//     })
// });

// 用户加减款
// router.post('/admin/addSubAmount', function (req, res, next) {
//     var obj = req.body;
//     var orderNo = '';
//     for (var i = 0; i < 16; i++) {
//         orderNo += Math.floor(Math.random() * 10);
//     }
//     var sqlInfo = "INSERT INTO recharge(amount,depositor,order_no,user_id,status,recharge_type,create_date) VALUES ?";
//     var infoData = [[obj.handleAMount, 'DWD平台', 'DWD' + orderNo, obj.id, 1, 0, new Date()]];
//     if (obj.type === '2') {
//         sqlInfo = "INSERT INTO withdraw(amount,user_id,order_no,status,withdraw_type,bank_no,bank_name,bank_dot,payee,create_date) VALUES ?";
//         infoData = [[obj.handleAMount, obj.id, 'DWD' + orderNo, 1, 0, '暂无', '暂无', '暂无', 'DWD平台', new Date()]];
//     }
//     poolUser.getConnection(function (err, conn) {
//         if (err) console.log("POOL addSubAmount==> " + err);
//         conn.query(sqlInfo, [infoData], function (err, result) {
//             if (err) {
//                 console.log(err)
//                 res.json({message: '操作失败', code: 1});
//             } else {
//                 res.json({message: '操作成功', code: 0});
//             }
//             conn.release();
//         });
//     })
// });


module.exports = router;
