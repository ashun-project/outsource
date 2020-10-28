var mysql = require('mysql');
var conf = require('../conf/db');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');
var request = require('request');
var fs = require("fs");

function delDir(type){
    let files = [];
    var path = process.cwd() + "/public/examine/" + type;
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                // delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
    }
}

function getIssueData(refresh) {
    var option = {
        url: 'https://his.duomaids.com/api/HistoryOpenInfo',
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { lotteryId: 2032, issueNum: 6 }
    }
    var todayDate = new Date();
    var nowTime = todayDate.getTime();
    var startTime = new Date(todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate() + ' 21:35:00').getTime();
    var endTime = new Date(todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate() + ' 21:50:50').getTime();
    var timeS = startTime + (24 * 60 * 60 * 1000);
    var doType = refresh == 'new' ? '手动操作' : '自动操作';

    request(option, function(error, response, body) {
        var txtTip = todayDate.getDate() + '日' + todayDate.getHours() + ':' + todayDate.getMinutes() + ' ' + doType + '---抓取了一次数据做个记录===='
        if (!error && response.statusCode == 200) {
            // console.log(body.data)
            if (body.data && body.data.length) {
                logger.error(txtTip + '成功');
                setLotty(body.data, body.data.length - 1);
            } else {
                logger.error(txtTip + '未知数据');
            }
        } else {
            logger.error(txtTip + '失败');
        }

        if (nowTime > startTime && nowTime < endTime) {
            setTimeout(function () {
                getIssueData(true);
            }, 2 * 60 * 1000);
        }
    })
    
    if (nowTime < startTime) {
        timeS = startTime;
    }
    // console.log(timeS - nowTime, '=====')
    if (!refresh) {
        setTimeout(function () {
            //删除文件夹目录
            delDir('col');
            delDir('black');
            
            getIssueData();
        }, timeS - nowTime + 1000);
    }
}
// var jsonLotty = require('./result1');

function setLotty (dataList, num) {
    if (num < 0) return;
    var addLott = 'insert into t_note(lottery, issue, openCode, openTime, videoUrl, pet, create_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    var querySql = "SELECT * FROM t_note where issue = " + dataList[num].issue;
    pool.getConnection(function (err, connection) {
        if (err) logger.error(err);
        connection.query(querySql, function (err, result) {
            if (result && result.length) {
                connection.release();
                setLotty(dataList, num - 1);
            } else {
                connection.query(addLott, [dataList[num].lotteryId, dataList[num].issue, dataList[num].openCode, dataList[num].openTime, dataList[num].videoUrl, dataList[num].pet, new Date()], function (err, result) {
                    connection.release();
                    setLotty(dataList, num - 1);
                })
            }
        });
    })
}
getIssueData();


module.exports = {
    queryAll: function (req, res, next) {
        var keys = [];
        var query = common.filterQuery(keys, req.body, true);
        var refresh = req.body.refresh;
        // console.log(req.body, '=====')
        if (refresh) {
            getIssueData(refresh);
            setTimeout(function () {
                var querySql = "SELECT * FROM t_note" + query.where +" order by id desc" + query.limit;
                pool.getConnection(function (err, connection) {
                    if (err) logger.error(err);
                    connection.query(querySql, function (err, result) {
                        common.jsonWrite(res, err, result);
                        connection.release();
                    });
                });
            }, 3900)
        } else {
            var querySql = "SELECT * FROM t_note" + query.where +" order by id desc" + query.limit;
            pool.getConnection(function (err, connection) {
                if (err) logger.error(err);
                connection.query(querySql, function (err, result) {
                    common.jsonWrite(res, err, result);
                    connection.release();
                });
            });
        }
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