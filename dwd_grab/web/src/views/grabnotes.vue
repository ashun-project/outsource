<template>
    <div class="grabnotes">
        <my-header title="抢单记录" :bkUrl="gbRouter"></my-header>
        <div class="tabs">
            <span :class="{active: type === 0}" @click="changeType(0)">待处理</span>
            <span :class="{active: type === 1}" @click="changeType(1)">已冻结</span>
            <span :class="{active: type === 2}" @click="changeType(2)">已完成</span>
        </div>
        <ul class="order-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
            <li v-for="item in list" :key="item.id">
                <div class="order_num">{{ item.order_no }}</div>
                <div class="order_info">
                    <div class="info_img">
                        <img :src="'/api/img/goods/' + item.logo" alt="">
                    </div>
                    <div class="money-brief">
                        <div class="info-brief">
                            <p class="brief">{{ item.goodsName }}</p>
                            <p class="store">{{ item.storeName }}</p>
                        </div>
                        <div class="info_money">
                            <p class="money">￥{{ item.price }}</p>
                            <p class="money">￥{{ item.earn }}</p>
                            <p class="manys">x<span class="info_num">{{ item.item }}</span></p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="noMore && list.length > 0" class="loading-more">
            <span>没有更多了</span>
        </div>
        <div v-if="(list.length < 1 && noMore)" class="loading-more">
            <span>没有订单</span>
        </div>
        <div v-if="loading && !noMore" class="loading-more">
            <mt-spinner type="fading-circle" :size="20"></mt-spinner>
            <span>&nbsp;&nbsp;&nbsp;加载中...</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            gbRouter: '/my',
            noMore: false,
            list: [],
            type: 0,
            page: 1,
            user: {}
        }
    },
    created() {
        var from = this.$route.query.from;
        if (from) {
            this.gbRouter = from;
        }
        this.user = this.$store.state.user;
        // this.getList();
    },
    methods: {
       loadMore() {
            this.getList();
        },
        changeType(type) {
            if (type === this.type) {
                return
            }
            this.type = type;
            this.noMore = false;
            this.loading = false;
            this.list = [];
            this.page = 1;
            this.getList();
        },
        getList() {
            var url = '/grab/orderList';
            if (this.type === 0) {
                url = '/grab/currentOrder';
            }
            this.loading = true;
            this.$http.post(url, { status: this.type, userId: this.user.id, page: this.page }).then(response => {
                var orderList = response.list || [];
                var goodsList = response.goodsList || [];
                for (var i = 0; i < orderList.length; i++) {
                    var obj = orderList[i];
                    var goods = goodsList.filter(item => item.id === obj.goods_id)[0] || {};
                    obj.goodsName = goods.goods_name;
                    obj.storeName = goods.store_name;
                    obj.logo = goods.logo;
                    this.list.push(obj);
                }
                this.page += 1;
                setTimeout(() => {
                    if (orderList.length < 10) {
                        this.noMore = true
                    } else {
                        this.loading = false;
                    }
                }, 500)
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
.tabs{
    font-size: 14px;
    color: #907878;
    border-bottom: 1px solid #eeeeee;
    line-height: 40px;
    height: 40px;
}
.tabs span{
    display: block;
    float: left;
    width: 33.33%;
    text-align: center;
}
.tabs span.active{
    border-bottom: 1px solid #de442c;
    color: #de442c;
}
.order-list li{
    border-bottom: 10px solid #f1f1f1;
    padding: 10px;
}
.order_num{
    line-height: 30px;
    text-align: left;
    width: 100%;
    margin-bottom: 10px;
}
.order_info{
    display: flex;
    justify-content: space-between;
}
.order_info .info_img{
    width: 60px;
    height: 60px;
}
.order_info img{
    width: 60px;
    height: 60px;
    float: left;
}
.money-brief{
    display: flex;
    justify-content: space-between;
    flex: 1;
    min-width: 0;
    padding-left: 10px;
}
.info-brief {
    flex: 1;
    min-width: 0;
}
.info-brief .brief{
    font-size: 12px;
    height: 34px;
    overflow: hidden;
}
.info-brief .store{
    font-size: 14px;
    color: #de442c;
    margin-top: 5px;
}
.info_money{
    width: 66px;
    text-align: right;
    font-size: 13px;
    color: #de442c;
}
.info_money .manys{
    margin-top: 5px;
    color: #666;
}
.info_money .info_num{
    font-size: 15px;
}
.loading-more{
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background: #f1f1f1;
    color: #333;
    font-size: 14px;
    width: 100%;
}

</style>