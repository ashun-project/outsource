<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                
                <el-button v-if="examineStatus == 2" style="margin-left:10px" type="primary" @click="setExamine(1)">开启审核</el-button>
                <el-button v-if="examineStatus == 1" style="margin-left:10px" type="danger" @click="setExamine(2)">关闭审核</el-button>
            </el-form-item>
        </el-form>
        
        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="user_id" align="center" label="用户ID"></el-table-column>
            <el-table-column prop="user_name" align="center" label="评论用户"></el-table-column>
            <el-table-column prop="create_date" align="center" label="评论时间" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="zodiac_title" align="center" label="评论图类"></el-table-column>
            <el-table-column prop="issue" align="center" label="评论期数"></el-table-column>
            <el-table-column prop="cont" align="center" label="评论内容"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updateConfirm(scope.row)" >审核通过</el-button>
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
                <div>
                    <el-form-item label="当前用户:">
                        <span>{{ dialogForm.user_name }}</span>
                    </el-form-item>
                    <el-form-item label="修改内容:">
                        <el-input type="textarea" :rows="5" style="width: 390px" v-model="dialogForm.cont" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
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
            examineStatus: '',
            dialogForm: {
                cont: '',
                user_name: '',
                id: ''
            },
            queryData: {
                examine: 1,
                page: 1,
                pageSize: 10
            }
       }
    },
    created() {
        this.getList();
        this.$http.post('/admin/getExamineStatus').then(response => {
            this.examineStatus = response.data.is_examine;
        })
    },
    methods: {
        setExamine(value) {
            this.$http.post('/admin/updateExamine', {examine: value}).then(response => {
                this.examineStatus = value;
                this.$Message.success('修改成功');
            })
        },
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        updtateRow(row, type) {
            for(var key in this.dialogForm) {
                this.dialogForm[key] = row[key];
            }
            this.dialogTitle = '修改用户密码';
            this.dialogFormVisible = true;
        },
        updateConfirm(row) {
            var url = '/admin/updateCont';
            var obj = {
                cont: row.cont,
                id: row.id,
                examine: 2
            }
            this.$http.post(url, obj).then(response => {
                this.$Message.success(response.message);
                // this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        deleteRow(row) {
            this.$confirm('此操作将此条评论, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/deleteComment', { id: row.id }).then(response => {
                    this.getList();
                    this.$Message.success('删除成功!');
                }).catch(() => {})
            }).catch(() => {});
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/commentList', obj).then(response => {
                var data = response.data;
                this.tableData = data.list;
                this.total = data.total;
                this.loading = false;
            }).catch(() => {})
        }
    }
    
}
</script>

<style scoped>

</style>