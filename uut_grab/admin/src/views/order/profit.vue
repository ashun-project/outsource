<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="用户帐号">
                <el-input v-model="queryData.phone" clearable placeholder="手机号"></el-input>
            </el-form-item>
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
            <el-form-item>
                <el-button type="primary" @click="querySearch(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="date" align="center" label="日期"></el-table-column>
            <el-table-column prop="phone" align="center" label="用户帐号"></el-table-column>
            <el-table-column prop="amount" align="center" label="当前金额"></el-table-column>
            <el-table-column prop="todayOrders" align="center" label="总抢单数">
                <template slot-scope="scope">
                    <span>{{ scope.row.todayOrders.length }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="todayOrdersSuccess" align="center" label="成功数">
                <template slot-scope="scope">
                    <span>{{ scope.row.todayOrdersSuccess.length }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="todayOrderFrozen" align="center" label="冻结数">
                <template slot-scope="scope">
                    <span>{{ scope.row.todayOrderFrozen.length }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="todayOrderFrozen" align="center" label="抢单总收益">
                <template slot-scope="scope">
                    <span>{{ getStatistics(scope.row.todayOrdersSuccess) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="commissin" align="center" label="总佣金">
                <template slot-scope="scope">
                    <span>{{ scope.row.commissin.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="level1" align="center" label="一级代理">
                <template slot-scope="scope">
                    <span>{{ scope.row.level1.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="level2" align="center" label="二级代理">
                <template slot-scope="scope">
                    <span>{{ scope.row.level2.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="level3" align="center" label="三级代理">
                <template slot-scope="scope">
                    <span>{{ scope.row.level3.toFixed(2) }}</span>
                </template>
            </el-table-column>
            
            <!-- <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="pageChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <!-- <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="活动名称:">
                    <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域:">
                    <el-select v-model="dialogForm.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateConfirm">确 定</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            total: 0,
            loading: true,
            tableData: [],
            orderList: [],
            userList: [],
            pickerDate: this.$common.formatDate(),
            queryData: {
                currentDate: this.$common.formatDate(),
                phone: '',
                page: 1,
                pageSize: 10000//没有用到
            },
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
            dialogFormVisible: false,
            dialogForm: {}
       }
    },
    filters: {

    },
    created() {
        this.getOrderList();
    },
    methods: {
        pickerChange(value) {
            this.queryData.currentDate = this.$common.formatDate(value);
        },
        // 搜索
        querySearch(val) {
            this.queryData.page = 1;
            this.getOrderList();
        },
        // 分页
        pageChange(val) {
            this.queryData.page = val;
            this.getTableData();
        },
        // // 对话框
        // updtateRow() {
        //     this.dialogFormVisible = true;
        // },
        // // 确定按钮
        // updateConfirm() {
        //     this.$http.post('/admin/rechargeUpdate', this.dialogForm).then(response => {
        //         this.$Message.success(response.message);
        //         this.dialogFormVisible = false;
        //         this.getUserList();
        //     }).catch(() => {})
        // },
        // 获取订单表
        getOrderList() {
            var obj = {
                startTime: this.queryData.currentDate + ' 00:00:00',
                endTime: this.queryData.currentDate + ' 23:59:59',
                pageSize: 1000000
            }
            this.loading = true;
            this.$http.post('/admin/orderList', obj).then(response => {
               this.orderList = response.list;
               this.getUserList();
            }).catch(() => {})
        },
        // 获取所有用户信息
        getUserList() {
            if (this.userList.length) {
                this.getTableData();
            } else {
                this.loading = true;
                this.$http.post('/admin/allUserList', {}).then(response => {
                    this.getTableData(response.list);
                }).catch(() => {})
            }
        },
        // 获取table表数据
        getTableData(list) {
            var page = this.queryData.page;
            var arr = [];
            this.loading = false;
            if (list) {
                this.userList = list;
            }
            if (this.queryData.phone) {
                arr = this.userList.filter(item => item.phone === this.queryData.phone);
                this.total = 1;
            } else {
                arr = this.userList.slice((page - 1) * 10, page * 10);
                this.total = this.userList.length;
            }
            var successOrderList = this.orderList.filter(item => item.status === 2);
            this.tableData = arr.map(item => {
                var uList = this.getUserFilter(this.userList, item.id);
                var result = this.getOrderFilter(uList, successOrderList, item.level);
                item.level1 = result.level1;
                item.level2 = result.level2;
                item.level3 = result.level3;
                item.commissin = result.total;
                item.todayOrders = this.orderList.filter(vv => vv.user_id === item.id);
                item.todayOrdersSuccess = successOrderList.filter(vv => vv.user_id === item.id);
                item.todayOrderFrozen = this.orderList.filter(vv => (vv.user_id === item.id && vv.status === 1));
                item.date = this.queryData.currentDate;
                return item;
            })
            // debugger
        },
        // 订单过滤
        getOrderFilter(uList, oList, level) {
            // console.log(uList, '===', oList)
            var list = [];
            var total = 0;
            var commissin = [0, 16, 8, 4];
            var level1 = 0;
            var level2 = 0;
            var level3 = 0;
            for (var i = 0; i < oList.length; i++) {
                var filterUser = uList.filter(item => item.id === oList[i].user_id);
                if (filterUser.length) {
                    oList[i].phone = filterUser[0].phone;
                    var profit = oList[i].earn / 100 * commissin[oList[i].user_level - level];
                    var newObj = {
                        level: oList[i].user_level - level,
                        phone: filterUser[0].phone,
                        amount: oList[i].price * oList[i].item,
                        earn: oList[i].earn,
                        profit: profit,
                    }
                    if (oList[i].user_level - level === 1) level1 += profit;
                    if (oList[i].user_level - level === 2) level2 += profit;
                    if (oList[i].user_level - level === 3) level3 += profit;
                    total += profit;
                    list.push(newObj);
                }
            }
            return {list: list, total: total, level1: level1, level2: level2, level3: level3}
        },
        // 下级过滤
        getUserFilter(list, parentId) {
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
        },
        // 统计金额
        getStatistics(list) {
            var total = 0;
            for (var i = 0; i < list.length; i++) {
                total += list[i].earn
            }
            return total.toFixed(2);
        }
    }
    
}
</script>

<style scoped>

</style>