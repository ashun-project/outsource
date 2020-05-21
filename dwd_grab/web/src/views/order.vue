<template>
    <div class="order">
        <div class="go-back" @click="goRoute('home')">
            <i class="iconfont">&#xe62a;</i>
        </div>
        <div class="go-ordernotes" @click="goRoute('grabnotes')">
            <i class="iconfont">&#xe610;</i>
            <span>我的订单</span>
        </div>
        <div class="order-info">
            <div class="toxiang">
                <!-- <i class="iconfont">&#xe666;</i> -->
                <img :src="'/api/img/store/' + store.logo" />
            </div>
            <div class="info">
                <p>{{ store.name }}</p>
                <span>佣金返利：{{ store.profit }}%</span>
            </div>
            <div class="today-profit">
                <span>今日收益￥{{ successAmount.toFixed(2) }}</span>
            </div>
        </div>
        <div class="money">
            <div>
                <span>{{ user.amount }}</span>
                <p>总余额</p>
            </div>
            <div>
                <span>{{ (user.amount - frozenAmount).toFixed(2) }}</span>
                <p>可抢单余额</p>
            </div>
            <div class="no-af">
                <span>{{ commissionAmount.toFixed(2) }}</span>
                <p>团队佣金</p>
            </div>
            <div>
                <span>{{ orderList.length }}</span>
                <p>今日抢单数</p>
            </div>
            <div>
                <span>{{ frozenList.length }}</span>
                <p>冻结订单数</p>
            </div>
            <div class="no-af">
                <span>{{ frozenAmount.toFixed(2) }}</span>
                <p>总冻结金额</p>
            </div>
        </div>
        <!-- <div class="line"></div> -->
        <div class="grab-btn" @click="grabOrder">
            <img v-if="loading" src="@/assets/img/grabloading.gif" alt="">
            <img v-else src="@/assets/img/grab.png" alt="">
        </div>
        <div class="shuoming">
            <div class="remarks">备注说明</div>
            <p>
                每个用户每天最多可抢30单，平台将订单匹配给用户的同时，平台将该笔订单的信息提交到商家后台，若用户在2分钟之内不提交订单，为了规避网购平台的监管，该笔订单会被冻结. 订单冻结后，该笔订单资金也会被冻结，需等待当日24点后系统自行解冻，请各位用户知悉。
            </p>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            store: {},
            routeId: this.$route.params.id,
            loading: false,
            orderList: [],
            frozenList: [],
            frozenAmount: 0,
            successAmount: 0,
            commissionAmount: 0,
            address: false
        }
    },
    created() {
        this.user = this.$store.state.user;
        this.$http.post('/grab/storeList', {id: this.routeId}, {loading: true}).then(response => {
           this.store = response.list[0] || {};
        }).catch(() => {})
        this.$http.post('/grab/todayOrder', {userId: this.user.id}, {loading: true}).then(response => {
            var list = response.list || [];
            for (var i = 0; i < list.length; i++) {
                this.orderList.push(list[i]);
                if (list[i].status === 1) {
                    this.frozenList.push(list[i]);
                    this.frozenAmount += (list[i].price * list[i].item);
                } else {
                    this.successAmount += list[i].earn;
                }
            }
        }).catch(() => {})
        // 获取佣金
        var date = this.$common.formatDate('', true);
        this.$http.post('/grab/commissionList', { user: this.user, date: date.replace(/-/g, '') }).then(response => {
            this.commissionAmount = response.result.total
        }).catch(() => {})
        // 查询地址信息
        this.$http.post('/grab/addressList', {userId: this.user.id}).then(response => {
            var arr = response.list.filter(item => item.status === 2);
            if (arr[0]) {
                this.address = true;
            }
        }).catch(() => {})
    },
    methods: {
        goRoute(val) {
            if (val == 'grabnotes') {
                this.$router.push({ path: '/grabnotes', query: { from: '/order/' + this.routeId } })
            } else {
                this.$router.push('/' + val)
            }
        },
        grabOrder() {
            if (!this.address) {
                this.$Message.alert('请设置一个默认的收货地址').then(action => {
                    this.$router.push({ path: '/address', query: {from: '/order/' + this.routeId } });
                })
                return
            }
            this.loading = true;
            var num = 1;
            this.$http.post('/grab/currentOrder', {userId: this.user.id}).then(response => {
                if (response.list[0]) {
                    this.$Toast({
                        message: '你有未完成的订单',
                        duration: 1500
                    })
                    this.$router.push("/orderdetail");
                } else {
                    var vm = this;
                    var timer = setInterval(() => {
                        num++
                        if (num > 5) {
                            clearInterval(timer);
                            this.$http.post('/grab/grabOrder', {userId: this.user.id, storeId: this.routeId, profit: this.store.profit, minMmount: this.store.min_amount}).then(response => {
                                this.goNext();
                            }).catch(() => {
                                this.loading = false;
                            })
                        }
                    }, 1000);
                }
            }).catch(() => {})
        },
        goNext() {
            this.loading = false;
            this.$Toast({
                message: '抢单成功',
                duration: 1500
            })
            this.$router.push('/orderdetail');
        }
    }
}
</script>

