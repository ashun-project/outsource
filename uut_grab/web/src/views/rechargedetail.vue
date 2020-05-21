<template>
    <div class="rechargedetail">
        <my-header title="充值详情" bkUrl="/rechargenotes"></my-header>
       
        <ul class="cell-list">
            <li>
                <span class="withdraw-tit">交易单号</span>
                <span class="withdraw-txt">{{ recharge.order_no }}</span>
            </li>
             <li>
                <span class="withdraw-tit">交易时间</span>
                <span class="withdraw-txt">{{ formatDate(recharge.create_date) }}</span>
            </li>
             <li>
                <span class="withdraw-tit">交易方式</span>
                <span class="withdraw-txt">{{ recharge.recharge_type | getType }}</span>
            </li>
             <li>
                <span class="withdraw-tit">交易状态</span>
                <span class="withdraw-txt">{{ recharge.status | getStatus}}</span>
            </li>
            <li>
                <span class="withdraw-tit">交易金额</span>
                <span class="withdraw-txt">{{ recharge.amount }}</span>
            </li>
            <li v-if="recharge.status === 3" class="fail">
                <span class="withdraw-tit">失败原因</span>
                <span class="withdraw-txt">{{ recharge.remark }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            recharge: {}
        }
    },
    filters: {
        getType(num) {
            var typelist = ['系统操作', '银行卡转账', '微信充值', '支付宝充值'];
            return typelist[num]
        },
        getStatus(num) {
            var statusList = ['审核中...', '交易成功', '交易失败'];
            return statusList[num-1];
        }
    },
    methods: {
        formatDate(date) {
            return this.$common.formatDate(date)
        }
    },
    created() {
        var id = this.$route.params.id;
        this.$http.post('/grab/rechargeList', { id: id }).then(response => {
            this.recharge = response.list[0];
        }).catch(() => {})
    }
}
</script>

<style scoped>

.cell-list li{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    min-height: inherit;
    overflow: hidden;
    padding: 15px 10px;
    width: 100%;
    /* height: 48px;
    line-height: 48px; */
    position: relative;
    font-size: 14px;
}
.cell-list li::after{
    content: '';
    position: absolute;
    border-bottom: 1px solid #d9d9d9;
    transform: scaleY(0.5);
    bottom: 0;
    left: 0;
    right: 0;
}
.cell-list .withdraw-txt{
    color: #999;
}
.fail .withdraw-txt{
    color: #de442c;
}
</style>