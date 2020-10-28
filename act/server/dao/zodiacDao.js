var mysql = require('mysql');
var conf = require('../conf/db');
var logger = require('../common/logger');
var request = require("request");
var path = require("path");
var fs = require("fs");
var http = require('https');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');


// var jsonData = require('./result');
// var addSql = 'insert into t_zodiac(sort, url, title, img, type) VALUES (?, ?, ?, ?, ?)';
// function setInfo (num) {
//     if (jsonData.length == num) return;
//     pool.getConnection(function (err, connection) {
//         if (err) logger.error(err);
//         connection.query(addSql, [jsonData[num].sortType, jsonData[num].url, jsonData[num].title, jsonData[num].imgType, jsonData[num].type], function (err, result) {
//             connection.release();
//             setInfo(num + 1);
//         })
//     })
// }
// setInfo(0);
// var jsonLotty = require('./result1');
// var addLott = 'insert into t_note(lottery, issue, openCode, openTime, pet) VALUES (?, ?, ?, ?, ?)';
// function setLotty (num) {
//     if (jsonLotty.length == num) return;
//     pool.getConnection(function (err, connection) {
//         if (err) logger.error(err);
//         connection.query(addLott, [jsonLotty[num].lotteryId, jsonLotty[num].issue, jsonLotty[num].openCode, jsonLotty[num].openTime, jsonLotty[num].pet], function (err, result) {
//             connection.release();
//             setLotty(num + 1);
//         })
//     })
// }
// setLotty(0);


//创建文件夹目录
var dirPath = process.cwd() + "/public/zodiac";
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log("文件夹创建成功");
}
if (!fs.existsSync(dirPath+'/col')) {
    fs.mkdirSync(dirPath+'/col');
    console.log("文件夹创建成功");
}
if (!fs.existsSync(dirPath+'/black')) {
    fs.mkdirSync(dirPath+'/black');
    console.log("文件夹创建成功");
}

module.exports = {
    queryList: function (req, res, next) {
        var keys = [];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_zodiac" + query.where +" order by id asc" + query.limit;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    },
    zodiacType: function (req, res, next) {
        var keys = ['id', 'type', 'search'];
        var query = common.filterQuery(keys, req.body)
        var querySql = "SELECT * FROM t_zodiac" + query.where;
        // console.log(querySql, '====')
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    },
    getImg: function (req, res, next) {
        var query = req.body;
        var cIssue = (query.issue + '').replace('2020', '');
        // var imgFile = req.url.replace('/am/zodiacImg/', '').split('?')[0];
        // var fileSpt = imgFile.split('/');
        var imgPath = path.join(dirPath + '/' + query.type, cIssue + '_' + query.img);
        if (!fs.existsSync(imgPath)) {
            var url = "https://mgtk2.suyuan1688.com/" + query.type + '/' + cIssue + '/' + query.img;
            // var url = 'https://tk2.suyuan1688.com/col/225/amsbx.jpg'//'https://mgtk2.suyuan1688.com/col/225/amsbx.jpg';
            // console.log(imgPath, '=====', url)
            var options = {
                method: 'GET',
                url: url,
                gzip: true,
                encoding: null,
                strictSSL: false,
                headers: {
                    "Content-Type": 'image/svg+xml',
                    "X-Forwarded-For": '42.194.64.18',
                    'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                    'Cookie': "PHPSESSID=88f1qocpntbtjnp990pkqvo3a4; UM_distinctid=16846df58e71c8-0735f5020bd16-10326653-13c680-16846df58e8f22; CNZZDATA1273706240=1075868105-1547372666-http%253A%252F%252Fmvxoxo.com%252F%7C1547431260; CNZZDATA1275906764=206766016-1547375436-http%253A%252F%252Fmvxoxo.com%252F%7C1547430243"
                }
            };
            var readStream = request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    fs.writeFile(imgPath, body, function(err) {
                        if(err) {
                            console.log(err);
                            res.json({ code: 1, message: '下载图片失败'});
                        } else {
                            res.json({ code: 0, message: '操作成功'});
                        }
                    });
                } else {
                    res.json({ code: 1, message: '下载图片失败'})
                    logger.error(url + "===下载图片失败:" + error);
                }
            })
        } else {
            res.json({ code: 0, message: '操作成功'})
        }
    }
    // getImg: function (req, res, next) {
    //     var imgFile = req.url.replace('/am/zodiacImg/', '').split('?')[0];
    //     var fileSpt = imgFile.split('/');
    //     var imgPath = path.join(dirPath + '/' + fileSpt[0], fileSpt[2]);

    //     if (!fs.existsSync(imgPath)) {
    //         var url = "https://mgtk2.suyuan1688.com/" + fileSpt[0] + '/' + fileSpt[1] + '/' + fileSpt[2].replace(fileSpt[1]+'_', '');
    //         // var url = 'https://tk2.suyuan1688.com/col/225/amsbx.jpg'//'https://mgtk2.suyuan1688.com/col/225/amsbx.jpg';
    //         var options = {
    //             method: 'GET',
    //             url: url,
    //             gzip: true,
    //             encoding: null,
    //             strictSSL: false,
    //             headers: {
    //                 "Content-Type": 'image/svg+xml',
    //                 "X-Forwarded-For": '42.194.64.18',
    //                 'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
    //                 'Cookie': "PHPSESSID=88f1qocpntbtjnp990pkqvo3a4; UM_distinctid=16846df58e71c8-0735f5020bd16-10326653-13c680-16846df58e8f22; CNZZDATA1273706240=1075868105-1547372666-http%253A%252F%252Fmvxoxo.com%252F%7C1547431260; CNZZDATA1275906764=206766016-1547375436-http%253A%252F%252Fmvxoxo.com%252F%7C1547430243"
    //             }
    //         };
    //         // var writeStream = fs.createWriteStream(imgPath);
    //         // var readStream = request(options);
    //         // readStream.pipe(res);
    //         // readStream.pipe(writeStream);
    //         // readStream.on('end', function(response) {
    //         //     // console.log('文件下载成功');
    //         //     // console.log(response, response.statusCode, '=====');
    //         // });
    //         // readStream.on('error', function(err) {
    //         //     logger.error(url + "下载图片失败:" + err);
    //         // })
    //         // writeStream.on("finish", function() {
    //         //     // console.log("文件写入成功");
    //         //     writeStream.end();
    //         // });
    //         var readStream = request(options, function(error, response, body) {
    //             if (!error && response.statusCode == 200) {
    //                 fs.writeFile(imgPath, body, function(err) {
    //                     if(err) {console.log(err)}
    //                 });
    //             } else {
    //                 logger.error(url + "===下载图片失败:" + error);
    //             }
    //         })
    //         readStream.pipe(res);
    //     } else {
    //         // console.log(34234234234234)
    //         var content = fs.readFileSync(imgPath,"binary"); 
    //         res.writeHead(200, "Ok");
    //         res.write(content,"binary"); //格式必须为 binary，否则会出错
    //         res.end();
    //     }
    // }
}