<style scoped>
.go-back{
    position: absolute;
    left: 15px;
    top: 15px;
}
.go-back i{
    font-size: 22px;
    color: #fff;
}
.order-info{
    /* background: url(../assets/img/mycenter-bg.png); */
    height: 200px;
    background-size: 100% 100%;
    /* display: flex;
    flex-wrap: wrap; */
    padding: 20px 10px 0 10px;
    background: #ff5656;
}
.order-info .toxiang{
    width: 60px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.29);
    height: 60px;
    margin: 0 auto;
}
.order-info .toxiang img{
    width: 60px;
    height: 60px;
}
.order-info .info{
    color: #e2e2e2;
    margin-top: 5px;
    line-height: 25px;
    font-size: 16px;
    text-align: center;
}
.order-info .info span{
    display: block;
    padding: 0 10px;
    border-radius: 17px;
    position: relative;
    font-weight: normal;
    font-size: 14px;
    margin-top: 5px;
}
.order-info .info span .icon{
    position: absolute;
    right: 10px;
    top: 2px;
}
.money {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0 8px;
}
.money > div{
    width: 33.33%;
    text-align: center;
    font-size: 12px;
    color: #666;
    position: relative;
    margin-bottom: 20px;
}
.money > div span{
    font-size: 16px;
    font-weight: 600;
    color: #de442c;
    display: block;
    margin-bottom: 3px;
}
.money div.refresh i{
    font-size: 22px;
    color: #de442c;
}
.money > div::after{
    content: '';
    height: 10px;
    width: 1px;
    background: #999;
    position: absolute;
    right: 0;
    top: 50%;
}
.money > div.no-af::after{
    width: 0;
}
.grab-btn{
    width: 70%;
    /* height: 86px; */
    margin: 0 auto;
    background: #fff;
    border-radius: 50%;
    padding: 3px;
}
.grab-btn img{
    /* float: left; */
    width: 100%;
}
.shuoming{
    padding: 10px 15px;
    font-size: 13px;
    line-height: 25px;
    color: #5a5a5a;
    background: #bfb192;
}
.shuoming .remarks{
    font-size: 15px;
    border-bottom: 1px solid #eee;
    line-height: 40px;
    margin-bottom: 10px;
}
.mask{
    position: fixed;
    bottom: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: #bfb192;
    z-index: -1;
}
.go-ordernotes{
    position: absolute;
    top: 15px;
    right: 10px;
    font-size: 13px;
    color: #fff;
}
.go-ordernotes span{
    float: left;
}
.go-ordernotes i{
    float: left;
    font-size: 13px;
    margin-top: 3px;
    margin-right: 5px;
}
.today-profit{
    height: 50px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    line-height: 50px;
    position: relative;
}
.today-profit::before{
    content: '';
    width: 50%;
    height: 1px;
    background: #fff;
    position: absolute;
    left: 0;
    top: 50%;
    display: block;
}
.today-profit::after{
    content: '';
    width: 50%;
    height: 1px;
    background: #fff;
    position: absolute;
    right: 0;
    top: 50%;
    display: block;
}
.today-profit span{
    padding: 0 10px;
    background: #ff5656;
    display: inline-block;
    margin: 0 auto;
    position: relative;
    z-index: 99;
}
</style>