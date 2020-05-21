<template>
    <div class="report-list">
        <el-form :inline="true" :model="queryData" class="demo-form-inline">
             <el-form-item label="日期">
                <el-date-picker
                    v-model="pickerDate"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    @change="pickerChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryChange(1)">搜索</el-button>
            </el-form-item>
        </el-form>

        <ul>
            <li>
                <p>存款总计</p>
                <span>{{ rechargeTotal }}&nbsp;元</span>
            </li>
            <li>
                <p>提款总计</p>
                <span>{{ withdrawTotal }}&nbsp;元</span>
            </li>
            <li>
                <p>手工加款金额</p>
                <span>{{ jiaTotal }}&nbsp;元</span>
            </li>
            <li>
                <p>优惠金额</p>
                <span>{{ youhuiTotal }}&nbsp;元</span>
            </li>
            <li>
                <p>盈利总计</p>
                <span>{{ (rechargeTotal - withdrawTotal).toFixed(2) }}&nbsp;元</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        var currentDate = this.$common.formatDate();
        return {
            rechargeTotal: 0,
            withdrawTotal: 0,
            jiaTotal: 0,
            youhuiTotal: 0,
            pickerDate: currentDate,
            queryData: {
                startTime: currentDate + ' 00:00:00',
                endTime: currentDate + ' 23:59:59',
                status: 2,
                filterTest: true,
                page: 1,
                pageSize: 1000000
            }
       }
    },
    created() {
        this.getList();
    },
    methods: {
        pickerChange(value) {
            var valueDate = this.$common.formatDate(value);
            this.queryData.startTime = valueDate + ' 00:00:00';
            this.queryData.endTime = valueDate + ' 23:59:59';
        },
        queryChange(val) {
            this.queryData.page = val;
            this.getList();
        },
        getRecharge() {
            return new Promise((resolve, reject) => {
                this.$http.post('/admin/rechargeList', this.queryData).then(response => {
                    resolve(response.list)
                }).catch(() => {})
            })
        },
        getWithdraw() {
            return new Promise((resolve, reject) => {
                this.$http.post('/admin/withdrawList', this.queryData).then(response => {
                    resolve(response.list)
                }).catch(() => {})
            })
        },
        getList() {
            Promise.all([this.getRecharge(), this.getWithdraw()]).then((result) => {
                this.tongji(result[0], 'recharge');
                this.tongji(result[1], 'withdraw');
            }).catch((error) => {
                console.log(error)
            })
        },
        tongji(list, type) {
            var total = 0;
            var jiaTotal = 0;
            var youhuiTotal = 0;
            for (var i = 0; i < list.length; i++) {
                total += list[i].amount;
                if (type == 'recharge' && list[i].recharge_type === 0) {
                    if (list[i].as_type === 1) {
                        jiaTotal += list[i].amount;
                    } else if (list[i].as_type === 2) {
                        youhuiTotal += list[i].amount;
                    }
                }
            }
            this.youhuiTotal = youhuiTotal.toFixed(2);
            this.jiaTotal = jiaTotal.toFixed(2);
            this[type + 'Total'] = total.toFixed(2);
        }
    }
    
}
</script>

<style scoped>
    .report-list ul{
        display: flex;
        flex-wrap: wrap;
        padding-top: 20px;
        /* justify-content: space-between; */
    }
    .report-list li{
        width: 300px;
        background: #fff;
        padding: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
    }
    .report-list li p{
        font-size: 18px;
        margin-bottom: 10px;
    }
    .report-list li span{
        color: #de442c;
        font-weight: 600;
        display: block;
        font-size: 20px;
    }
</style>