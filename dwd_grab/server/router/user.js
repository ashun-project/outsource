var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../conf/db');
var common = require('../conf/common');
var poolUser = mysql.createPool(db.mysql);
var request = require('request');
var encryption = require('../conf/md5');
var requestIp = require('request-ip');

// 退出登录
router.post('/grab/signout', function (req, res, next) {
    req.session.loginUser = null;
    res.clearCookie('testapp');
    res.json({message:'退出成功', code: 0});
});

router.post('/grab/login', function (req, res, next) {
    // 获取所有列表
    var phone = req.body.phone;
    var password = req.body.password;
    var sql = "SELECT * FROM user WHERE phone = '" + phone +"'";
    if (!(/^1[23456789]\d{9}$/.test(phone))) {
        res.json({message: '手机号不正确', code: 1});
        return
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            if (!result.length) {
                res.json({message: '用户不存在', code: 1});
            } else if (result[0].password !== password) {
                res.json({message: '密码错误', code: 1});
            } else if (result[0].status === 1) {
                res.json({message: '帐号已被禁用', code: 1});
            } else {
                req.session.loginUser = {userName: phone, code: 0};
                res.json({message: '登入成功', code: 0, userInfo: result[0]});
            }
            conn.release();
        })
    })
});

router.post('/grab/info', function (req, res, next) {
    var user = req.session.loginUser;
    if (user && user.userName) {
        res.json(user);
    } else {
        res.json({message: '未登录', code: 3301});
    }
});

// 注册
// CREATE TABLE `grab`.`user` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `phone` VARCHAR(45) NULL,
//     `password` VARCHAR(45) NULL,
//     `invite` VARCHAR(45) NULL, 邀请吗
//     `level` INT NULL,
//     `amount` DECIMAL(20,2) NULL,  金额
//     `create_date` DATETIME NULL,
//     `parent_id` INT NULL,
//     `parent_top` INT NULL,     顶级id
//     PRIMARY KEY (`id`));
//   }
router.post('/grab/register', function (req, res, next) {
    var obj = req.body;
    var sqlInfo = "INSERT INTO user(phone,password,invite,level,create_date,parent_id,parent_top,ip) VALUES ?";
    var sqlVP = "SELECT * FROM user WHERE binary invite = '" + obj.invite +"' or phone = '" + obj.phone +"'";

    if (!obj.phone || !obj.password || !obj.invite || !obj.code) {
        res.json({message: '非法数据', code: 1});
        return
    }
    getVerifyCode(obj.phone).then(verifyCode => {
        if (verifyCode.code !== obj.code) {
            res.json({message: '验证码不正确', code: 1});
            return
        }
        if (verifyCode.timer > 20 * 60 * 1000) {
            res.json({message: '验证码已过期', code: 1});
            return
        }
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL refresh-register==> " + err);
            // 查看手机号码是否存在，验证码是否有效
            conn.query(sqlVP, function (errP,vpResult) {
                var dbs = vpResult || [];
                var rpPhone = dbs.filter(item => item.phone === obj.phone)[0];
                var parent = dbs.filter(item => item.invite === obj.invite)[0];
                if (rpPhone || !parent) {
                    var errTxt = rpPhone ? '手机号码已存在' : '邀请码无效';
                    res.json({message: errTxt, code: 1});
                    conn.release();
                    return
                } else {
                    common.inviteCode().then(newInvite => { 
                        var IP = requestIp.getClientIp(req);
                        var infoData = [[
                            obj.phone,
                            obj.password,
                            newInvite,
                            parent.level + 1,
                            new Date(),
                            parent.id,
                            parent.parent_top,
                            (IP || '').replace(/[^\d^\.]+/g,'')
                        ]];
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
    }).catch(function () {
        res.json({message: '添加失败', code: 0 });
    })
});

// 找回密码
router.post('/grab/retrieve', function (req, res) {
    var obj = req.body;
    var sql = "update user set password = '"+ obj.password +"' where phone = '"+ obj.phone + "'";
    if (!obj.phone || !obj.password || !obj.code) {
        res.json({message: '非法数据', code: 1});
        return
    }
    getVerifyCode(obj.phone).then(verifyCode => {
        if (verifyCode.code !== obj.code) {
            res.json({message: '验证码不正确', code: 1});
            return
        }
        if (verifyCode.timer > 20 * 60 * 1000) {
            res.json({message: '验证码已过期', code: 1});
            return
        }
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL retrieve==> " + err);
            // 查看手机号码是否存在，验证码是否有效
            conn.query(sql, function (errP,vpResult) {
                if (err) {
                    console.log(err)
                    res.json({message: '数据插入失败', code: 1});
                } else {
                    res.json({message: '修改成功', code: 0});
                }
                conn.release();
            })
        })
    }).catch(function () {
        res.json({message: '修改失败', code: 0 });
    })
});

// 发送验证码
router.post('/grab/verifyCode', function (req, res, next) {
    var code = '';
    for (var i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10);
    }
    var phone = req.body.phone;
    var account = '18804183683';
    var password = '4BDB99A86CF1095C4333899EE068A8A2';
    var cont = encodeURI('【DWD点我达】您的验证码为' + code + ', 验证码20分钟内有效。')
    var url = 'http://api.smsbao.com/sms?u='+ account +'&p='+ password +'&m='+ phone +'&c=' + cont;

    if (!(/^1[23456789]\d{9}$/.test(phone))) {
        res.json({message: '手机号不正确', code: 1});
        return
    }
    request(url, function (error, response, body) {
        var obj = {
            '-1': '参数不全',
            '-2': '服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！',
            '30': '错误密码',
            '40': '账号不存在',
            '41': '余额不足',
            '43': 'IP地址限制',
            '50': '内容含有敏感词',
            '51': '手机号码不正确'
        }
        if (response.body == 0) {
            var sqlInfo = "INSERT INTO verify_code(phone,code,timer) VALUES ?";
            var infoData = [[phone, code, new Date().getTime()]];
            poolUser.getConnection(function (err, conn) {
                conn.query(sqlInfo, [infoData], function (err, result) {
                    if (err) {
                        res.json({message: '插入验证码失败', code: 1});
                    } else {
                        res.json({message: '发送成功', code: 0});
                    }
                    conn.release();
                })
            })
        } else {
            res.json({message: obj[response.body + ''], code: 1});
        }
    })
})

// 查询用户信息
router.post('/grab/queryUser', function (req, res, next) {
    // 获取所有列表
    var sql = "SELECT * FROM user WHERE id = " + req.body.id;
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr,result) {
            result = result || []
            res.json({message: '查询成功', code: 0, userInfo: result[0] || ''});
            conn.release();
        })
    })
});

