<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="queryData.payee" clearable placeholder="收款人姓名"></el-input>
            </el-form-item>
            <el-form-item label="卡号">
                <el-input v-model="queryData.bank_no" clearable placeholder="银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="queryData.status" clearable>
                    <el-option label="启用" :value="2"></el-option>
                    <el-option label="禁用" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updtateRow({})">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="id" align="center" label="ID" width="150"></el-table-column>
            <el-table-column prop="payee" align="center" label="姓名"></el-table-column>
            <el-table-column prop="bank_name" align="center" label="银行名称"></el-table-column>
            <el-table-column prop="bank_no" label="银行卡号" align="center"></el-table-column>
            <el-table-column prop="bank_dot" align="center" label="开户网点"></el-table-column>
            <el-table-column prop="group_type" align="center" label="分组">
                <template slot-scope="scope">
                    <span>{{ scope.row.group_type | getGroupType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 2" size="small" type="success">启用</el-tag>
                    <el-tag v-else size="small" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="限额说明"></el-table-column>
            <el-table-column label="操作" width="160px" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updtateRow(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="收款人:">
                    <el-input v-model="dialogForm.payee" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="银行卡名称:">
                    <el-input v-model="dialogForm.bank_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="银行号:">
                    <el-input v-model="dialogForm.bank_no" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开户网点:">
                    <el-input v-model="dialogForm.bank_dot" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="dialogForm.status">
                        <el-option label="启用" :value="2"></el-option>
                        <el-option label="禁用" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组:">
                    <el-select v-model="dialogForm.group_type" clearable placeholder="请选择">
                        <el-option label="默认分组" :value="0"></el-option>
                        <el-option label="分组1" :value="1"></el-option>
                        <el-option label="分组2" :value="2"></el-option>
                        <el-option label="分组3" :value="3"></el-option>
                        <el-option label="分组4" :value="4"></el-option>
                        <el-option label="分组5" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="限额说明:">
                    <el-input v-model="dialogForm.remark" type="textarea" rows="3" autocomplete="off"></el-input>
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
            pickerDate: '',
            dialogFormVisible: false,
            dialogTitle: '',
            dialogForm: {
                payee: '',
                bank_name: '',
                bank_no: '',
                bank_dot: '',
                status: 2,
                remark: '',
                group_type: 0,
                type: 1
            },
            queryData: {
                status: '',
                bank_no: '',
                payee: '',
                type: 1,
                page: 1,
                pageSize: 10
            }
       }
    },
    filters: {
        getGroupType(type) {
            var typeList = ['默认分组', '分组1', '分组2', '分组3' , '分组4', '分组5'];
            return typeList[type]
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
            for (var key in this.dialogForm) {
                this.dialogForm[key] = row[key]
            }
            if (row.id) {
                this.dialogTitle = '修改银行卡';
                this.dialogForm.id = row.id;
            } else {
                this.dialogTitle = '添加银行卡';
                this.dialogForm.status = 1;
                this.dialogForm.type = 1;
                this.dialogForm.group_type = 0;
                delete this.dialogForm.id;
            }
            this.dialogFormVisible = true;
        },
        deleteRow(row) {
            this.$confirm('此操作将删除银行卡, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/deleteBank', { id: row.id }).then(response => {
                    this.$Message.success('删除成功!');
                    this.getList();
                }).catch(() => {})
            }).catch(() => {});
        },
        updateConfirm() {
            var url = '/admin/addBanks'
            if (this.dialogForm.id) {
                url = '/admin/updateBanks';
            }
            this.$http.post(url, this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/banks', obj).then(response => {
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