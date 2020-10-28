<template>
    <div class="home">
        <header>
            <div class="logo"><img src="@/assets/img/logo.png"></div>
            <div class="search">
                <span></span><input  @focus="$router.push('/search/col')" placeholder="搜索..." name="" type="text">
            </div>
            <div class="user" @click="$router.push('/my')"><img src="@/assets/img/user.png"></div>
        </header>

        <div class="banner" :style="{'height': bannerWi + 'px'}">
            <mt-swipe :auto="4000">
                <mt-swipe-item v-for="item in bannerList" :key="item.id">
                    <a :href="item.url">
                        <img :src="'/api/banner/' + item.img" alt="">
                    </a>
                </mt-swipe-item>
                <!-- <mt-swipe-item>
                    <img src="@/assets/img/banner2.jpg" alt="">
                </mt-swipe-item>
                <mt-swipe-item>
                    <img src="@/assets/img/banner3.jpg" alt="">
                </mt-swipe-item> -->
            </mt-swipe>
        </div>
        <div class="notice">
            <div class="notice-l"><img src="@/assets/img/notice.png"></div>
            <div class="notice-r">
                <marquee scrollamount="4">{{ noticeList[0] ? noticeList[0].cont : '暂无公告' }}</marquee>
            </div>
        </div>
        <div class="h10"></div>
        <div class="nav">
            <ul>
                <li><div @click="$router.push('/tu/col')"><img src="@/assets/img/navico1.png"><p>2020年彩图</p></div></li>
                <li><div @click="$router.push('/tu/black')"><img src="@/assets/img/navico2.png"><p>2020年黑白</p></div></li>
                <li><div @click="goZhibo"><img src="@/assets/img/navico3.png"><p>开奖直播</p></div></li>
                <li><div @click="$router.push('/opend')"><img src="@/assets/img/navico4.png"><p>开奖记录</p></div></li>
                <!-- <li><div><img src="@/assets/img/navico5.png"><p>高手资料</p></div></li> -->
            </ul>
        </div>
        <div class="h10"></div>
        <div class="kj-lotto">
            <div class="kj-lotto-tit">
                <div class="kj-lotto-tit1">澳门六合开奖直播第 <span class="qs">{{ opendObj.issue }}</span> 期开奖结果</div>
                <div class="kj-lotto-tit2">
                    <span class="qs">历史记录</span>
                    <span class="time-item">
                        <strong>{{ downTime }}</strong>
                    </span>
                </div>
            </div>
            <div class="kj-lotto-box" v-if="isOpend">
                <ul>
                    <li v-for="(item, idx) in opendBall" :key="idx" :class="'last-'+item.color">
                        <div>
                            <img v-if="item.color === 'blue'" src="@/assets/img/blue.png" alt="">
                            <img v-else-if="item.color === 'green'" src="@/assets/img/green.png" alt="">
                            <img v-else src="@/assets/img/red.png" alt="">
                            <span>{{item.ball}}</span>
                        </div>
                        <span class="zodiac">{{item.zodiac}}</span>
                    </li>
                </ul>
            </div>
            <div class="kj-lotto-box opening" v-else>
                <ul>
                    <li><div>开</div></li>
                    <li><div>奖</div></li>
                    <li><div>中</div></li>
                    <li><div>敬</div></li>
                    <li><div>请</div></li>
                    <li><div>等</div></li>
                    <li><div>待</div></li>
                </ul>
            </div>
            <div class="kj-lotto-foot">
                <div class="kj-lotto-foot1">
                    第 <span class="qs">{{ Number(opendObj.issue) + 1 }}</span> 期:
                    <span>{{ endTime.month }}</span>月
                    <span>{{ endTime.day }}</span>日 星期<span>{{ endTime.week }}</span> 
                    <span>21点35分</span>
                </div>
                <div class="kj-lotto-foot2" @click="getNote('new')">刷 新</div>
            </div>
        </div>
        <div class="h10"></div>
        
        <!-- 瀑布流 -->
        <div class="full">
            <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="isLoading" infinite-scroll-distance="10">
                <li class="wrap" v-for="(item, idx) in waterfallList" :key="idx">
                    <div class="box" v-for="(vv, idx2) in item" :key="idx2" @click="$router.push('/tudetail/' + vv.id)">
                        <img :src="vv.pic" v-real-img="vv.type + ',' + vv.issue + ',' + vv.img" alt="">
                        <span>{{ vv.title }}</span>
                    </div>
                </li>
            </ul>
        </div>
        <!--显示加载中转菊花-->
        <div v-if="!noMore">
            <div class="loading-box tc" v-if="isLoading">
                <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
                <span class="loading-more-txt">加载中...</span>
            </div>
        </div>
        <div class="no-more" v-if="noMore">没有更多了~</div>

        <my-footer></my-footer>
    </div>
</template>

