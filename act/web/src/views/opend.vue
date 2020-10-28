<template>
    <div class="opend">
        <mt-header title="开奖记录">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <div class="lotto" v-for="item in ballList" :key="item.id">
            <div class="lotto-tit">
                <div class="lotto-tit1">第 <font color="#0084ff">{{item.issue}}</font> 期开奖结果</div>
                <div class="lotto-tit2">{{item.date}}</div>
            </div>
            <div class="lotto-box">
                <ul>
                    <li class="lotto-ball" v-for="(vv, idx) in item.opendBall" :key="idx">
                        <span :class="'lotto-' + vv.color">{{vv.ball}}</span><p>{{vv.zodiac}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="lotto">
            <div class="lotto-tit">
                <div class="lotto-tit1">第 <font color="#0084ff">2020224</font> 期开奖结果</div>
                <div class="lotto-tit2">2020年08月20日</div>
            </div>
            <div class="lotto-box">
                <ul>
                    <li class="lotto-ball"><span class="lotto-blue">37</span><p>鼠</p></li>
                    <li class="lotto-ball"><span class="lotto-blue">20</span><p>蛇</p></li>
                    <li class="lotto-ball"><span class="lotto-green">27</span><p>狗</p></li>
                    <li class="lotto-ball"><span class="lotto-green">43</span><p>马</p></li>
                    <li class="lotto-ball"><span class="lotto-red">35</span><p>虎</p></li>
                    <li class="lotto-ball"><span class="lotto-blue">48</span><p>牛</p></li>
                    <li class="lotto-jia">+</li>
                    <li class="lotto-ball"><span class="lotto-red">08</span><p>蛇</p></li>
                </ul>
            </div>
        </div> -->

        <ul class="indexed-list">
        </ul>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            ballList: []
        }
    },
    methods: {
        getData() {
            this.$http.post('/api/am/noteList', {pageSize: 10000}).then(response => {
                var ballData = response.data || [];
                for (var i = 0; i < ballData.length; i++) {
                    var openCode = ballData[i].openCode || '';
                    var openTime = ballData[i].openTime.replace(/-/g, '/');
                    var cDate = new Date(openTime);
                    ballData[i].opendBall = this.$common.ballNum(openCode.split(','));
                    ballData[i].date = cDate.getFullYear() + '年' + (cDate.getMonth() + 1) + '月' + cDate.getDate() + '日';
                }
                this.$set(this, 'ballList', ballData);
            }).catch(() => {})
        }
    },
    created() {
       this.getData();
    }
}
</script>

<style scoped>
.lotto {
    padding: 15px 10px;
    box-sizing: border-box;
    text-align: center;
    background: #fff;
}
.lotto font{
    font-weight: 600;
}
.lotto .lotto-tit {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.lotto .lotto-tit2 {
    color: #999;
}
.lotto .lotto-box ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.lotto .lotto-box ul li.lotto-ball {
    margin-left: 4px;
    padding: 5px;
    border: solid 1px #e5e5e5;
    border-radius: 5px;
    position: relative;
}
.lotto .lotto-box ul li.lotto-ball:nth-child(1) {
    margin-left: 0;
}
.lotto .lotto-box ul li:nth-child(6){
    margin-right: 22px;
}
.lotto .lotto-box ul li:nth-child(6)::after {
    content: '+';
    font-size: 18px;
    position: absolute;
    top: 50%;
    right: -20px;
    margin-top: -15px;
    font-weight: 600;
}
.lotto .lotto-box ul li.lotto-ball span {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    background-size: 100% 100%!important;
}
.lotto .lotto-box ul li.lotto-ball p {
    margin-top: 5px;
    font-size: 13px;
}
</style>