<template>
  <div class="order-detail">
    <div class="de-header">
      <div class="header-tit" @click="goRoute('home')">
        <i class="iconfont">&#xe62a;</i>
        <span>订单详情</span>
      </div>
      <div class="de-cont">
        <h6>等待买家确认</h6>
        <p>您的订单将于{{timeMinustes}}分{{timeSeconds}}秒后自动冻结</p>
      </div>
    </div>
    <div class="site">
        <div class="site-left">
            <img src="@/assets/img/icon-add.png" />
        </div>
        <div class="site-right" @click="goRoute('address')">
            <div class="site-info" v-if="addressDetail.id">
                <p>
                    收件人:
                    <span class="user">{{ addressDetail.name }}</span>
                </p>
                <p class="tel">{{ addressDetail.phone }}</p>
                <p class="address">
                     收货地址:
                    <span class="location">{{ addressDetail.city + ',' + addressDetail.address }}</span>
                </p>
            </div>
            <div v-else class="site-info add-site">
                <p>还没有收货地址</p>
                <span>立即添加</span>
            </div>
            <div class="site-icon">
               <i class="iconfont">&#xe6e0;</i>
            </div>
        </div>
    </div>
    <div class="line"></div>
    <div class="shop">
        <img :src="'/api/img/store/' + storeDetail.logo">
        <span>{{ goodsDetail.store_name }}</span>
    </div>
    <div class="order-goods">
        <div class="info_img">
            <img :src="'/api/img/goods/' + goodsDetail.logo" alt="">
        </div>
        <div class="info-biref-money">
            <div class="info-biref">
                <p class="info-name">{{ goodsDetail.goods_name }}</p>
                <p class="aui-barter-time">官方担保</p>
            </div>
            <div class="info-money">
                <p class="money">￥{{ orderDetail.price }}</p>
                <p>x<span class="info-num">&nbsp;{{ orderDetail.item }}</span></p>
            </div>
        </div>
    </div>
    <div class="aui-flex">
        <div class="aui-insurance-img">
            <img src="@/assets/img/yj.png" alt="">
        </div>
        <div class="aui-flex-box">
            <div>
                <h4>可赚佣金</h4>
                <p>提交订单后,平台会预支付定金给刷单用户</p>
            </div>
            <h5 class="brokerage">￥{{ orderDetail.earn }}</h5>
        </div>
    </div>
    <div class="data_cont">
        <p class="no-im"><span class="data_title">订单号</span><span class="order_num">{{ orderDetail.order_no }}</span></p>
        <p class="no-im"><span class="data_title">预计返还</span><span class="return">￥{{ (orderDetail.price * orderDetail.item + orderDetail.earn).toFixed(2) }}</span></p>
        <p><span class="data_title">订单总价</span><span class="data_money">￥{{ (orderDetail.price * orderDetail.item).toFixed(2) }}</span></p>
    </div>
    <div class="btn">
        <mt-button type="danger" @click="submitOrder">提交订单</mt-button>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            user: {},
            addressDetail: {},
            orderDetail: {},
            goodsDetail: {},
            storeDetail: {},
            timeMinustes: 0,
            timeSeconds: 0,
            timer: false
        };
    },
    created() {
        this.user = this.$store.state.user;
        this.$http.post('/grab/currentOrder', {userId: this.user.id}, {loading: true}).then(response => {
            if (response.list[0]) {
                this.$set(this, 'orderDetail', response.list[0]);
                this.queryGoods(response.list[0].goods_id);
                this.contTime();
                
                // 查询地址信息
                this.$http.post('/grab/addressList', {userId: this.user.id}, {loading: true}).then(response => {
                    var arr = response.list.filter(item => item.status === 2);
                    if (arr[0]) {
                        this.$set(this, 'addressDetail', arr[0]);
                    }
                }).catch(() => {})
            } else {
                this.expireSet();
            }
        }).catch(() => {})
        
    },
    destroyed() {
       if (this.timer) {
           clearInterval(this.timer)
       } 
    },
    methods: {
        goRoute(val) {
            if (val == 'address') {
                this.$router.push({ path: '/address', query: {from: '/orderdetail'} });
            } else {
                this.$router.push("/" + val);
            }
        },
        expireSet() {
            this.$Toast({
                message: '订单已过期',
                duration: 1500
            })
            this.$router.push("/home");
        },
        contTime() {
            var num = new Date(this.orderDetail.end_time).getTime() - new Date().getTime();
            this.timer = setInterval(() => {
                num -= 1000
                this.timeMinustes = Math.floor(num/(60*1000))
                this.timeSeconds = Math.floor((num % (60*1000)) / 1000)
                if (num <= 1000) {
                    clearInterval(this.timer)
                    this.expireSet();
                }
            }, 1000);
        },
        queryStore(id) {
            this.$http.post('/grab/storeList', {id: id}).then(response => {
                this.storeDetail = response.list[0] || {}
            }).catch(() => {})
        },
        queryGoods(id) {
            this.$http.post('/grab/goodsList', {id: id}, {loading: true}).then(response => {
                var data = response.list[0] || {};
                this.queryStore(data.store_id);
                this.$set(this, 'goodsDetail', data);
            })
        },
        submitOrder() {
            if (!this.addressDetail.id) {
                this.$Toast({
                    message: '请添加收货地址',
                    duration: 1500
                })
                return;
            }
            var num = 0;
            this.$Indicator.open({
                text: '远程主机分配中...',
                spinnerType: 'fading-circle'
            });
            var timer = setInterval(() => {
                num++
                if (num == 3) {
                    this.$Indicator.close();
                } else if (num == 4) {
                    this.$Indicator.open({
                        text: '等待商家系统响应...',
                        spinnerType: 'fading-circle'
                    });
                }
            }, 1000);
            this.$http.post('/grab/submitOrder', {id: this.orderDetail.id, addressId: this.addressDetail.id}).then(response => {
                if (num < 8) {
                    setTimeout(() => {
                        clearInterval(timer);
                        this.goNext();
                    }, (8 - num) * 1000)
                } else {
                    this.goNext();
                }
            }).catch(() => {
                this.$Indicator.close();
                clearInterval(timer);
            })
        },
        goNext() {
            this.$Indicator.close();
            this.$Toast({
                message: '订单交易成功',
                duration: 2500
            })
            this.$router.push("/home");
        }
    }
};
</script>

