<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="店铺名称">
                <el-input v-model="queryData.store_name" clearable placeholder="店铺"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryData.store_id" clearable placeholder="请选择">
                    <el-option
                    v-for="item in storeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="updtateRow({})">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="create_date" align="center" label="创建日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="store_name" align="center" label="店铺名称"></el-table-column>
            <el-table-column prop="goods_name" align="center" label="商品名称"></el-table-column>
            <el-table-column prop="price" align="center" label="价格">
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属分类" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.store_id | getStore }}</span>
                </template>
            </el-table-column>
            <el-table-column label="logo" align="center">
                <template slot-scope="scope">
                    <img :src="'/api/img/goods/' + scope.row.logo" width="50" height="50" alt="">
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
                    <el-input v-model="dialogForm.store_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品名称:">
                    <el-input v-model="dialogForm.goods_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格:">
                    <el-input v-model="dialogForm.price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属分类:">
                    <el-select v-model="dialogForm.store_id" placeholder="请选择分类">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="logo:">
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="dialogForm.logo || imageUrl" :src="imageUrl || '/api/img/goods/' + dialogForm.logo" class="avatar">
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
var storeStatusList = [];
export default {
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            storeList: [],
            dialogTitle: '',
            dialogFormVisible: false,
            imageUrl: '',
            dialogForm: {
                store_id: '',
                store_name: '',
                price: '',
                goods_name: 2,
                logo: ''
            },
            queryData: {
                store_name: '',
                store_id: '',
                page: 1,
                pageSize: 10
            }
       }
    },
    filters: {
        getStore(id) {
            // debugger
            // debugger
            var arr = storeStatusList.filter(item => item.id === id);
            return arr[0].name
        }
    },
    created() {
        this.$http.post('/admin/storeList', {page:1, pageSize: 1000}).then(response => {
            this.storeList = response.list;
            storeStatusList = response.list;
            this.getList();
        }).catch(() => {})
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
                this.$http.post('/admin/deleteGoods', { id: row.id, logo: row.logo }).then(response => {
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
                this.dialogTitle = '修改商品';
                this.dialogForm.id = row.id;
            } else {
                this.dialogTitle = '添加商品';
                // this.dialogForm.status = 1;
                delete this.dialogForm.id;
            }
            this.imageUrl = '';
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            var obj = Object.assign({}, this.dialogForm);
            var url = '/admin/addGoods';
            var err = '';
            obj.price = Number(obj.price);
            if (!obj.logo) {
                err = '请上传logo'
            }
            if (!obj.store_id) {
                err = '请选择分类'
            }
            if (!obj.price) {
                err = '价格输入有误'
            }
            if (!obj.goods_name) {
                err = '请填写商品名称'
            }
            if (!obj.store_name) {
                err = '请填写店铺名称'
            }
            if (err) {
                this.$Message.error(err);
                return
            }
            if (obj.id) {
                url = '/admin/updateGoods';
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
            this.$http.post('/admin/goodsList', obj).then(response => {
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