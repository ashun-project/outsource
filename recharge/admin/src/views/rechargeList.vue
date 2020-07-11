<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item v-if="account == 'admin'" label="充值人">
                <el-input v-model="queryData.account" style="width:120px" clearable placeholder="充值人"></el-input>
            </el-form-item>
            <el-form-item label="充值金额">
                <el-input v-model="queryData.amount" style="width:120px" clearable placeholder="金额"></el-input>
            </el-form-item>
            <el-form-item label="注册时间">
                <el-date-picker
                v-model="pickerDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                :default-time="['00:00:00','23:59:59']"
                @change="pickerChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="create_date" align="center" label="充值日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="account" align="center" label="充值人"></el-table-column>
            <el-table-column prop="type" align="center" label="充值方式"></el-table-column>
            <el-table-column prop="phone" align="center" label="充值号码"></el-table-column>
            <el-table-column prop="amount" align="center" label="充值金额"></el-table-column>
            <el-table-column prop="outorder_no" align="center" label="商户号"></el-table-column>
            <el-table-column prop="order_no" align="center" label="订单号"></el-table-column>
            <el-table-column prop="status" align="center" label="充值状态">
                 <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" size="small" type="info">充值中...</el-tag>
                    <el-tag v-else-if="scope.row.status === 1" size="small" type="success">充值成功</el-tag>
                    <el-tag v-else size="small" type="danger">充值失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
            <!-- <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="updtateRow(scope.row, '1')" >加减款</el-button>
                    <el-button type="warning" style="margin-top:10px;margin-left:0" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            pickerDate: '',
            account: '',
            queryData: {
                startTime: '',
                endTime: '',
                account: '',
                amount: '',
                page: 1,
                pageSize: 10
            }
       }
    },
    created() {
        this.account = localStorage.getItem('account');
        if (this.account && this.account !== 'admin') {
            this.queryData.account = this.account;
        }
        this.getList();
    },
    methods: {
        pickerChange(value) {
            this.queryData.startTime = value ? this.$common.formatDate(value[0], 2) : '';
            this.queryData.endTime = value ? this.$common.formatDate(value[1], 2) : '';
        },
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            obj.amout = Number(obj.amount);
            this.$http.post('/admin/orderList', obj).then(response => {
                var data = response.data;
                this.tableData = data.list;
                this.total = data.total;
                this.loading = false;
                this.checkStatus(data.list);
            }).catch(() => {})
        },
        checkStatus(rows) {
            var list = rows.filter(item => item.status === 0);
            var vm = this;
            for (var i = 0; i < list.length; i++) {
                var url = '/jisuapi/mobilerecharge/orderdetail?appkey=5547e939f267071f&orderno='+ list[i].order_no +'&outorderno='
                this.$http.get(url).then(response => {
                    var result = response.result;
                    if (result.rechargestatus !== 0) {
                        rows.forEach((item, idx) => {
                            if (item.order_no === result.orderno) {
                                var obj = Object.assign({}, item);
                                obj.status = result.rechargestatus;
                                vm.$set(vm.tableData, idx, obj);
                                vm.$http.post('/admin/updateOrder', obj).then(response => {})
                            }
                        })
                    }
                })
            }
        }
    }
    
}
</script>

<style scoped>

</style>