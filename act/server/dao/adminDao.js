var mysql = require('mysql');
var conf = require('../conf/db');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');
var request = require("request");
var path = require("path");
var fs = require("fs");

//创建文件夹目录
var dirPath = process.cwd() + "/public/examine";
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
    login: function(req, res, next) {
        var query = req.body;
        if (query.account == 'amcpadmin' && query.password == 'amcp123456') {
            req.session.loginUser = {userName: query.account, code: 0};
            res.json({ code: 0, message: '登录成功'})
        } else {
            res.json({ code: 1, message: '帐号密码错误'})
        }
    },
    loginOut: function(req, res, next) {
        req.session.loginUser = null;
        res.clearCookie('testapp');
        res.json({message:'退出成功', code: 0});
    },
    queryUserAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = ['id', 'account', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_user" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_user"+ query.where;
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
    updatePassword: function(req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var updateSql = 'update t_user set password=? where id=?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [query.password, query.id], function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    queryCommentAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = ['user_id', 'issue', 'examine', 'zodiac_title', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_pl" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_pl"+ query.where;
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
    getExamineStatus: function (req, res, next) {
        var examineData = fs.readFileSync(process.cwd() + '/common/c_examine.json','utf-8');
        var examineObj = JSON.parse(examineData);
        res.json({code: 0, message: '修改成功', data: examineObj});
    },
    updateExamine: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var examineData = fs.readFileSync(process.cwd() + '/common/c_examine.json','utf-8');
        var examineObj = JSON.parse(examineData);
        examineObj.is_examine = query.examine;
        fs.writeFileSync(process.cwd() + '/common/c_examine.json', JSON.stringify(examineObj), 'utf-8');
        res.json({code: 0, message: '修改成功'});
    },
    updateCont: function(req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var updateSql = 'update t_pl set cont=?, examine=? where id=?';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [query.cont, query.examine || 2, query.id], function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    deleteComment: function(req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var sql = "DELETE FROM t_pl WHERE id = " + query.id;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(sql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    queryCollectAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = ['user_id', 'issue', 'zodiac_title', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_collect" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_collect"+ query.where;
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
    queryDzAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = ['user_id', 'issue', 'zodiac_title', 'startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_dz" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_dz"+ query.where;
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
    queryBannerAll: function (req, res, next) {
        var querySql = "SELECT * FROM t_banner order by create_date desc";
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    },
    addBanner: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var params = req.body;
        var addSql = 'insert into t_banner(img, url, type, create_date) VALUES (?, ?, ?, ?)';
        var dataSql = [params.img, params.url, params.type, new Date()];
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(addSql, dataSql, function (err, result) {
                common.moveFile('banner', params.img);
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    deleteBanner: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var sql = "DELETE FROM t_banner WHERE id = " + query.id;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(sql, function (err, result) {
                common.deleteImg('/banner/' + query.img);
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    queryNoticeAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = ['title','startTime', 'endTime'];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_notice" + query.where +" order by create_date desc" + query.limit;
        var countSql = "SELECT count(1) FROM t_notice"+ query.where;
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
    addNotice: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var params = req.body;
        var addSql = 'insert into t_notice(title, cont, create_date) VALUES (?, ?, ?)';
        var dataSql = [params.title, params.cont, new Date()];
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(addSql, dataSql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    deleteNotice: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var sql = "DELETE FROM t_notice WHERE id = " + query.id;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(sql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    queryNoteAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = [];
        var query = common.filterQuery(keys, req.body, true)
        var querySql = "SELECT * FROM t_note" + query.where +" order by id desc" + query.limit;
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(querySql, function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            });
        });
    },
    queryZodiacAll: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var keys = ['downDate', 'startTime', 'endTime', 'examineDate'];
        if (req.body.downDate) {
            keys = ['downDate'];
        }
        var query = common.filterQuery(keys, req.body, true)
        query.where = query.where.replace('create_date', 'down_date');

        var querySql = "SELECT * FROM t_zodiac" + query.where +" order by id asc" + query.limit;
        var countSql = "SELECT count(1) FROM t_zodiac"+ query.where;
        // console.log(querySql, '===')
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
    examine: function(req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var list = req.body.list;
        var ids = [];
        for (var i = 0; i < list.length; i++) {
            ids.push(list[i].id);
            common.moveFile('zodiac/' + list[i].type, list[i].issue + '_' + list[i].img, 'examine'+ '/' + list[i].type);
        }
        var updateSql = 'update t_zodiac set examine_date=? WHERE id IN ('+ ids.join(',') +')';
        pool.getConnection(function (err, connection) {
            if (err) logger.error(err);
            connection.query(updateSql, [new Date()], function (err, result) {
                common.jsonWrite(res, err, result);
                connection.release();
            })
        })
    },
    editImg: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var query = req.body;
        var tmp = process.cwd() + '/public/tmp/';
        var mub = process.cwd() + '/public/examine/';
        fs.exists(tmp + query.img, function(exists) {
            if (exists) {
                try{
                    var source = fs.createReadStream(tmp + query.img);
                    var dest = fs.createWriteStream(mub + query.type + '/' + query.oldImg);
                    source.pipe(dest);
                    source.on('end', function() { 
                        fs.unlinkSync(tmp + query.img);
                        res.json({code: 0, message: '修改成功'});
                    });
                }catch (e){
                    res.json({code: 1, message: '迁移文件出错'});
                }
            } else {
                res.json({code: 1, message: '文件不存在'});
            }
        })
    },
    downloadImg: function (req, res, next) {
        if (this.getLoginInfo(req, res)) return;
        var list = req.body.list;
        var total = list.length - 1;
        res.json({code: 0, message: '下载中'});
        if (list.length) {
            getImg(total);
        }

        function getImg(num) {
            if (num < 0) return;
            // console.log(num, '============')
            var fileSpt = list[num].img.split('/');
            var imgPath = path.join(dirPath + '/' + fileSpt[0], fileSpt[2]);
            if (!fs.existsSync(imgPath)) {
                var url = "https://mgtk2.suyuan1688.com/" + fileSpt[0] + '/' + fileSpt[1] + '/' + fileSpt[2].replace(fileSpt[1]+'_', '');
                // var url = 'https://tk2.suyuan1688.com/col/225/amsbx.jpg'//'https://mgtk2.suyuan1688.com/col/225/amsbx.jpg';
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
                request(options, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        fs.writeFile(imgPath, body, function(err) {
                            if (!err) {
                                var updateSql = 'update t_zodiac set down_date=?, issue=? where id=?';
                                pool.getConnection(function (err, connection) {
                                    if (err) logger.error(err);
                                    connection.query(updateSql, [new Date(), fileSpt[1], list[num].id], function (err, result) {
                                        connection.release();
                                        getImg(num - 1);
                                    })
                                })
                            } else {
                                getImg(num - 1);
                            }
                        });
                    } else {
                        logger.error('手动抓取图片失败' + error);
                        getImg(num - 1);
                    }
                })
            } else {
                getImg(num - 1);
            }
        }
        
    },
    getLoginInfo(req, res) {
        // return false
        if (!req.session.loginUser || req.session.loginUser.userName !== 'amcpadmin') {
            res.json({code: 3301, message: '请重新登录'});
            return true
        } else {
            return false
        }
    }
}