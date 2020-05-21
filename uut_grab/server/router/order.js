var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../conf/db');
// var common = require('../conf/common');
var poolUser = mysql.createPool(db.mysql);


// 获取地址信息
router.post('/grab/addressList', function (req, res, next) {
    var obj = req.body;
    if (obj.userId) {
        var sql = "SELECT * FROM address where user_id = "+ obj.userId +" order by id desc";
    } else {
        var sql = "SELECT * FROM address where id = "+ obj.id;
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, list: result});
            conn.release();
        })
    })
});

// 添加地址
router.post('/grab/addAddress', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO address(name,city,address,phone,user_id) VALUES ?";
    var infoData = [[
        obj.name,
        obj.city,
        obj.address,
        obj.phone,
        obj.userId,
    ]];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL addAddress==> " + err);
        conn.query(sqlInfo, [infoData], function (err, result) {
            // console.log(err)
            res.json({message: '添加成功', code: 0 });
            conn.release();
        })
    })
});

// 修改地址
router.post('/grab/editAddress', function (req, res, next) {
    var obj = req.body;
    var sql = "update address set name = '"+ obj.name +"', city = '"+ obj.city +"', address = '"+ obj.address +"', phone = '"+ obj.phone +"' where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL examine==> " + err);
        conn.query(sql, function (err, result) {
            res.json({message: '修改成功', code: 0 });
            conn.release();
        })
    })
})

// 设置为默认地址
// status = 2
router.post('/grab/updateAddress', function (req, res, next) {
    var obj = req.body;
    var sql = "update address set status = 2 where id = "+ obj.id;
    var sqlSelect = "SELECT * FROM address where user_id = "+ obj.userId +" and status = 2";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateAddress==> " + err);
        conn.query(sqlSelect, function (err, result) {
            if (result && result[0]) {
                result.id
                var editSql = "update address set status = 1 where id = "+ result[0].id;
                conn.query(editSql, function (err, result) {
                    conn.query(sql, function (err, result) {
                        res.json({message: '设置成功', code: 0 });
                        conn.release();
                    })
                })
            } else {
                conn.query(sql, function (err, result) {
                    res.json({message: '设置成功', code: 0 });
                    conn.release();
                })
            }
        })
    })
})

// 删除地址
router.post('/grab/deleteAddress', function (req, res, next) {
    var obj = req.body;
    var sql = "DELETE FROM address where id = "+ obj.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL deleteAddress==> " + err);
        conn.query(sql, function (err, result) {
            res.json({message: '删除成功', code: 0 });
            conn.release();
        })
    })
})

