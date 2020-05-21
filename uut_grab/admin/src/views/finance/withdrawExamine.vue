<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="名称">
                <el-input v-model="queryData.payee" clearable placeholder="提现人姓名"></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model="queryData.amount" clearable placeholder="提现金额"></el-input>
            </el-form-item>
            <el-form-item label="用户ID">
                <el-input v-model="queryData.user_id" clearable placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="卡号">
                <el-input v-model="queryData.bank_no" clearable placeholder="银行卡号" style="width:220px"></el-input>
            </el-form-item>
            <el-form-item label="提现时间">
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
            <el-table-column prop="create_date" align="center" label="日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="user_id" align="center" label="用户ID"></el-table-column>
            <el-table-column prop="parent_top" align="center" label="帐号类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.parent_top === '888888'" type="danger">测试帐号</el-tag>
                    <el-tag v-else type="success">真实帐号</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="payee" align="center" label="提现人姓名"></el-table-column>
            <el-table-column label="提现类型" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.withdraw_type | getType }}</span>
                    <p v-if="scope.row.withdraw_type == 0" style="color:red;font-size:12px">
                        （
                        <span v-if="scope.row.as_type == 1">人工取款</span>
                        <span v-else>其他</span>
                        ）
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="bank_name" align="center" label="银行名称"></el-table-column>
            <el-table-column prop="bank_dot" align="center" label="开户网点"></el-table-column>
            <el-table-column prop="bank_no" align="center" label="提现帐号"></el-table-column>
            <el-table-column prop="amount" align="center" label="提现金额"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 1" size="small" type="info">审核中...</el-tag>
                    <el-tag v-if="scope.row.status === 2" size="small" type="success">提现成功</el-tag>
                    <el-tag v-if="scope.row.status === 3" size="small" type="danger">提现失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updtateRow(scope.row)" >审核</el-button>
                    <!-- <el-button @click="deleteRow(scope.row)" type="text" size="small">
                        <span style="color:#f94747">修改</span>
                    </el-button> -->
                    <!-- <el-button type="text" size="small">编辑</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog title="提现审核" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="姓名:">
                    <span>{{ dialogForm.payee }}</span>
                </el-form-item>
                <el-form-item label="审核:">
                    <el-select v-model="dialogForm.status" clearable placeholder="请选择">
                        <el-option
                            v-for="item in optionsStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="dialogForm.remark" type="textarea" rows="3" clearable placeholder="提现人姓名"></el-input>
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
    {label: '成功', value: 2},
    {label: '失败', value: 3}
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
            dialogForm: {
                payee: '',
                id: '',
                remark: '',
                amount: '',
                status: 2,
                userId: '',
            },
            queryData: {
                payee: '',
                amount: '',
                startTime: '',
                endTime: '',
                bank_no: '',
                user_id: '',
                page: 1,
                status: 1,
                pageSize: 10
            }
       }
    },
    filters: {
        getType(type) {
            // debugger
            var typelist = ['系统提现', '银行卡提现', '微信提现', '支付宝提现']
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
        updtateRow(row) {
            this.dialogForm.id = row.id;
            this.dialogForm.payee = row.payee;
            this.dialogForm.amount = row.amount;
            this.dialogForm.userId = row.user_id;
            this.dialogForm.status = 2;
            this.dialogForm.remark = '';
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            if(this.dialogForm.status == 3 && !this.dialogForm.remark) {
                this.$Message.warning('请填写备注！');
                return
            }
            this.$http.post('/admin/withdrawUpdate', this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            obj.amount = Number(obj.amount);
            this.loading = true;
            this.$http.post('/admin/withdrawList', obj).then(response => {
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