<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item label="帐号">
                <el-input v-model="queryData.phone" clearable placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="时间">
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
                <el-button type="danger" @click="$router.push('/userList')">返回</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="create_date" align="center" label="注册日期" width="150">
                <template slot-scope="scope">
                    <span>{{ $common.formatDate(scope.row.create_date, 1)}}</span>
                    <!-- <p style="color:red">(&nbsp;{{ scope.row.ip }}&nbsp;)</p> -->
                </template>
            </el-table-column>
            <el-table-column prop="level" align="center" label="等级" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.level }}级</span>
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
        </el-table>
        <div class="mypage" v-if="total > 10">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
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
            queryData: {
                parent_top: this.$route.params.id,
                phone: '',
                startTime: '',
                endTime: '',
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
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        getList() {
            this.loading = true;
            this.$http.post('/admin/userList', this.queryData).then(response => {
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