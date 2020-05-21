var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../../conf/db');
var common = require('../../conf/common');
var poolUser = mysql.createPool(db.mysql);


// 获取分类列表
router.post('/admin/bannerList', function (req, res, next) {
    var keys = [];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM banner" + query.where +" order by id desc" + query.limit;
    var countSql = "SELECT count(1) FROM banner"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL bannerList==> " + err);
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

// 添加轮播图
router.post('/admin/addBanner', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO banner(img,url,create_date) VALUES ?";
    var infoData = [[obj.img, obj.url, new Date()]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addBanner==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            if (err) {
                console.log(err)
                res.json({message: '操作失败', code: 1});
            } else {
                common.moveFile('banner', obj.img);
                res.json({message: '操作成功', code: 0});
            }
            conn.release();
        });
    })
});

// // 删除轮播图
router.post('/admin/deleteBanner', function (req, res, next) {
    var obj = req.body;
    var sql = "DELETE FROM banner where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL deleteBanner==> " + err);
        conn.query(sql, function (errr,result) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '删除失败', code: 1 });
            } else {
                common.deleteImg('banner/' + obj.img);
                res.json({message: '删除成功', code: 0 });
            }
            conn.release();
        })
    })
});


// 获取公告列表
router.post('/admin/noticeList', function (req, res, next) {
    var keys = ['type', 'title'];
    var query = common.filterQuery(keys, req.body, true)
    var sql = "SELECT * FROM notice" + query.where +" order by id desc" + query.limit;
    var countSql = "SELECT count(1) FROM notice"+ query.where;
    // console.log(sql)
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL noticeList==> " + err);
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

// 添加公告
router.post('/admin/addNotice', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO notice(title,cont,type,user_id,create_date) VALUES ?";
    var infoData = [[obj.title, obj.cont, obj.type, obj.user_id, new Date()]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addNotice==> " + err);
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

// 修改公告信息
router.post('/admin/updateNotice', function (req, res, next) {
    var obj = req.body;
    var sqlUp = "update notice set title = '"+ obj.title +"', type = "+ obj.type +", cont = '"+ obj.cont +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateNotice==> " + err);
        conn.query(sqlUp, function (errr,result) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '修改失败', code: 1 });
            } else {
                res.json({message: '修改成功', code: 0 });
            }
            conn.release();
        })
    })
});

// 删除公告
router.post('/admin/deleteNotice', function (req, res, next) {
    var obj = req.body;
    var sql = "DELETE FROM notice where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL deleteNotice==> " + err);
        conn.query(sql, function (errr,result) {
            // console.log(errr,'====')
            if (err) {
                res.json({message: '删除失败', code: 1 });
            } else {
                res.json({message: '删除成功', code: 0 });
            }
            conn.release();
        })
    })
});

module.exports = router;
