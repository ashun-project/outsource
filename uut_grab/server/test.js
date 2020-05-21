var mysql = require('mysql');
var poolUser = mysql.createPool({
    host: '45.141.69.124',
    user: 'root',
    password: 'ashun666',
    database: 'agent'
});

function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};

function getFormatDate(time, sf) {
    var date = time ? new Date(time) : new Date();
    var str = '';
    var dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate()];
    if (sf) {
        dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate(), ' ', date.getHours(), ':', date.getMinutes()];
    }
    dateArr.forEach(item => {
        if (typeof item === 'number' && item < 10) item = '0' + item;
        str += item;
    });
    return str;
}

//  定时任务 -----------------------------
function setTiming () {
    var date = getFormatDate();
    queryData(date).then(function (result) {
        // 插入异常数据
        if (!result.agent || !result.commission || !result.recharge || !result.profit) {
            getErr(result);
            scheduleCronstyle();
            return;
        }
        
        // 计算收益
        var agentList = result.agent;
        for (var i = 0; i < agentList.length; i++) {
            // 去除今日充值的总额
            var recharge = result.recharge.filter(item => item.agent_id == agentList[i].id);
            var rechargeTotal = 0;
            for (var k = 0; k < recharge.length; k++) {
                rechargeTotal += recharge[k].recharge_amount
            }
            var benjin = agentList[i].capital - rechargeTotal;
            agentList[i].todayProfit = (benjin < 0 ? 0 : benjin) / 100 * (result.profit[0] ? result.profit[0].scale : 10);
        }

        // 计算佣金
        var filterAgent = agentList.filter(item => item.capital > 0);
        var newNote = [];
        var commissionData = result.commission[0] || {comm_one: 0,comm_two: 0,comm_three: 0,comm_four: 0,comm_five: 0,comm_other:0};
        for (var j = 0; j < agentList.length; j++) {
            var todayCommission = getChilds(agentList[j], filterAgent, commissionData);
            newNote.push([agentList[j].id, agentList[j].account, date, agentList[j].todayProfit, todayCommission]);
        }
        // console.log(newNote, '=========')
        // var sqlInfo = "INSERT INTO history_profit_list(agent_id, agent_account, create_date, profit, commission) VALUES ?";
        // poolUser.getConnection(function (err, conn) {
        //     if (err) console.log("POOL refresh-register==> " + err);
        //     conn.query(sqlInfo, [newNote], function (err, result) {
        //         conn.release();
        //     });
        // });
        // // 修改代理表
        // updateAgent(newNote, 0);
    })
}
function updateAgent(arr, idx) {
    if (arr.length === idx) return;
    var sqlAgent = 'update agent_list set profit = profit + '+ (arr[idx][3] + arr[idx][4]) +' where id = '+ arr[idx][0];
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL refresh-agent-list==> " + err);
        conn.query(sqlAgent, function (err, result) {
            // console.log(err, arr[idx][0])
            conn.release();
            if (!err) idx += 1;
            updateAgent(arr, idx);
        });
    });
}
function getChilds(current, filterAgent, commission) {
    var level = current.level;
    var totalComm = 0;
    var slefChilds = [];
    var childs = filterAgent.filter(item => {
        return (item.ascription_account == current.ascription_account) && (current.level < item.level)
    });
    getSlefChild([current])
    function getSlefChild(parents) {
        var arr = []
        for (var p = 0; p  < parents.length; p++) {
            for (var c = 0; c < childs.length; c++) {
                if (parents[p].id === childs[c].parent_id) {
                    arr.push(childs[c])
                    slefChilds.push(childs[c])
                }
            }
        }
        if (arr.length) {
            getSlefChild(arr)
        }
    }
    for (var g = 0; g < slefChilds.length; g++) {
        if ((level + 1) == slefChilds[g].level) {
            totalComm += slefChilds[g].todayProfit / 100 * commission.comm_one;
        } else if ((level + 2) == slefChilds[g].level) {
            totalComm += slefChilds[g].todayProfit / 100 * commission.comm_two;
        } else if ((level + 3) == slefChilds[g].level) {
            totalComm += slefChilds[g].todayProfit / 100 * commission.comm_three;
        } else if ((level + 4) == slefChilds[g].level) {
            totalComm += slefChilds[g].todayProfit / 100 * commission.comm_four;
        } else if ((level + 5) == slefChilds[g].level) {
            totalComm += slefChilds[g].todayProfit / 100 * commission.comm_five;
        } else {
            totalComm += slefChilds[g].todayProfit / 100 * commission.comm_other
        }
    }
    return totalComm;
}

function queryData(date) {
    var sqlAgent = 'SELECT * FROM agent_list order by level desc';
    var sqlCommission = 'SELECT * FROM commission order by id desc limit 1';
    var sqlProfit = 'SELECT * FROM profit_list where create_date = "'+ date +'"';
    var sqlRecharge = 'SELECT * FROM recharge_list where status = 1 and verify_date = "' + date +'"';
    return new Promise((resolve, reject) => {
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL refresh-register==> " + err);
            conn.query(sqlCommission, function (err, commission) {
                conn.query(sqlProfit, function (errP, profit) {
                    conn.query(sqlRecharge, function (errRe, recharge) {
                        conn.query(sqlAgent, function (err, agent) {
                            resolve({agent: agent, commission: commission, recharge: recharge, profit: profit});
                            conn.release();
                        });
                    });
                });
            });
            
        });
    })
}
setTiming();