// 获取商品分类store
router.post('/grab/storeList', function (req, res, next) {
    var sql = "select * FROM store";
    if (req.body.id) {
        sql = "select * FROM store where id = " + req.body.id;
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL storeList==> " + err);
        conn.query(sql, function (err, result) {
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
})

// 获取商品
router.post('/grab/goodsList', function (req, res, next) {
    var sql = "select * FROM goods";
    if (req.body.id) {
        sql = "select * FROM goods where id = " + req.body.id;
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL goodsList==> " + err);
        conn.query(sql, function (err, result) {
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
})

// 核心功能抢单
// CREATE TABLE `grab`.`order` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `create_date` DECIMAL(20,2) NULL,
//     `order_no` VARCHAR(45) NULL,  定单号
//     `earn` DECIMAL(20,2) NULL,    赚取金额
//     `price` DECIMAL(20,2) NULL,   记录当时的价格， 防止变动
//     `user_id` INT NULL,           用户id
//     `goods_id` INT NULL,          商品id
//     `item` INT NULL,              商品数量
//     `address_id` INT NULL,        地址id
//     PRIMARY KEY (`id`));
  
router.post('/grab/grabOrder', function (req, res, next) {
    var obj = req.body;
    var sqlUsr = "SELECT * FROM user WHERE id = " + obj.userId;
    var sqlStore = "SELECT * FROM goods WHERE store_id = " + obj.storeId;
    var sqlCount = "select * FROM order_list where user_id = "+ obj.userId +" and TO_DAYS(create_date) = TO_DAYS(NOW())";
    var nowDate = new Date().getHours();
    if (nowDate < 10 || nowDate >= 22) {
        res.json({message: '抢单时间为早上10点到晚上10', code: 1});
        return
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL grabOrder==> " + err);
        // 获取用户信息
        conn.query(sqlCount, function (countErr, totalList) {
            if (countErr) {
                res.json({message: '系统出错', code: 1});
                conn.release();
                return
            }
            if (totalList.length >= 30) {
                res.json({message: '今日抢单数已满', code: 1});
                conn.release();
                return
            }
    // 获取今日订单总算======结束
            // 获取用户信息
            conn.query(sqlUsr, function (userErr, user) {
                if (userErr) {
                    res.json({message: '系统出错', code: 1});
                    conn.release();
                    return
                }
                if (user[0].status === 1) {
                    res.json({message: '帐号已被禁用', code: 3301});
                    conn.release();
                    return
                }
    //  获取用户信息=======结束
                // 获取商品信息
                conn.query(sqlStore, function (storeErr, store) {
                    if (storeErr) {
                        res.json({message: '系统出错', code: 1});
                        conn.release();
                        return
                    }
                    var frozenAmount = 0;
                    for (var j = 0; j < totalList.length; j++) {
                        if (totalList[j].status === 1) {
                            frozenAmount += totalList[j].price * totalList[j].item
                        }
                    }
                    var minMmount = obj.minMmount; // (user[0].amount || 0) - frozenAmount;
                    var userAmount = (user[0].amount || 0) - frozenAmount;
                    if (userAmount < obj.minMmount) {
                        res.json({message: '余额不足请充值', code: 1});
                        return
                    }
                    var maxProfit = minMmount / 100 * 70;//userAmount / 100 * 5 / 30;
                    var minProfit = minMmount / 100 * 10;//userAmount / 100 * 3.5 / 30;
                    var availStore = store.filter(item => {
                        return item.price <= maxProfit && item.price >= minProfit
                    });
                    if (!availStore.length) {
                        res.json({message: '没有匹配到订单', code: 1});
                        return
                    }
                    var num = Math.floor(Math.random() * availStore.length + 1);
                    var selected = availStore[num - 1];
                    // 有可能会高 4.5
                    // var maxItem = (maxProfit / selected.price < 1) ? 1 : maxProfit / selected.price;
                    var maxItem = (userAmount / 100 * 4.5 / 30) / (selected.price / 100 * obj.profit);
                    var item = Math.floor(Math.random() * maxItem + 1);
                    if (item * selected.price > maxProfit || item < 1) {
                        item = 1
                    }
                    console.log(selected.price, obj.profit, maxItem)

                    var sqlInfo = "INSERT INTO order_list(create_date,end_time,order_no,earn,user_id,goods_id,item,price,user_level,phone,parent_top) VALUES ?";
                    var orderNo = '';
                    for (var i = 0; i < 16; i++) {
                        orderNo += Math.floor(Math.random() * 10);
                    }
                    var infoData = [[
                        new Date(),
                        new Date(new Date().getTime() + (2 * 60 * 1000) + 1000),
                        'UUT' + orderNo,
                        item * selected.price / 100 * obj.profit,
                        obj.userId,
                        selected.id,
                        item,
                        selected.price,
                        user[0].level,
                        user[0].phone,
                        user[0].parent_top
                    ]];
    //  获取商品信息=========结束
                    // 创建订单
                    conn.query(sqlInfo, [infoData], function (err, result) {
                        if (err) {
                            // console.log(err, '====')
                            res.json({message: '创建订单失败', code: 1});
                        } else {
                            res.json({message: '抢单成功', code: 0});
                        }
                        conn.release();
                    })
                })
            })
        })
    })
})


// 查询当前订单列表
router.post('/grab/currentOrder', function (req, res, next) {
    var sql = "select * FROM order_list where user_id = "+ req.body.userId +" and status = 1 and end_time > DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')";
    // var sql = "select * FROM order_list where user_id = "+ req.body.userId +" and status = 1";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL currentOrder==> " + err);
        conn.query(sql, function (err, result) {
            // 判断订单记录页面时会调用
            if (req.body.page && req.body.status === 0) {
                getOrderNotes(res, conn, result);
            } else {
                res.json({message: '查询成功', code: 0, list: result });
                conn.release();
            }
        })
    })
})

// 查询所有冻结或已完成的数据
router.post('/grab/orderList', function (req, res, next) {
    var obj = req.body;
    var pageSize = obj.pageSize || 10;
    var limitNum = (obj.page - 1) * pageSize;
    // 如果是查冻结的订单加时间过滤
    var filterDate = obj.status === 1 ? ' and TO_DAYS(create_date) = TO_DAYS(NOW())' : '';
    var filterId = obj.userId ? (' and user_id = ' + obj.userId) : '';
    var sql = "select * FROM order_list where status = "+ obj.status + filterId + filterDate +" order by create_date desc limit " + (limitNum + "," + pageSize);
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL orderList==> " + err);
        conn.query(sql, function (err, result) {
            getOrderNotes(res, conn, result);
        })
    })
})
function getOrderNotes(res, conn, result) {
    if (!result || !result.length) {
        res.json({message: '查询成功', code: 0, list: [], goodsList: [] });
        conn.release();
        return
    }
    var ids = result.map(item => item.goods_id);
    var goodsSql = "select * from goods where id in ("+ ids.join(',') +")";
    conn.query(goodsSql, function (err, goodsList) {
        res.json({message: '查询成功', code: 0, list: result, goodsList: goodsList });
        conn.release();
    })
}

// 查询今日订单--已冻结订单
router.post('/grab/todayOrder', function (req, res, next) {
    var sql = "select * FROM order_list where user_id = "+ req.body.userId +" and TO_DAYS(create_date) = TO_DAYS(NOW())";
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL todayOrder==> " + err);
        conn.query(sql, function (err, result) {
            res.json({message: '查询成功', code: 0, list: result });
            conn.release();
        })
    })
})