<script>
var timer = null;
var timerNOte = null;
var wi = document.getElementById('app').clientWidth;
export default {
    data() {
        return {
            bannerWi: wi * (220 / 750),
            waterfallList: [],
            bannerList: [],
            noticeList:[],
            opendBall: [],
            opendObj: {},
            endTime: {},
            downTime: '',
            isLoading: true,
            noMore: false,
            isOpend: false,
            fullIdx: 0,
            page: 1
        }
    },
    created() {
        var len = wi >= 600 ? 3 : 2;
        for (var i = 0; i < len; i++) {
            this.waterfallList[i] = []
        }
        this.getBanner();
        this.getNotice();
        this.getNote(false, true);
        this.getCountDown();
    },
    destroyed() {
        if (timer) {
            clearInterval(timer);
        }
        if (timerNOte) {
            clearInterval(timerNOte);
        }
    },
    methods: {
        getBanner() {
            this.$http.post('/api/am/bannerList', {type: 1}).then(response => {
                this.bannerList = response.data;
            })
        },
        getNotice() {
            this.$http.post('/api/am/noticeList').then(response => {
                this.noticeList = response.data || []
            })
        },
        getZodiac() {
            var arr = JSON.parse(JSON.stringify(this.waterfallList));
            var qishu = (this.opendObj.issue + '').replace('2020', '');
            this.isLoading = true;
            this.$http.post('/api/am/zodiacList', {pageSize: 14, page: this.page}).then(response => {
                var list = response.data || [];
                var nowDate = new Date();
                var currHour = nowDate.getHours();
                var et = new Date(nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + " 22:00:00").getTime();
                for (var i = 0; i < list.length; i++) {
                    // debugger
                    var examineDate = new Date(list[i].examine_date).getTime();
                    // /zodiac/black/242_075.jpg
                    
                    list[i].pic = 'http://images.00858tk.com/zodiac/' + list[i].type + '/' + qishu + '_' + list[i].img;
                    if (list[i].examine_date) {
                        if ((currHour >= 22 && examineDate > et) || (currHour < 22 && examineDate > (et - 24 * 60 * 60 * 1000))) {
                            list[i].pic = 'http://images.00858tk.com/zodiac/' + list[i].type + '/' + list[i].issue + '_' + list[i].img;
                        } else {
                            list[i].issue = qishu;
                        }
                    } else {
                        list[i].issue = qishu;
                    }
                    arr[this.fullIdx].push(list[i]);
                    this.fullIdx += 1;
                    if (this.fullIdx === arr.length) {
                        this.fullIdx = 0;
                    }
                }
                
                this.$set(this, 'waterfallList', arr);
                if (list.length >= 14) {
                    this.isLoading = false;
                    this.page += 1
                } else {
                    this.noMore = true;
                }
            })
        },
        getCountDown() {
            var vm = this;
            // var downTime = {h:[], m: [], s: []}
            var downTime = this.$common.countDown();
            this.downTime = downTime.h[0] + downTime.h[1]+ ':' + downTime.m[0] + downTime.m[1] + ':' + downTime.s[0] + downTime.s[1];
            var total = Number(downTime.h[0]) + Number(downTime.h[1]) + Number(downTime.m[0])+ Number(downTime.m[1])+ Number(downTime.s[0]) + Number(downTime.s[1]);
            if (total === 0) {
                setTimeout(function() {
                    vm.getNote();
                }, 3000)
            }
            timer = setTimeout(function () {
                vm.getCountDown()
            }, 1000)
        },
        getNote(refresh, pageFirst) {
            var vm = this;
            var dateObj = '';
            var date = new Date();
            var et = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " 21:35:00");
            if (et.getTime() < date.getTime()) {
                var paramsT = date.getTime() + (24 * 60 * 60 * 1000);
                dateObj = this.$common.formatDate(new Date(paramsT));
            } else {
                dateObj = this.$common.formatDate();
            }
            if (timerNOte) {
                clearInterval(timerNOte);
            }
            var endTime = {year: dateObj.year, month: dateObj.month, day:dateObj.day, week: dateObj.w};
            this.$set(this, 'endTime', endTime);
            this.$http.post('/api/am/noteList', {pageSize: 1, refresh: refresh}).then(response => {
                var ballData = response.data[0] || {};
                var openCode = ballData.openCode || '';
                
                var openDate = new Date(ballData.create_date);
                if (et.getTime() < date.getTime() && openDate.getDate() !== date.getDate()) {
                    this.isOpend = false;
                    ballData.issue = Number(ballData.issue) + 1;
                    timerNOte = setTimeout(() => {
                        vm.getNote();
                    }, 18000)
                } else {
                    this.isOpend = true;
                }
                this.$set(this, 'opendObj', ballData);
                this.opendBall = this.$common.ballNum(openCode.split(','));
  
                if (pageFirst) {
                    this.getZodiac();
                }
                // debugger
            }).catch(() => {})
        },
        loadMore() {
            if (!this.opendObj.issue) return;
            this.getZodiac();
        },
        goZhibo() {
            window.open('https://00858kj.com/#/pc/home')
        }
    }
}
</script>

<style scoped>
@import url(../assets/css/home.css);
</style>