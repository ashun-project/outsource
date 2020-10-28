<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item>
               <span class="tip">总共&nbsp;<font>{{ examineTotal + total }}</font>&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已审核 <font>{{ examineTotal }}</font>&nbsp;条
               &nbsp;&nbsp;&nbsp;&nbsp;未审核 <font>{{ total }}</font>&nbsp;条</span>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-left:10px" type="danger" @click="goExamine()">批量审核</el-button>
                <el-button style="margin-left:10px" type="danger" @click="goExamine(allTable)">全部审核</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" align="center" label="ID"></el-table-column>
            <el-table-column prop="title" align="center" label="名称"></el-table-column>
            <el-table-column prop="create_date" align="center" label="下载时间" width="200">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.down_date, 1)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="img" align="center" width="200" label="图片预览">
                <template slot-scope="scope">
                    <!-- // /api/am/zodiacImg/col/239/239_amsbx.jpg -->
                    <img :src="'/api/examine/' + scope.row.type + '/' + scope.row.issue + '_' + scope.row.img + '?_=' + new Date().getTime() " width="100%" alt="">
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
                    <el-button type="danger" size="mini" @click="goExamine([scope.row])" >审核</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="mypage" v-if="total > 30">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :page-size="30" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog title="修改图片" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <el-form-item label="图片:">
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/admin/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
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
            examineTotal: 0,
            loading: false,
            tableData: [],
            allTable: [],
            selectionList: [],
            imageUrl: '',
            dialogFormVisible: false,
            dialogTitle: '',
            dialogForm: {
                img: '',
                aldImg: '',
                type: '',
                id: ''
            },
            queryData: {
                startTime: '',
                endTime: '',
                page: 1,
                pageSize: 2000
            }
       }
    },
    created() {
        var date = new Date();
        var currHour = date.getHours();
        var currdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 22:00:00';
        var setTime = '';
        if (currHour >= 21 && currHour < 22) {
            return;
        }
        if (currHour >= 22) {
            setTime = this.$common.formatDate(new Date(currdate), 2);
        } else {
            var yesTime = new Date(currdate).getTime() - (24 * 60 * 60 * 1000);
            setTime = this.$common.formatDate(new Date(yesTime), 2);
        }
        this.queryData.startTime = setTime;
        this.queryData.endTime = this.$common.formatDate(date, 2);
        this.getList();
    },
    methods: {
        queryChange(val) {
            this.queryData.page = val;
            var arr = this.allTable.slice((this.queryData.page - 1) * 30, this.queryData.page * 30);
            this.$set(this, 'tableData', arr);
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
        handleSelectionChange(rows) {
            this.selectionList = rows;
        },
        updtateRow(row, type) {
            this.dialogForm.id = row.id;
            this.dialogForm.oldImg = row.issue + '_' + row.img;
            this.dialogForm.type = row.type;
            this.dialogFormVisible = true;
        },
        updateConfirm() {
            var url = '/admin/editImg';
            var obj = Object.assign({}, this.dialogForm);
            this.$http.post(url, this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        goExamine(rows) {
            var list = rows || this.selectionList;
            var arr = [];
            if (!list.length) {
                this.$Message.warning('请选择要审核的数据')
                return
            }

            this.$confirm('审核后将会在前台展示, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (list.length > 200) {
                    var len = Math.ceil(list.length / 200);
                    for(var i = 0; i < len; i++) {
                        arr.push(list.slice(i * 200, (i + 1) * 200))
                    }
                } else {
                    arr = [list];
                }
                this.getSliceExamine(arr, arr.length - 1);
            }).catch(() => {});
        },
        getSliceExamine(list, num) {
            if (num < 0) {
                this.getList();
                this.$Message.success('审核成功!');
            } else {
                this.$http.post('/admin/examine', { list: list[num] }).then(response => {
                    this.getSliceExamine(list, num - 1);
                }).catch(() => {})
            }
        },
        getList() {
            this.loading = true;
            this.$http.post('/admin/zodiacList', this.queryData).then(response => {
                var data = response.data;
                var arr = data.list.slice((this.queryData.page - 1) * 30, this.queryData.page * 30);
                this.allTable = data.list
                this.$set(this, 'tableData', arr);
                this.total = data.total;
                this.loading = false;
            }).catch(() => {});

            var obj = Object.assign({}, this.queryData);
            obj.examineDate = obj.startTime;
            obj.pageSize = 1;
            this.$http.post('/admin/zodiacList', obj).then(response => {
                var data = response.data;
                this.examineTotal = data.total;
            }).catch(() => {})
        }
    }
    
}
</script>

<style scoped>
.tip{
    font-size: 16px;
    background: #fff;
    margin-bottom: 10px;
    color: rgb(155, 111, 57);
}
.tip font{
    color: red;
    font-weight: 600;
}
</style>