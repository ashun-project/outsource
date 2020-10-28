<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="用户ID">
                <el-input v-model="queryData.user_id" clearable style="width:100px" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="期数">
                <el-input v-model="queryData.issue" style="width:120px" clearable placeholder="期数"></el-input>
            </el-form-item>
            <el-form-item label="图类">
                <el-input v-model="queryData.zodiac_title" clearable placeholder="图类"></el-input>
            </el-form-item>
            <el-form-item label="收藏时间">
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
            <el-table-column prop="user_id" align="center" label="用户ID"></el-table-column>
            <el-table-column prop="user_name" align="center" label="用户昵称"></el-table-column>
            <el-table-column prop="create_date" align="center" label="收藏日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="zodiac_title" align="center" label="收藏图类"></el-table-column>
            <el-table-column prop="issue" align="center" label="收藏期数"></el-table-column>
            <!-- <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" style="margin-top:10px;margin-left:0" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <div>
                    <el-form-item label="当前帐号:">
                        <span>{{ dialogForm.account }}</span>
                    </el-form-item>
                    <el-form-item label="修改密码:">
                        <el-input v-model="dialogForm.password" autocomplete="off"></el-input>
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
            dialogForm: {
                account: '',
                password: '',
                id: ''
            },
            queryData: {
                startTime: '',
                endTime: '',
                zodiac_title: '',
                user_id: '',
                issue: '',
                page: 1,
                pageSize: 10
            }
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
        updtateRow(row, type) {
            for(var key in this.dialogForm) {
                this.dialogForm[key] = row[key];
            }
            this.dialogTitle = '修改用户密码';
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            var url = '/admin/updatePassword';
            var obj = Object.assign({}, this.dialogForm);
            this.$http.post(url, this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/collectList', obj).then(response => {
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