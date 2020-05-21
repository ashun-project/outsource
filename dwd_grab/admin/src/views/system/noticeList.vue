<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="标题">
                <el-input v-model="queryData.title" clearable placeholder="公告标题"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="queryData.type" clearable placeholder="请选择">
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
            <el-table-column label="公告类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">系统公告</span>
                    <!-- <span v-else-if="scope.row.type === 2">会员公告</span> -->
                    <span v-else>会员站内信</span>
                </template>
            </el-table-column>
             <el-table-column prop="user_id" label="用户ID" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
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
                <el-form-item label="类型:">
                    <el-select v-model="dialogForm.type" placeholder="请选择类型">
                        <el-option
                            v-for="item in optionsStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dialogForm.type == 3" label="用户ID:">
                    <el-input v-model="dialogForm.user_id" autocomplete="off"></el-input>
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
    // {label: '会员公告', value: 2},
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
                cont: '',
                type: '',
                user_id: ''
            },
            queryData: {
                title: '',
                type: '',
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
            if (row.id) {
                this.dialogTitle = '修改公告';
                this.dialogForm.id = row.id;
            } else {
                this.dialogTitle = '添加公告';
                this.dialogForm.type = 1;
                delete this.dialogForm.id;
            }
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
            if (this.dialogForm.id) {
                url = '/admin/updateNotice';
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
            this.$http.post('/admin/noticeList', obj).then(response => {
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