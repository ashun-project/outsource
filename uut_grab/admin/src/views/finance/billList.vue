<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
           <el-form-item label="日期">
                <el-date-picker
                    v-model="pickerDate"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    :clearable="false"
                    @change="pickerChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="用户ID">
                <el-input v-model="queryData.user_id" clearable placeholder="id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="$router.push('/userList')">返回</el-button>
            </el-form-item>
        </el-form>

        <div class="tongji">
            <!-- <div>
                当前用户ID：
                <span>{{user.id}}</span>
            </div> -->
            <div>
                冻结订单数：
                <span>{{frozenList.length}}&nbsp;条</span>
            </div>
            <div>
                冻结订单金额：
                <span>{{frozenAmount}}&nbsp;元</span>
            </div>
        </div>

        <el-table v-loading="loading" :data="tableData" border :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%">
            <el-table-column prop="create_date" sortable align="center" label="日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="user_id" align="center" label="用户ID"></el-table-column> -->
            <el-table-column prop="amount" align="center" label="变动金额">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.withdraw" size="small" type="danger">-&nbsp;{{scope.row.amount}}</el-tag>
                    <el-tag v-else size="small" type="success">+&nbsp;{{scope.row.amount}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作方式" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.type | getType }}</span>
                    <div v-if="scope.row.type == 0" style="color:red;font-size:12px">
                        （
                        <span v-if="scope.row.as_type == 1">
                            {{ scope.row.withdraw ? '人工取款' : '人工存款' }}
                        </span>
                        <span v-else-if="scope.row.as_type == 2">优惠彩金</span>
                        <span v-else>其他</span>
                        ）
                    </div>
                </template>
            </el-table-column>
             <el-table-column prop="typeTxt" align="center" label="操作类型"></el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            tableData: [],
            pickerDate: this.$common.formatDate(),
            currentDate: this.$common.formatDate(),
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            queryData: {
                startTime: '',
                endTime: '',
                status: 2,
                user_id: '',
                page: 1,
                pageSize: 100000
            },
            user: {},
            frozenList: [],
            frozenAmount: 0
       }
    },
    filters: {
        getType(type) {
            // debugger
            var typelist = ['系统操作', '银行卡', '微信', '支付宝', '平台结算']
            return typelist[type]
        }
    },
    created() {
        
    },
    methods: {
        pickerChange(value) {
            this.currentDate = this.$common.formatDate(value);
        },
        queryChange(val) {
            this.queryData.page = val;
            if (!this.queryData.user_id) {
                return
            }
            this.loading = true;
            this.$http.post('/admin/userList', {id: this.queryData.user_id}).then(response => {
                this.user = response.list[0] || {}
                this.getList();
            }).catch(() => {})
        },
        getRecharge(obj) {
            return new Promise((resolve, reject) => {
                this.$http.post('/admin/rechargeList', obj).then(response => {
                    // this.tableData = response.list;
                    var list = response.list.map(item => {
                        item.type = item.recharge_type;
                        item.typeTxt = '充值';
                        return item;
                    })
                    resolve(list)
                }).catch(() => {})
            })
        },
        getWithdraw(obj) {
            return new Promise((resolve, reject) => {
                this.$http.post('/admin/withdrawList', obj).then(response => {
                    // this.withdrawList = response.list;
                    var list = response.list.map(item => {
                        item.type = item.withdraw_type;
                        item.withdraw = true;
                        item.typeTxt = '提现';
                        return item;
                    })
                    resolve(list)
                }).catch(() => {})
            })
        },
        getOrderList(obj) {
            var vm = this;
            return new Promise((resolve, reject) => {
                this.$http.post('/admin/orderList', obj).then(response => {
                    var list = response.list.map(item => {
                        if (item.status == 1) {
                            vm.frozenList.push(item);
                            vm.frozenAmount += item.price * item.item;
                        }
                        item.type = 4;
                        item.amount = item.earn;
                        item.typeTxt = '抢单收益';
                        return item;
                    })
                    resolve(list)
                })
            })
        },
        getCommission() {
            var obj = {date: this.currentDate.replace(/-/g, ''), user: this.user};
            return new Promise((resolve, reject) => {
                this.$http.post('/admin/commissionList', obj).then(response => {
                    var data = response.result.list;
                    var list = data.map(item => {
                        item.type = 4;
                        item.typeTxt = item.level + '级代理佣金';
                        return item;
                    })
                    resolve(list)
                })
            })
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            obj.startTime = this.currentDate + ' 00:00:00';
            obj.endTime = this.currentDate + ' 23:59:59';
            Promise.all([this.getRecharge(obj), this.getWithdraw(obj), this.getOrderList(obj), this.getCommission()]).then((result) => {
                var arr = [];   
                for (var i = 0; i < result.length; i++) {
                    arr = arr.concat(result[i]);
                }
                arr.sort(function(a, b){
                    return a.create_date < b.create_date ? 1 : -1; // 这里改为大于号
                });

                this.tableData = arr;
                this.loading = false;
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    
}
</script>

<style scoped>
    .tongji{
        padding: 10px;
        display: flex;
    }
    .tongji > div{
        margin-right: 20px;
    }
    .tongji span{
        color: #f56b6c;
        font-weight: 600;
    }
</style>