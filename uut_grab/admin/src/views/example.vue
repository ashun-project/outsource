<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="名称">
                <el-input v-model="queryData.depositor" clearable placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model="queryData.amount" clearable placeholder="金额"></el-input>
            </el-form-item>
            <el-form-item label="时间">
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
            <el-form-item label="状态">
                <el-select v-model="queryData.status" clearable placeholder="请选择">
                    <el-option
                    v-for="item in optionsStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="create_date" align="center" label="日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="depositor" align="center" label="充值人姓名"></el-table-column>
            <el-table-column prop="amount" align="center" label="充值金额"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 1" size="small" type="info">审核中...</el-tag>
                    <el-tag v-if="scope.row.status === 2" size="small" type="success">充值成功</el-tag>
                    <el-tag v-if="scope.row.status === 3" size="small" type="danger">充值失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="充值类型" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.recharge_type | getType }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
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
        </el-dialog>
    </div>
</template>

<script>
var optionsStatus = [
    {label: '审核中', value: 1},
    {label: '充值成功', value: 2},
    {label: '充值失败', value: 3}
]
export default {
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            pickerDate: '',
            optionsStatus: optionsStatus,
            dialogFormVisible: false,
            dialogForm: {},
            queryData: {
                depositor: '',
                amount: '',
                startTime: '',
                endTime: '',
                page: 1,
                status: '',
                pageSize: 10
            }
       }
    },
    filters: {
        getType(type) {
            // debugger
            var typelist = ['系统充值', '银行卡充值', '微信充值', '支付宝充值']
            return typelist[type]
        }
    },
    created() {
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
        updtateRow() {
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            this.$http.post('/admin/rechargeUpdate', this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            obj.amount = Number(obj.amount);
            this.loading = true;
            this.$http.post('/admin/rechargeList', obj).then(response => {
                this.tableData = response.list;
                this.total = response.total;
                this.loading = false;
            }).catch(() => {})
        }
    }
    
}
</script>

<style scoped>

</style>