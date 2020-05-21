<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" @click="showDialog">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="create_date" align="center" label="日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="url" align="center" label="跳转地址"></el-table-column>
            <el-table-column label="图片" align="center">
                <template slot-scope="scope">
                    <img :src="'/api/img/banner/' + scope.row.img" width="160" height="60" alt="">
                </template>
            </el-table-column>
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
        <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="跳转地址:">
                    <el-input v-model="dialogForm.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片:">
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="dialogForm.img || imageUrl" :src="imageUrl || '/api/img/banner/' + dialogForm.logo" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
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
            imageUrl: '',
            dialogFormVisible: false,
            dialogForm: {
                img: '',
                url: ''
            },
            queryData: {
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
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.dialogForm.img = res.fileName;
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;
            return true
        },
        showDialog() {
            this.dialogForm.img = '';
            this.dialogForm.url = '';
            this.imageUrl = '';
            this.dialogFormVisible = true;
        },
        deleteRow(row) {
            this.$confirm('此操作将此条轮播图, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/deleteBanner', { id: row.id, img: row.img }).then(response => {
                    this.getList();
                    this.$Message.success('删除成功!');
                }).catch(() => {})
            }).catch(() => {});
        },
        updateConfirm() {
            if (!this.dialogForm.url) {
                this.$Message.error('请填写跳转地址!');
                return
            }
            if (!this.dialogForm.img) {
                this.$Message.error('请上传logo!');
                return
            }
            this.$http.post('/admin/addBanner', this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/bannerList', obj).then(response => {
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