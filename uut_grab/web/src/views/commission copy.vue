<template>
    <div class="grabnotes">
        <my-header title="团队佣金" bkUrl="/my"></my-header>
        <div class="query">
            <span class="start date-txt" @click="isShowRebates = true">2301-23-12</span>
            <span class="divider">至</span>
            <span class="end date-txt" @click="isShowRebates = true">2301-23-12</span>
            <span class="refersh">
                <i class="iconfont">&#xe683;</i>
                &nbsp;&nbsp;重选
            </span>
        </div>
        <mt-popup class="agent-rebate-popup" ref="rebatesPopup" v-model="isShowRebates" position="bottom">
            <div class="btn-group">
                <span class="btn cancle" @click.stop="isShowRebates = false">取消</span>
                <span class="btn right" @click.stop="setRebates">确定</span>
            </div>
            <mt-picker :slots="slots" ref="picker" @change="onValuesChange"></mt-picker>
        </mt-popup>
        <ul class="order-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
            <li>
                <div class="order-money">
                    <span>2020-03-09&nbsp;团队收益总额：</span>
                    <span class="money">67673.87元</span>
                </div>
                <div class="order-level">
                    <div class="one">
                        <span>1级:</span>
                        <i>5623.23</i>
                    </div>
                    <div class="two">
                        <span>2级:</span>
                        <i>5623.23</i>
                    </div>
                    <div class="three">
                        <span>3级:</span>
                        <i>5623.23</i>
                    </div>
                </div>
            </li>
            <li>
                <div class="order-money">
                    <span>2020-03-09&nbsp;团队收益总额：</span>
                    <span class="money">67673.87元</span>
                </div>
                <div class="order-level">
                    <div class="one">
                        <span>1级:</span>
                        <i>5623.23</i>
                    </div>
                    <div class="two">
                        <span>2级:</span>
                        <i>5623.23</i>
                    </div>
                    <div class="three">
                        <span>3级:</span>
                        <i>5623.23</i>
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="loading" class="loading-more">
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
            isShowRebates: false,
            slots: [
                {
                flex: 1,
                values: [new Date().getFullYear()+'年'],
                className: 'slot1',
                textAlign: 'right'
                }, {
                flex: 1,
                values: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
                className: 'slot2',
                 textAlign: 'center'
                }, {
                flex: 1,
                values: ['01日', '02日', '03日', '04日', '05日', '06日', '07日', '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日'],
                className: 'slot3',
                textAlign: 'left'
                }
            ]
        }
    },
    methods: {
       loadMore() {
            this.loading = true;
            console.log(2657)
            // setTimeout(() => {
            //     let last = this.list[this.list.length - 1];
            //     for (let i = 1; i <= 10; i++) {
            //     this.list.push(last + i);
            //     }
            //     this.loading = false;
            // }, 2500);
        },
        onValuesChange(picker, values, ee) {
            console.log('=======', values[0], values[1], ee)
            // if (values[0] > values[1]) {
            //     picker.setSlotValue(1, values[0]);
            // }
        },
        setRebates () {
            if (this.currentRebate) {
                let grounpName = /\((\d*)\)/.test(this.currentRebate.values[0]);
                this.groupSlider.currentValue = RegExp.$1;
                this.bonusGroupName = RegExp.$1;
            }
            this.isShowRebates = false
        },
    },
    created() {
       
    }
}
</script>

<style scoped>
.query{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 10px solid #f1f1f1;
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
    border-radius: 15px;
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
    border-radius: 15px;
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

.order-list li{
    border-bottom: 10px solid #f1f1f1;
    padding: 20px 10px;
}
.order-money{
    /* display: flex;
    justify-content: space-between; */
    font-size: 18px;
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




.loading-more{
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background: #f1f1f1;
    color: #333;
    font-size: 14px;
}

</style>