// 提交订单
router.post('/grab/submitOrder', function (req, res, next) {
    var sqlSelect = "select * FROM order_list where id = "+ req.body.id;
    if (!req.body.id || !req.body.addressId) {
        res.json({message: '数据有误', code: 1 });
        return
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL submitOrder==> " + err);
        conn.query(sqlSelect, function (err, row) {
            if (row && row[0]) {
                // 防止黑客
                if (row[0].status !== 1) {
                    res.json({message: '提交失败', code: 1 });
                    conn.release();
                    return
                }
                var sqlUp = "update order_list set status = 2, address_id = "+ req.body.addressId +" where id = "+ req.body.id;
                conn.query(sqlUp, function (err, result) {
                    if (!err) {
                        updateUser(row[0]);
                    }
                    res.json({message: '提交成功', code: 0 });
                    conn.release();
                })
            } else {
                res.json({message: '提交失败', code: 1 });
                conn.release();
            }
        })
    })
})

//  更新用户表
function updateUser(obj, num) {
    var userSql = "update user set amount = amount + "+ obj.earn +" where id = "+ obj.user_id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateUser==> " + err);
        conn.query(userSql, function (err, result) {
            if (err && num < 6) {
                // console.log(err, '====')
                updateUser(obj, num+1);
            } else {
                updateParent(obj.user_id, obj.earn, 1, 0)
            }
            conn.release();
        })
    })
}
// 更新父级
function updateParent(id, earn, level, num) {
    // 顶级的parentID 要么为0， 要么为空，不能跟自身id一致 todo
    var sqlSelect = "select * FROM user where id = "+ id;
    var levelList = [0, 16, 8, 4];
    if (level > 3) return;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL updateUser==> " + err);
        conn.query(sqlSelect, function (err, user) {
            if (err && num < 6) {
                updateParent(id, level, num+1);
                conn.release();
                return
            }
            if (!user || !user.length) {
                conn.release();
                return
            }
            var updateSql = "update user set amount = amount + "+ (earn / 100 * levelList[level]) +" where id = "+ user[0].parent_id;
            conn.query(updateSql, function (err, result) {
                if (err && num < 6) {
                    updateParent(id, level, num+1);
                    conn.release();
                } else {
                    updateParent(user[0].parent_id, earn, level+1, 0);
                }
                conn.release();
            })
        })
    })
}


// 获取佣金列表
router.post('/grab/commissionList', function (req, res, next) {
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
                level: oList[i].user_level - level,
                phone: filterUser[0].phone.substr(-4,4),
                amount: oList[i].price * oList[i].item,
                earn: oList[i].earn,
                profit: profit,
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