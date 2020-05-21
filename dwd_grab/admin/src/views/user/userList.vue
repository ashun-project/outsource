<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="用户ID">
                <el-input v-model="queryData.id" clearable placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="帐号">
                <el-input v-model="queryData.phone" clearable placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="金额范围">
                <el-input v-model="queryData.minAmount" clearable style="width:160px" placeholder="最小金额"></el-input>
                &nbsp;-&nbsp;
                <el-input v-model="queryData.maxAmount" clearable style="width:160px" placeholder="最大金额"></el-input>
            </el-form-item>
            <el-form-item label="邀请码">
                <el-input v-model="queryData.invite" clearable placeholder="邀请码"></el-input>
            </el-form-item>
            <el-form-item label="注册时间">
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
            <el-form-item>
                <el-button type="primary" @click="showAddDialog">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="id" align="center" label="ID"></el-table-column>
            <el-table-column prop="create_date" align="center" label="注册日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                    <p style="color:red">(&nbsp;{{ scope.row.ip }}&nbsp;)</p>
                </template>
            </el-table-column>
            <el-table-column prop="phone" align="center" label="帐号"></el-table-column>
            <el-table-column prop="password" align="center" label="密码"></el-table-column>
            <el-table-column prop="invite" align="center" label="邀请码"></el-table-column>
            <el-table-column prop="group_type" align="center" label="分组">
                <template slot-scope="scope">
                    <span>{{ scope.row.group_type | getGroupType }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 1" size="small" type="info">禁用</el-tag>
                    <el-tag v-if="scope.row.status === 2" size="small" type="success">启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="amount" align="center" label="当前金额">
                <template slot-scope="scope">
                    <span style="color:#de442c">{{ scope.row.amount }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="parent_id" align="center" label="推荐人ID">
                <template slot-scope="scope">
                    <span v-if="scope.row.parent_id === 0">无</span>
                    <span v-else>{{ scope.row.parent_id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="$router.push('/agentList/' + scope.row.parent_top)" >代理组</el-button>
                    <el-button type="success" size="mini" @click="updtateRow(scope.row, '1')" >加减款</el-button>
                    <!-- <el-button type="default" style="margin-top:10px;margin-left:0" size="mini" @click="$router.push('/billList/' + scope.row.id)" >明细</el-button> -->
                    <el-button type="warning" style="margin-top:10px;margin-left:0" size="mini" @click="updtateRow(scope.row)" >修改</el-button>
                    <el-button type="danger" style="margin-top:10px;" size="mini" @click="resetCapital(scope.row)" >重置资金密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" label-width="120px">
                <div v-if="dialogForm.type">
                     <el-form-item label="当前金额:">
                         <span style="color:#de442c;font-size:18px">{{ dialogForm.amount }}</span>
                        <!-- <el-input v-model="dialogForm.amount" autocomplete="off"></el-input> -->
                    </el-form-item>
                    <el-form-item label="操作:">
                        <el-radio v-model="dialogForm.type" label="2" size="small" @change="asChanged">减款</el-radio>
                        <el-radio v-model="dialogForm.type" label="1" size="small">加款</el-radio>
                    </el-form-item>
                    <el-form-item label="操作金额:">
                        <el-input v-model="dialogForm.handleAMount" autocomplete="off" style="width:140px"></el-input>
                    </el-form-item>
                    <el-form-item label="类型:">
                        <el-select v-model="dialogForm.as_type" placeholder="请选择">
                            <el-option :label="dialogForm.type == 1 ? '人工存款' : '人工取款'" :value="1"></el-option>
                            <el-option label="优惠彩金" :disabled="dialogForm.type > 1" :value="2"></el-option>
                            <el-option label="其他" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="修改手机号:">
                        <el-input v-model="dialogForm.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="修改密码:">
                        <el-input v-model="dialogForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="修改分组:">
                        <el-select v-model="dialogForm.group_type" clearable placeholder="请选择">
                            <el-option label="默认分组" :value="0"></el-option>
                            <el-option label="分组1" :value="1"></el-option>
                            <el-option label="分组2" :value="2"></el-option>
                            <el-option label="分组3" :value="3"></el-option>
                            <el-option label="分组4" :value="4"></el-option>
                            <el-option label="分组5" :value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="修改状态:">
                        <el-select v-model="dialogForm.status" clearable placeholder="请选择">
                            <el-option label="禁用" :value="1"></el-option>
                            <el-option label="启用" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateConfirm">确 定</el-button>
            </div>
        </el-dialog>

         <el-dialog title="添加用户" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="120px">
                <el-form-item label="手机号:">
                    <el-input v-model="addForm.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input v-model="addForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邀请码:">
                    <el-input v-model="addForm.invite" placeholder="(非必填) 不填默认为顶级" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
var optionsStatus = [
    {label: '审核中', value: 1},
    {label: '充值成功', value: 2},
    {label: '充值失败', value: 3}
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
            addFormVisible: false,
            dialogTitle: '',
            dialogForm: {
                phone: '',
                password: '',
                amount: '',
                handleAMount: 0,
                group_type: '',
                status: '',
                type: '',
                id: '',
                parent_top: ''
            },
            addForm: {
                phone: '',
                password: '',
                invite: ''
            },
            queryData: {
                phone: '',
                minAmount: '',
                maxAmount: '',
                startTime: '',
                endTime: '',
                id: '',
                status: '',
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
        pickerChange(value) {
            this.queryData.startTime = value ? this.$common.formatDate(value[0], 2) : '';
            this.queryData.endTime = value ? this.$common.formatDate(value[1], 2) : '';
        },
        asChanged() {
            if (this.dialogForm.as_type === 2) {
                this.$set(this.dialogForm, 'as_type', 1);
            }
        },
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        updtateRow(row, type) {
            for(var key in this.dialogForm) {
                this.dialogForm[key] = row[key];
            }
            if (type) {
                this.dialogForm.type = type;
                this.dialogTitle = '用户加减款';
                this.$set(this.dialogForm, 'as_type', 1);
            } else {
                this.dialogTitle = '修改用户信息';
            }
            this.dialogFormVisible = true;
        },
        showAddDialog() {
            this.addForm.phone =  '';
            this.addForm.password = '';
            this.addFormVisible = true;
        },
        addConfirm() {
            if (!this.addForm.phone && !this.addForm.password) {
                this.$Message.warning('请填写完整！');
                return;
            }
            this.$http.post('/admin/addUser', this.addForm).then(response => {
                this.$Message.success(response.message);
                this.addFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        resetCapital(row) {
            this.$confirm('此操作将重置用户资金密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/admin/resetCapital', { id: row.id }).then(response => {
                    this.$Message.success('重置成功!');
                }).catch(() => {})
            }).catch(() => {});
        },
        updateConfirm() {
            var url = '/admin/updateUser';
            var obj = Object.assign({}, this.dialogForm);
            if (this.dialogForm.type) {
                url = '/admin/addSubAmount';
                obj.handleAMount = Number(obj.handleAMount)
                if (!obj.handleAMount || obj.handleAMount <= 0) {
                    this.$Message.warning('请填写正确金额！');
                    return
                }
            }
            this.$http.post(url, this.dialogForm).then(response => {
                this.$Message.success(response.message);
                this.dialogFormVisible = false;
                this.getList();
            }).catch(() => {})
        },
        addSubAmount() {

        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            obj.minAmount = Number(obj.minAmount);
            obj.maxAmount = Number(obj.maxAmount);
            this.loading = true;
            this.$http.post('/admin/userList', obj).then(response => {
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