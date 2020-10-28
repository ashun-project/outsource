<template>
    <div>
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
            <el-form-item>
                <el-button type="danger" :loading="downloading" @click="startDownload">开始抓取</el-button>
                <el-button type="primary" @click="queryChange(1)">刷新</el-button>
            </el-form-item>
            <el-form-item v-if="downloading">
                <span>抓取中...</span>
                <i class="el-icon-loading"></i>
            </el-form-item>
            <el-form-item v-else>
                <span>抓取结束后多刷新几下，数据可能返回较慢</span>
            </el-form-item>
        </el-form>
        <div class="tip">
            <span>下载时间为22点至第二天21点</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;一次最多下载{{queryData.pageSize}}条&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>当前剩余：<b style="color:red">{{total}}</b>&nbsp;条</span>
        </div>
        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column prop="title" align="center" label="名称"></el-table-column>
            <el-table-column prop="url" align="center" label="类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.type === 'col' ? '彩图' : '黑图'  }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="url" align="center" label="远程页面">
                <template slot-scope="scope">
                    <span>{{ '域名 + ' + scope.row.url }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nick_name" align="center" label="远程图片">
                <template slot-scope="scope">
                    <span>{{ '域名 + /' + scope.row.type + '/' + currentIssue.newIssue + '/' + scope.row.img}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypage" v-if="total > 300">
            <el-pagination @current-change="queryChange" background layout="total, prev, pager, next" :page-size="queryData.pageSize" :total="total"></el-pagination>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            total: 0,
            loading: false,
            downloading: false,
            currentIssue: {},
            tableData: [],
            queryData: {
                downDate: '',
                page: 1,
                pageSize: 300
            }
       }
    },
    created() {
        var date = new Date();
        var currHour = date.getHours();
        var currdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 22:00:00';
        var setTime = '';
        if (currHour >= 22) {
            setTime = this.$common.formatDate(new Date(currdate), 2);
        } else {
            var yesTime = new Date(currdate).getTime() - (24 * 60 * 60 * 1000);
            setTime = this.$common.formatDate(new Date(yesTime), 2);
        }
        // this.queryData.startTime = new Date();
        this.queryData.downDate = setTime;
        this.loading = true;
        this.$http.post('/admin/noteList', {pageSize: 1}).then(response => {
            var data = response.data[0] || {};
            data.newIssue = data.issue ? Number(data.issue.replace('2020', '')) + 1 : '';
            this.$set(this, 'currentIssue', data);
            this.getList();
        }).catch(() => {})
    },
    methods: {
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        startDownload() {
            var nowTime = new Date();
            var HourTime = nowTime.getHours();
            if (HourTime >= 21 && HourTime < 22) {
                this.$Message.error('只能在22点至第二天21点之间的时间段下载');
                return;
            }
            
            if (!this.tableData.length) {
                return;
            }

            var vm = this;
            var list = [];
            var tabList = this.tableData;
            var issue = this.currentIssue.newIssue;
            
            for (var i = 0; i < tabList.length; i++) {
                list.push({id: tabList[i].id, img: tabList[i].type + '/' + issue + '/' + issue + '_' + tabList[i].img})
            }

            this.downloading = true;
            this.$http.post('/admin/downloadImg', {list: list}).then(response => {
                this.getResult(list.length);
            }).catch(() => {})
        },
        getResult(num) {
            if (num <= 0) {
                this.downloading = false;
                return
            }
            var vm = this;
            setTimeout(() => {
                vm.getResult(num - 3);
                vm.getList();
            }, 3000)
        },
        getList() {
            var obj = Object.assign({}, this.queryData);
            this.loading = true;
            this.$http.post('/admin/zodiacList', obj).then(response => {
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
.tip{
    font-size: 16px;
    line-height: 45px;
    padding-left: 10px;
    background: #fff;
    margin-bottom: 10px;
    color: rgb(155, 111, 57);
}
</style>