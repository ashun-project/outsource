var mysql = require('mysql');
var db = require('./db');
var poolUser = mysql.createPool(db.mysql);
var fs = require('fs');


module.exports = {
    inviteCode: function() {
        return new Promise(function (resolve, reject){
            chaxun();
            function chaxun() {
                var arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
                        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
                        0,1,2,3,4,5,6,7,8,9];
                var rand1 = Math.floor((Math.random()*62));
                var rand2 = Math.floor((Math.random()*62));
                var rand3 = Math.floor((Math.random()*62));
                var rand4 = Math.floor((Math.random()*62));
                var rand5 = Math.floor((Math.random()*62));
                var rand6 = Math.floor((Math.random()*62));
                var result = ('' + arr[rand1] + arr[rand2] + arr[rand3] + arr[rand4] + arr[rand5] + arr[rand6]);
                // console.log(result, '=====')
                var checkIn = "SELECT * FROM user WHERE binary invite = '" + result +"'";
                poolUser.getConnection(function (err, conn) {
                    if (err) console.log("POOL refresh-register==> " + err);
                    conn.query(checkIn, function (err, chResult) {
                        if (err) {
                            console.log(err, '创建邀请码失败')
                            conn.release();
                            reject();
                        }
                        if (chResult && !chResult.length) {
                            resolve(result);
                            conn.release();
                        } else {
                            conn.release();
                            chaxun();
                        }
                    })
                })
            }
        })
    },
    filterQuery(keys, value, limit) {
        var date = false;
        var arr = [];
        var queryResult = {where: '', limit: ''};
        for (var i = 0; i < keys.length; i++) {
            if (value[keys[i]]) {
                if (keys[i] == 'startTime' || keys[i] == 'endTime') {
                    date =  true;
                } else if (keys[i] == 'minAmount' || keys[i] == 'maxAmount') {
                    if (keys[i] == 'minAmount') {
                        arr.push("amount <= " + value[keys[i]]);
                    } else {
                        arr.push("amount > " + value[keys[i]]);
                    }
                } else {
                    if (typeof value[keys[i]] == 'number') {
                        arr.push(keys[i] + " = " + value[keys[i]]);
                    } else {
                        arr.push(keys[i] + " = '" + value[keys[i]] + "'");
                    }
                }
            }
        }
        if (value.filterTest) {
            arr.push("parent_top != '888888'");
        }
        if (date) {
            arr.push("create_date between '"+ value.startTime +"' and '"+ value.endTime +"'");
        }
        if (arr.length) {
            queryResult.where = " where " + arr.join(' and ');
        }
        if (limit) {
            var pageSize = value.pageSize || 10;
            var page = value.page || 1;
            var limitNum = (page - 1) * pageSize;
            queryResult.limit = " limit " + (limitNum + "," + pageSize)
        }
        return queryResult;
    },
    // 迁移临时文件
    moveFile: function (type, img) {
        fs.exists('./public/tmp/' + img, function(exists) {
            if (exists) {
                try{
                    var source = fs.createReadStream('./public/tmp/' + img);
                    var dest = fs.createWriteStream('./public/img/' + type + '/' + img);
                    source.pipe(dest);
                    source.on('end', function() { fs.unlinkSync('./public/tmp/' + img);});   //delete
                }catch (e){
                    console.log('迁移文件出错')
                }
            } else {
                console.log('文件不存在')
            }
        })
    },
    deleteImg(path) {
        fs.exists('./public/img/' + path, function(exists) {
            if (exists) {
                try {
                    fs.unlinkSync('./public/img/' + path);
                } catch (e) {
                    console.log('迁移文件出错')
                }
                
            } else {
                console.log('文件不存在')
            }
        })
        
    }
}