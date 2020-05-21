<template>
    <div class="rechargebank">
        <my-header title="充值" bkUrl="/rechargetype"></my-header>
        <div class="bank-info">
            <div class="bank-cont">
                <div class="bank-mark">
                    <div>
                        <i v-if="bank.type === 1" class="iconfont" style="color:#de442c">&#xe68e;</i>
                        <i v-else-if="bank.type === 2" class="iconfont" style="color:#00c784">&#xe607;</i>
                        <i v-else class="iconfont" style="color:#09b4fd">&#xe60a;</i>
                    </div>
                    <div>
                        <p>支付方式:</p>
                        <p>收款人:</p>
                    </div>
                </div>
                <div class="bank-txt">
                    <div v-if="bank.type === 1">
                        <p>{{ bank.bank_name }}</p>
                        <p>{{ bank.payee }}</p>
                    </div>
                    <div v-else>
                        <p>
                            <span v-if="bank.type === 2">微信</span>
                            <span v-else>支付宝</span>
                        </p>
                        <p>{{ bank.account_name }}</p>
                    </div>
                </div>
            </div>
            <div class="recharge-info">
                <p class="recharge-tit">充值金额</p>
                <div class="recharge-input-wrap">
                    <span class="recharge-money-icon">¥</span>
                    <div class="zk-input-wrap"><input v-model="amount" type="text" class="zk-input__inner"></div>
                </div>
                <div class="amount-list">
                    <span v-for="item in amountList" :key="item" :class="{active: selectAmount === item}" @click="setAmount(item)">{{ item }}元</span>
                </div>
                <div class="yue">
                    余额:
                    <span>{{ user.amount }}&nbsp;元</span>
                </div>
                <mt-button type="danger" @click="goRoute">下一步</mt-button>
                <p class="service" @click="$router.push('/servicewin')">如有问题，请联系
                    <span>在线客服</span>
                </p>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectAmount: 50,
            amountList: [50, 100, 300, 500, 1000, 2000, 3000, 5000],
            amount: '',
            routeId: this.$route.params.id,
            user: {},
            bank: {}
        }
    },
    created() {
        var user = this.$store.state.user;
        this.user = user;
        this.getBanks();
    },
    mounted() {
        document.querySelector('input').focus();
    },
    methods: {
        goRoute(val) {
            var err = '';
            if (Number(this.amount) < 10) {
                err = '最低充值10'
            }
            if (!Number(this.amount)) {
                err = '请填写数字'
            }
            if (!this.amount) {
                err = '请填写充值金额';
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            this.$router.push({path: '/rechargesuccess/' + this.routeId, query: {amount: this.amount } })
        },
        setAmount(num) {
            this.selectAmount = num;
            this.amount = num;
        },
        getBanks() {
            this.$http.post('/grab/banks', {id: this.routeId, group_type: this.user.group_type}).then(response => {
                this.bank = response.banks[0] || {};
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
.rechargebank{
    height: 100%;
    background: #f1f1f1;
    padding: 10px;
}
.bank-info{
    background: #fff;
    padding-bottom: 30px;
    /* padding: 0 10px; */
}
.bank-cont{
    display: flex;
    justify-content: space-between;
    height: 50px;
    background: #fafafa;
    border-bottom: 1px solid #f2f2f2;
    /* padding: 0 10px; */
    font-size: 13px;
    overflow: hidden;
    color: #666;
}
.bank-mark > div{
    float: left;
    margin-top: 9px;
    margin-left: 10px;
}
.bank-mark > div i{
    color: #de442c;
    font-size: 26px;
    display: block;
}
.bank-mark p{
    line-height: 17px;
}
.bank-txt{
    text-align: right;
    padding-right: 10px;
    padding-top: 9px;
}
.recharge-info{
    padding: 0 28px;
}
.recharge-tit{
    padding-top: 12px;
    font-size: 13px;
    color: #333;
    padding-left: 20px;
}
.recharge-input-wrap {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 18px 20px 10px;
}
.recharge-money-icon{
    display: inline-block;
    font-size: 33px;
    font-weight: 500;
    padding-top: 21px;
}
.zk-input-wrap{
    min-width: 70%;
}
.zk-input-wrap input{
    width: 100%;
    height: 62px;
    color: #de442c;
    font-size: 62px;
    outline: none;
    margin: 0;
    padding: 0;
    padding-left: 10px;
    border: 0;
}
.amount-list{
    display: flex;
    flex-wrap: wrap;
    padding-top: 15px;
}
.amount-list span{
    display: inline-block;
    width: 24.9%;
    text-align: center;
    color: #7f7f7f;
    height: 26px;
    line-height: 26px;
    border: 1px solid #fff;
    background: #fafafa;
    font-size: 13px;
    /* float: left; */
}
.amount-list span.active{
    color: #fff;
    background: #de442c;
    border-color: #de442c;
}
.yue{
    font-size: 13px;
    color: #7f7f7f;
    padding-left: 28px;
    padding-top: 10px;
}
.yue span{
    color: #de442c;
}
button{
    width: 100%;
    margin: 30px 0 10px;
    background: #de442c;
}
.service{
    font-size: 13px;
    color: #7f7f7f;
    text-align: center;
}
.service span{
    color: #de442c;
    text-decoration: none;
}
</style>