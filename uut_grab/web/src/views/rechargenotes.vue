<template>
    <div class="rechargenotes">
        <my-header title="充值记录" bkUrl="/my"></my-header>
       
        <ul class="cell-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
            <li v-for="item in list" :key="item.id" 
                :class="{succsee: item.status === 2, err: item.status === 3}" 
                @click="goRoute(item.id)">
                <div class="info">
                    <span class="title-txt">{{ item.recharge_type | getType }}&nbsp;{{ item.amount.toFixed(2) }}元</span>
                    <span class="detail-txt">{{ formatDate(item.create_date) }}</span>
                </div>
                <div class="status">
                    <span v-if="item.status === 1">审核中...</span>
                    <span v-else-if="item.status === 2">充值成功</span>
                    <span v-else>充值失败</span>
                    <i class="iconfont">&#xe6e0;</i>
                </div>
            </li>
        </ul>
        <div v-if="noMore && list.length > 8" class="loading-more">
            <span>没有更多了</span>
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
            noMore: false,
            user: {},
            page: 1,
            list: []
        }
    },
    filters: {
        getType(num) {
            var typelist = ['系统操作', '银行卡转账', '微信充值', '支付宝充值'];
            return typelist[num];
        }
    },
    methods: {
       loadMore() {
            this.loading = true;
            this.$http.post('/grab/rechargeList', { userId: this.user.id, page: this.page }).then(response => {
                for(var i = 0; i < response.list.length; i++) {
                    this.list.push(response.list[i])
                }
                this.page += 1;
                setTimeout(() => {
                    if (response.list.length < 10) {
                        this.noMore = true
                    } else {
                        this.loading = false;
                    }
                }, 500)
            }).catch(() => {})
        },
        goRoute(val) {
            this.$router.push('/rechargedetail/' + val)
        },
        formatDate(date) {
            return this.$common.formatDate(date)
        }
    },
    created() {
        this.user = this.$store.state.user;
    }
}
</script>

<style scoped>
.rechargenotes{
    width: 100%;
}
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
.cell-list li:active{
    background: #faeaea;
}
.cell-list li div .title-txt{
    display: block;
    color: #333;
    font-size: 16px;
    margin-bottom: 8px;
}
.cell-list li div .detail-txt{
    font-size: 14px;
    color: #999;
}
.cell-list li .status {
    display: flex;
    align-items: center;
}
.cell-list li .status i{
    color: #666;
    font-size: 14px;
    display: block;
    padding-top: 2px;
    padding-left: 8px;
}
.cell-list li .status span{
    font-size: 13px;
    color: #666;
}
.cell-list .err .status span{
    color: #de442c;
}
.cell-list .succsee .status span{
    color: #009200;
}
.loading-more{
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background: #f1f1f1;
    color: #333;
    font-size: 14px;
}

</style>