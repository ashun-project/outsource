<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="帐号名称">
                <el-input v-model="queryData.account_name" clearable placeholder="收款人帐号"></el-input>
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
            <el-table-column prop="account_name" align="center" label="帐号名称"></el-table-column>
            <el-table-column prop="qr_code" align="center" label="二维码">
                <template slot-scope="scope">
                    <img :src="'/api/img/pay/' + scope.row.qr_code" width="90" height="90" alt="">
                </template>
            </el-table-column>
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
                <el-form-item label="帐号名称:">
                    <el-input v-model="dialogForm.account_name" autocomplete="off"></el-input>
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
                <el-form-item label="二维码:">
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="dialogForm.qr_code || imageUrl" :src="imageUrl || '/api/img/pay/' + dialogForm.qr_code" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="限额说明:">
                    <el-input v-model="dialogForm.remark" type="textarea" rows="3" autocomplete="off"></el-input>
                </el-form-item> -->
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
            imageUrl: '',
            dialogForm: {
                account_name: '',
                status: 2,
                type: 2,
                group_type: 0,
                qr_code: '',
                oldCode: ''
            },
            queryData: {
                status: '',
                bank_no: '',
                account_name: '',
                type: 2,
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
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.dialogForm.qr_code = res.fileName;
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;
            return true
        },
        updtateRow(row) {
            for (var key in this.dialogForm) {
                this.dialogForm[key] = row[key]
            }
            if (row.id) {
                this.dialogTitle = '修改微信';
                this.dialogForm.id = row.id;
                this.dialogForm.oldCode = row.qr_code;
            } else {
                this.dialogTitle = '添加微信';
                this.dialogForm.status = 1;
                this.dialogForm.type = 2;
                this.dialogForm.group_type = 0;
                delete this.dialogForm.id;
            }
            this.imageUrl = '';
            this.dialogFormVisible = true;
        },
        deleteRow(row) {
            this.$confirm('此操作将删除收款微信, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/deleteBank', { id: row.id, qr_code: row.qr_code }).then(response => {
                    this.$Message.success('删除成功!');
                    this.getList();
                }).catch(() => {})
            }).catch(() => {});
        },
        updateConfirm() {
            var url = '/admin/addPay'
            if (this.dialogForm.id) {
                url = '/admin/updatePay';
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