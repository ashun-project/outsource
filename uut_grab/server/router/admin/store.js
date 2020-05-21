var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../../conf/db');
var common = require('../../conf/common');
var poolUser = mysql.createPool(db.mysql);


// 获取分类列表
router.post('/admin/storeList', function (req, res, next) {
    var keys = ['name'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM store" + query.where +" order by id desc" + query.limit;
    var countSql = "SELECT count(1) FROM store"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL orderList==> " + err);
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

// 添加分类
router.post('/admin/addStore', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO store(name,min_amount,profit,status,logo) VALUES ?";
    var infoData = [[obj.name, obj.min_amount, obj.profit, obj.status, obj.logo]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addStore==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '操作失败', code: 1});
            } else {
                common.moveFile('store', obj.logo);
                res.json({message: '操作成功', code: 0});
            }
            conn.release();
        });
    })
});

// 删除分类
router.post('/admin/deleteStore', function (req, res, next) {
    var obj = req.body;
    var sql = "DELETE FROM store where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL deleteStore==> " + err);
        conn.query(sql, function (errr,result) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '删除失败', code: 1 });
            } else {
                common.deleteImg('store/' + obj.logo);
                res.json({message: '删除成功', code: 0 });
            }
            conn.release();
        })
    })
});

// 修改分类信息
router.post('/admin/updateStore', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update store set name = '"+ obj.name +"', min_amount = "+ obj.min_amount +", profit = "+ obj.profit +", status = "+ obj.status +", logo = '"+ obj.logo +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateStore==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '修改失败', code: 1 });
            } else {
                res.json({message: '修改成功', code: 0 });
                if (obj.oldLogo !== obj.logo) {
                    common.moveFile('store', obj.logo);
                    common.deleteImg('store/' + obj.oldLogo);
                }
            }
            conn.release();
        })
    })
});


// 获取商品列表
router.post('/admin/goodsList', function (req, res, next) {
    var keys = ['store_name', 'store_id'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM goods" + query.where +" order by create_date desc" + query.limit;
    var countSql = "SELECT count(1) FROM goods"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL goodsList==> " + err);
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


// 添加商品
router.post('/admin/addGoods', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO goods(goods_name,store_name,price,store_id,logo,create_date) VALUES ?";
    var infoData = [[obj.goods_name, obj.store_name, obj.price, obj.store_id, obj.logo, new Date()]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addGoods==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '操作失败', code: 1});
            } else {
                common.moveFile('goods', obj.logo);
                res.json({message: '操作成功', code: 0});
            }
            conn.release();
        });
    })
});

// 修改商品
router.post('/admin/updateGoods', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update goods set store_name = '"+ obj.store_name +"', goods_name = '"+ obj.goods_name +"', price = "+ obj.price +", store_id = "+ obj.store_id +", logo = '"+ obj.logo +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateGoods==> " + err);
        conn.query(sqlUp, function (errr,result) {
            if (err) {
                res.json({message: '修改失败', code: 1 });
            } else {
                res.json({message: '修改成功', code: 0 });
                if (obj.oldLogo !== obj.logo) {
                    common.moveFile('goods', obj.logo);
                    common.deleteImg('goods/' + obj.oldLogo);
                }
            }
            conn.release();
        })
    })
});

// 删除商品
router.post('/admin/deleteGoods', function (req, res, next) {
    var obj = req.body;
    var sql = "DELETE FROM goods where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL deleteGoods==> " + err);
        conn.query(sql, function (errr,result) {
            if (err) {
                res.json({message: '删除失败', code: 1 });
            } else {
                common.deleteImg('goods/' + obj.logo);
                res.json({message: '删除成功', code: 0 });
            }
            conn.release();
        })
    })
});


module.exports = router;
