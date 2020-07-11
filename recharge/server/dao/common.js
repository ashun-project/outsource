var logger = require('../common/logger');

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

module.exports = {
    jsonWrite: jsonWrite,
    filterQuery: filterQuery
}
