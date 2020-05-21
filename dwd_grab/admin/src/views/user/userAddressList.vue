<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="名称">
                <el-input v-model="queryData.name" clearable placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="queryData.amount" clearable placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="用户ID">
                <el-input v-model="queryData.user_id" clearable placeholder="id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="user_id" align="center" label="用户ID"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名"></el-table-column>
            <el-table-column prop="city" align="center" label="城市"></el-table-column>
            <el-table-column prop="address" align="center" label="详细地址"></el-table-column>
            <el-table-column prop="phone" align="center" label="手机号"></el-table-column>
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
                <el-form-item label="姓名:">
                    <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="城市:">
                    <el-input v-model="dialogForm.city" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="详细地址:">
                    <el-input v-model="dialogForm.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号:">
                    <el-input v-model="dialogForm.phone" autocomplete="off"></el-input>
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
                address: '',
                phone: '',
                name: '',
                city: '',
                id: ''
            },
            queryData: {
                name: '',
                user_id: '',
                phone: '',
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
            this.$http.post('/admin/updateAddress', this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/userAddresssList', obj).then(response => {
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