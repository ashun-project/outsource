var logger = require('../common/logger');
var fs = require('fs');

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, err, ret) {
    // console.log(ret, '====')
    var obj = { code: 0, message: '操作成功', data: ret };
    if (err) {
        logger.error(err);
        obj.code = 1;
        obj.message = '操作失败';
    }
    res.json(obj);
};
var filterQuery = function (keys, value, limit) {
    var date = false;
    var arr = [];
    var queryResult = {where: '', limit: ''};

    for (var i = 0; i < keys.length; i++) {
        if (value[keys[i]]) {
            if (keys[i] == 'startTime' || keys[i] == 'endTime') {
                date =  true;
            } else if (keys[i] == 'downDate') {
                arr.push("down_date < '" + value[keys[i]] + "' OR down_date IS NULL");
            } else if (keys[i] == 'examineDate') {
                arr.push("examine_date > '" + value[keys[i]] + "'");
            } else if (keys[i] == 'search') {
                arr.push("title like '%" + value[keys[i]] + "%'");
            } else {
                if (typeof value[keys[i]] == 'number') {
                    arr.push(keys[i] + " = " + value[keys[i]]);
                } else {
                    arr.push(keys[i] + " = '" + value[keys[i]] + "'");
                }
            }
        } else if (keys[i] == 'examineDate') {
            arr.push("(examine_date < '" + value.startTime + "' OR examine_date IS NULL)");
        }
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
}
// 迁移临时文件
var moveFile = function (type, img, tmpType) {
    var tmp = process.cwd() + '/public/' + (tmpType || 'tmp') + '/';
    var mub = process.cwd() + '/public/' + type + '/';
    fs.exists(tmp + img, function(exists) {
        if (exists) {
            try{
                var source = fs.createReadStream(tmp + img);
                var dest = fs.createWriteStream(mub + img);
                source.pipe(dest);
                source.on('end', function() { fs.unlinkSync(tmp + img);});   //delete
            }catch (e){
                console.log('迁移文件出错')
            }
        } else {
            console.log('文件不存在1')
        }
    })
}
var deleteImg = function (path) {
    var ph = process.cwd() + '/public' + path;
    fs.exists(ph, function(exists) {
        if (exists) {
            try {
                fs.unlinkSync(ph);
            } catch (e) {
                console.log('迁移文件出错')
            }
            
        } else {
            console.log('文件不存在2')
        }
    })
    
}

module.exports = {
    jsonWrite: jsonWrite,
    filterQuery: filterQuery,
    moveFile: moveFile,
    deleteImg: deleteImg
}
