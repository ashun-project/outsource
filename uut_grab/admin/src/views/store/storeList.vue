<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="分类名称">
                <el-input v-model="queryData.name" clearable placeholder="店铺"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="updtateRow({})">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="name" align="center" label="分类名称"></el-table-column>
            <el-table-column prop="min_amount" align="center" label="最新抢单金额"></el-table-column>
            <el-table-column prop="profit" align="center" label="佣金">
                <template slot-scope="scope">
                    <span>{{ scope.row.profit }}%</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 1" size="small" type="info">已禁用</el-tag>
                    <el-tag v-if="scope.row.status === 2" size="small" type="success">启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="logo" align="center">
                <template slot-scope="scope">
                    <img :src="'/api/img/store/' + scope.row.logo" width="50" height="50" alt="">
                </template>
            </el-table-column>
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
                <el-form-item label="店铺名称:">
                    <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="最小金额:">
                    <el-input v-model="dialogForm.min_amount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="佣金:">
                    <el-input v-model="dialogForm.profit" style="width:100px" autocomplete="off"></el-input>&nbsp;%
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="dialogForm.status" placeholder="请选择是否开启">
                        <el-option label="启用" :value="2"></el-option>
                        <el-option label="禁用" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="logo:">
                    <!-- <el-input v-model="dialogForm.logo" autocomplete="off"></el-input> -->
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="dialogForm.logo || imageUrl" :src="imageUrl || '/api/img/store/' + dialogForm.logo" class="avatar">
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
            dialogTitle: '修改分类',
            dialogFormVisible: false,
            imageUrl: '',
            dialogForm: {
                name: '',
                min_amount: 0,
                profit: '',
                status: 2,
                logo: ''
            },
            queryData: {
                name: '',
                page: 1,
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
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.dialogForm.logo = res.fileName;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            // this.loadingUpload = false;
            // if (!isJPG) {
            // this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            // if (!isLt2M) {
            // this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isJPG && isLt2M;
            return true
        },
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        deleteRow(row) {
            this.$confirm('此操作将删除店铺信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/deleteStore', { id: row.id, logo: row.logo }).then(response => {
                    this.getList();
                    this.$Message.success('删除成功!');
                }).catch(() => {})
            }).catch(() => {});
        },
        updtateRow(row) {
            for (var key in this.dialogForm) {
                this.dialogForm[key]= row[key];
            }
            if (row.id) {
                this.dialogTitle = '修改分类';
                this.dialogForm.id = row.id;
            } else {
                this.dialogTitle = '添加分类';
                this.dialogForm.status = 1;
                delete this.dialogForm.id;
            }
            this.imageUrl = '';
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            var obj = Object.assign({}, this.dialogForm);
            var url = '/admin/addStore';
            var err = '';
            obj.min_amount = Number(obj.min_amount);
            obj.profit = Number(obj.profit);
            if (!obj.logo) {
                err = '请上传logo'
            }
            if (!obj.min_amount || !obj.profit) {
                err = '金额或者佣金输入有误'
            }
            if (!obj.name) {
                err = '请填写店铺名称'
            }
            if (err) {
                this.$Message.error(err);
                return
            }
            if (obj.id) {
                url = '/admin/updateStore';
                obj.oldLogo = this.tableData.filter(item => item.id === obj.id)[0].logo;
            }
            this.$http.post(url, obj).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/storeList', obj).then(response => {
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