// 更改手机号
router.post('/grab/updatePhone', function (req, res, next) {
    // 获取所有列表
    var obj = req.body;
    var sql = "update user set phone = '"+ obj.phone +"' where id = '"+ obj.id + "'";
    var sqlP = "select count(1) from user WHERE phone = '" + obj.phone +"'";
    getVerifyCode(obj.phone).then(verifyCode => {
        if (verifyCode.code !== obj.code) {
            res.json({message: '验证码不正确', code: 1});
            return
        }
        if (verifyCode.timer > 20 * 60 * 1000) {
            res.json({message: '验证码已过期', code: 1});
            return
        }
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL updatePhone==> " + err);
            conn.query(sqlP, function (errr, row) {
                if (errr) {
                    res.json({message: '查询数据出错', code: 1});
                    conn.release();
                    return
                }
                var total = row[0]['count(1)'];
                if (total > 0) {
                    res.json({message: '手机号码已存在', code: 1});
                    conn.release();
                } else {
                    conn.query(sql, function (errr, result) {
                        res.json({message: '更改成功', code: 0 });
                        conn.release();
                    })
                }
            })
        })
    }).catch(function () {
        res.json({message: '更改失败', code: 0 });
    })
});

// 修改登录密码
router.post('/grab/updatePassword', function (req, res, next) {
    var obj = req.body;
    var sql = "update user set password = '"+ obj.password +"' where id = "+ obj.id;
    if (obj.oldPassword !== obj.dataPassword) {
        res.json({message: '旧密码错误', code: 1 });
        return
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr, result) {
            res.json({message: '更改成功', code: 0 });
            conn.release();
        })
    })
});

// 设置资金密码
router.post('/grab/capitalPassword', function (req, res, next) {
    var obj = req.body;
    var jiami = encryption.md5(obj.capital + "grab");
    var sql = "update user set capital = '"+ jiami +"' where id = "+ obj.id;
    if (encryption.md5(obj.oldCapital + 'grab') !== obj.dataCapital && obj.dataCapital) {
        res.json({message: '旧密码错误', code: 1 });
        return
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (errr, result) {
            res.json({message: '更改成功', code: 0, capital: jiami });
            conn.release();
        })
    })
});

function getVerifyCode(phone) {
    var sqlVnvite = "SELECT * FROM verify_code WHERE phone = '" + phone +"' order by timer desc";
    return new Promise(function (resolve, reject){ 
        poolUser.getConnection(function (err, conn) {
            if (err) {
                reject()
                return
            }
            conn.query(sqlVnvite, function (errr, result) {
                if (errr) {
                    conn.release();
                    reject()
                    return
                }
                var reObj = result[0] || {}
                var timer = new Date().getTime();
                reObj.timer = timer - reObj.timer;
                conn.release();
                resolve(reObj)
            })
        })
    })
}


module.exports = router;