<style scoped>
.de-header {
  /* height: 200px; */
  background-size: 100% 100%;
  background: #de442c;
  background: linear-gradient(to right, #ff9000, #ff5101);
}
.header-tit {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  /* border-bottom: 1px solid #f1f1f1; */
  background: linear-gradient(to right, #fc9815, #fa5f17);
}
.header-tit i {
  font-size: 22px;
  color: #fff;
}
.header-tit span {
  flex: 1;
  min-width: 0;
  text-align: center;
  color: #fff;
  font-size: 16px;
}
.de-cont {
  padding: 20px;
  color: #fff;
}
.de-cont h6 {
  font-size: 18px;
  line-height: 25px;
  margin-bottom: 6px;
}
.de-cont p {
  font-size: 13px;
}
.site {
    display: flex;
    justify-content: space-between;
    padding: 20px 10px;
}
.site-left {
    width: 40px;
    height: 40px;
    margin-right: 15px;
    margin-top: 9px;
}
.site-left img {
    width: 40px;
    height: 40px;
}
.site-right{
    flex: 1;
    min-width: 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
}
.site-right > .site-info{
    flex: 1;
    min-width: 0;
}
.site-right .add-site{
    /* line-height: 30px; */
    padding-top: 5px;
    font-size: 13px;
    color: #666;
}
.site-right .add-site p{
    font-size: 16px;
    margin-bottom: 5px;
    color: #333;
}
.site-right .site-icon{
    width: 15px;
}
.site-right .address{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.site-right i{
    margin-top: 20px;
    display: block;
    color: #666;
}
.shop {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
}
.shop img{
    width: 40px;
    height: 40px;
    margin-right: 12px;
}
.shop span {
    color: #ffb908;
}
.order-goods{
    background: #ddd;
    display: flex;
    justify-content:space-between;
    padding: 10px;
}
.order-goods img{
    width: 60px;
    height: 60px;
}
.order-goods .info-biref-money{
    flex: 1;
    min-width: 0;
    font-size: 13px;
    height: 63px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
}
.order-goods .info-biref{
    padding: 0 10px;
    height: 63px;
}
.order-goods .info-money{
    text-align: right;
    font-size: 14px;
}
.order-goods .money{
    margin-bottom: 10px;
    color: #de442c;
}
.aui-flex {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #F1F1F1;
}
.aui-flex img{
    width: 25px;
    height: 25px;
    margin-top: 7px;
}
.aui-flex-box{
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
}
.aui-flex-box h4{
    font-size: 14px;
}
.aui-flex-box p{
    font-size: 12px;
    color: #999;
}
.aui-flex-box .brokerage{
    padding-left: 5px;
    color: #de442c;
    line-height: 37px;
}
.data_cont {
    padding-top: 10px;
}
.data_cont p{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding: 0 10px;
    line-height: 30px;
}
.data_cont .no-im{
    color: #666;
}
.btn{
    padding: 0 10px;
}
button{
    width: 100%;
    margin: 30px 0 10px;
    background: #ff5203;
}
.aui-barter-time {
    background: #4CAF50;
    color: #fff;
    width: 70px;
    font-size: 12px;
    padding: 0 10px;
    overflow: hidden;
    border-radius: 3px;
    height: 20px;
    line-height: 20px;
    text-align: center;
}
.info-name{
    height: 40px;
    padding-top: 2px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>