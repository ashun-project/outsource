<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="标题">
                <el-input v-model="queryData.title" clearable placeholder="公告标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
                <el-button type="warning" @click="updtateRow({})">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="create_date" align="center" label="日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" align="center" label="公告标题"></el-table-column>
            <el-table-column prop="cont" align="center" label="公告内容"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="标题:">
                    <el-input v-model="dialogForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容:">
                    <el-input v-model="dialogForm.cont" type="textarea" rows="3" autocomplete="off"></el-input>
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
    {label: '系统公告', value: 1},
    {label: '弹窗公告', value: 2},
    {label: '会员站内信', value: 3}
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
            dialogTitle: '',
            dialogForm: {
                title: '',
                cont: ''
            },
            queryData: {
                title: '',
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
            for (var key in this.dialogForm) {
                this.dialogForm[key] = row[key]
            }
            this.dialogTitle = '添加公告';
            this.dialogFormVisible = true;
        },
        deleteRow(row) {
            this.$confirm('此操作将此条公告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/deleteNotice', { id: row.id }).then(response => {
                    this.getList();
                    this.$Message.success('删除成功!');
                }).catch(() => {})
            }).catch(() => {});
        },
        updateConfirm() {
            if (!this.dialogForm.title || !this.dialogForm.cont) {
                this.$Message.success('请填写完整内容');
                return
            }
            var url = '/admin/addNotice';
            this.$http.post(url, this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/noticeList', obj).then(response => {
                this.tableData = response.data.list;
                this.total = response.data.total;
                this.loading = false;
            }).catch(() => {})
        }
    }
    
}
</script>

<style scoped>

</style>