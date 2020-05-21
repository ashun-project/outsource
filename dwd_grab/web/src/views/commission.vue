<template>
    <div class="grabnotes">
        <my-header title="团队佣金" bkUrl="/my"></my-header>
        <div class="p-top">
             <div class="total">
                <b v-if="queryDate === today">今日</b>
                <b v-else>{{queryDate}}</b>
                &nbsp;团队收益总额:&nbsp;
                <span>{{ total.toFixed(2) }}元</span>
            </div>
            <div class="query">
                <span class="start date-txt" @click="isShowRebates = true">{{ queryDate }}</span>
                <span class="yesterday sel" @click="getList(1)">今日</span>
                <span class="today sel" @click="getList(2)">昨日</span>
                <span class="refersh" @click="refersh">
                    <i class="iconfont">&#xe683;</i>
                    &nbsp;&nbsp;重置
                </span>
            </div>
        </div>
        <ul class="order-list">
            <li v-for="(item, idx) in list" :key="idx">
                <div class="order-money">
                    <span>{{ item.level }}级代理:&nbsp;</span>
                    <span class="money">*******{{ item.phone }}</span>
                </div>
                <div class="order-level">
                    <div class="one">
                        <span>交易金额:</span>
                        <i>{{ item.amount }}</i>
                    </div>
                    <div class="two">
                        <span>代理收益:</span>
                        <i>{{ item.earn }}</i>
                    </div>
                    <div class="three">
                        <span>我的收益:</span>
                        <i>{{ item.profit.toFixed(4) }}</i>
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="loading" class="loading-more">
            <mt-spinner type="fading-circle" :size="20"></mt-spinner>
            <span>&nbsp;&nbsp;&nbsp;加载中...</span>
        </div>
        <div v-if="(!loading && list.length < 1)" class="no-data">
            <span>没有数据</span>
        </div>
        <mt-popup class="agent-rebate-popup" ref="rebatesPopup" v-model="isShowRebates" position="bottom">
            <div class="btn-group">
                <span class="btn cancle" @click.stop="isShowRebates = false">取消</span>
                <span class="btn right" @click.stop="setRebates">确定</span>
            </div>
            <mt-picker :slots="slots" ref="picker" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
var dateArr = []
export default {
    data() {
        var date = new Date().getTime();
        for (var i = 0; i < 30; i++) {
            var seconds = date - (i * 24 * 60 * 60 * 1000);
            var str = this.$common.formatDate(seconds, true);
            dateArr.push(str)
        }
        return {
            loading: true,
            isShowRebates: false,
            queryDate: dateArr[0],
            today: dateArr[0],
            list: [],
            total: 0,
            user: {},
            slots: [
                {
                    flex: 1,
                    values: dateArr,
                    className: 'slot1',
                    textAlign: 'center'
                }
            ]
        }
    },
    created() {
        this.user = this.$store.state.user;
        this.getList();
    },
    methods: {
        onValuesChange(picker, values, ee) {
            
        },
        refersh() {
            this.queryDate = dateArr[0];
            this.getList();
        },
        setRebates () {
            var value = this.$refs.picker.getSlotValue(0);
            if (value !== this.queryDate) {
                this.queryDate = value;
                this.getList();
            }
            this.isShowRebates = false
        },
        getList(num) {
            if (num) {
                this.queryDate = dateArr[num-1]
            }
            this.$http.post('/grab/commissionList', { user: this.user, date: this.queryDate.replace(/-/g, '') }).then(response => {
                var result = response.result;
                this.list = result.list;
                this.total = result.total;
                this.loading = false;
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
.p-top{
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
    background: #fff;
}
.total{
    line-height: 30px;
    padding: 10px 11px;
    font-size: 16px;
    border-bottom: 10px solid #f1f1f1;
}
.total span{
    color: #de442c;
}
.query{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #f1f1f1;
    /* border-bottom: 1px solid #eee; */
    line-height: 32px;
}
.query span{
    display: block;
}
.query .date-txt{
    flex: 1;
    font-size: 13px;
    padding: 0 10px;
    height: 32px;
    background-color: #f2f2f2;
    border-radius: 3px;
    min-width: 0;
    text-align: center;
}
.query .divider{
    padding: 0 10px;
}
.query .refersh{
    padding: 0 15px;
    font-size: 14px;
    background: #de442c;
    height: 32px;
    border-radius: 3px;
    color: #FFF;
    margin-left: 10px;
    overflow: hidden;
}
.query .refersh i{
    font-size: 18px;
    float: left;
}
.btn-group{
    color: #333;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
}
.btn-group span{
    width: 50%;
    text-align: center;
}
.btn-group .right{
    /* border-left: 1px solid #eee; */
    color: #26a2ff;
}

.order-list{
    padding-top: 113px;
}
.order-list li{
    border-bottom: 10px solid #f1f1f1;
    padding: 20px 10px;
}
.order-money{
    /* display: flex;
    justify-content: space-between; */
    font-size: 15px;
    color: rgb(85, 85, 85);
}
.order-money .money{
    color: #de442c;
}
.order-level{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #999;
    padding-top: 20px;
}
.order-level > div i{
    color: #666;
}
.order-level > div{
    /* width: 33.33%; */
    /* text-align: center; */
}
.sel{
    padding: 0 10px;
    background: #f2f2f2;
    margin-left: 10px;
    border-radius: 3px;
    font-size: 14px;
}



.loading-more{
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background: #f1f1f1;
    color: #333;
    font-size: 14px;
}
.no-data{
    text-align: center;
    line-height: 60px;
}
</style>