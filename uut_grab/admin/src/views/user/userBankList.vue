<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="名称">
                <el-input v-model="queryData.payee" clearable placeholder="银行卡姓名"></el-input>
            </el-form-item>
            <el-form-item label="用户ID">
                <el-input v-model="queryData.user_id" clearable placeholder="ID"></el-input>
            </el-form-item>
            <el-form-item label="卡号">
                <el-input v-model="queryData.bank_no" clearable placeholder="银行卡号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="user_id" align="center" label="用户ID"></el-table-column>
            <el-table-column prop="payee" align="center" label="姓名"></el-table-column>
            <el-table-column prop="bank_name" align="center" label="银行卡名称"></el-table-column>
            <el-table-column prop="bank_no" align="center" label="卡号"></el-table-column>
            <el-table-column prop="bank_dot" align="center" label="开户网点"></el-table-column>
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
        <el-dialog title="修改银行卡" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="姓名:">
                    <el-input v-model="dialogForm.payee" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="银行卡名称:">
                    <el-input v-model="dialogForm.bank_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="卡号:">
                    <el-input v-model="dialogForm.bank_no" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开户网点:">
                    <el-input v-model="dialogForm.bank_dot" autocomplete="off"></el-input>
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

export default {
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            dialogFormVisible: false,
            dialogForm: {
                bank_dot: '',
                bank_name: '',
                bank_no: '',
                payee: '',
                id: ''
            },
            queryData: {
                payee: '',
                bank_no: '',
                user_id: '',
                page: 1,
                pageSize: 10
            }
       }
    },
    created() {
        this.getList();
    },
    methods: {
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        updtateRow(row) {
            for(var key in this.dialogForm) {
                this.dialogForm[key] = row[key];
            }
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            this.$http.post('/admin/updateUserBanks', this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/userBankList', obj).then(response => {
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