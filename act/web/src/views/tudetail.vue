<template>
    <div class="tudetail">
        <div class="fixed-top">
            <mt-header :title="zodiacObj.title">
                <span @click="$router.back(-1)" slot="left">
                    <mt-button icon="back">返回</mt-button>
                </span>
                <mt-button slot="right" @click="$router.push('/')">
                    <svg t="1600001207746" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1240" width="22" height="22"><path d="M793.738198 503.746012c-7.948019 0-14.411221 6.463202-14.411221 14.411221l0 317.92077c0 34.936697-28.428469 63.365166-63.365166 63.365166L604.033601 899.44317 604.033601 678.821423c0-7.948019-6.441713-14.411221-14.388708-14.411221L432.278819 664.410202c-7.948019 0-14.411221 6.463202-14.411221 14.411221l0 220.62277L305.918923 899.444193c-34.936697 0-63.343677-28.428469-63.343677-63.365166l0-317.92077c0-7.948019-6.441713-14.411221-14.411221-14.411221-7.948019 0-14.389732 6.463202-14.389732 14.411221l0 317.92077c0 50.832735 41.334407 92.187609 92.14463 92.187609l410.04391 0c50.831712 0 92.187609-41.354873 92.187609-92.187609l0-317.92077C808.149419 510.209214 801.68724 503.746012 793.738198 503.746012zM575.233672 899.422703 446.69004 899.422703 446.69004 693.232644l128.543631 0L575.233672 899.422703z" p-id="1241" fill="#ffffff"></path><path d="M936.103626 397.124669l-104.131639-75.069743c-13.625322-9.891278-25.590841-33.211403-25.590841-49.91483L806.381146 148.661831c0-29.367865-23.88806-53.255924-53.234435-53.255924L716.573747 95.405907c-29.324886 0-53.169967 23.88806-53.169967 53.255924l0 41.028439c0 5.284353-1.24434 7.642051-1.375324 7.838525-0.436952 0-2.925632-0.152473-7.380084-3.384074L546.978141 116.455315c-13.057387-9.476839-23.603581-17.118889-25.874297-18.865673-2.793626-2.4017-6.615675-4.0175-10.174734-3.886517-3.341095-0.196475-7.270591 1.440815-10.04375 3.842515-2.489704 1.920746-15.524578 11.376095-30.896684 22.534226L85.863065 397.124669c-11.529591 8.340969-19.10615 20.677948-21.376866 34.761712-2.270716 14.083763 1.070378 28.167526 9.345856 39.587624l14.629185 20.35049c9.825786 13.690814 25.52535 21.50785 43.037189 21.50785l0.021489 0c1.833765 0 3.711532-0.086981 5.567809-0.261966 2.532683-0.240477 4.956895-1.157359 7.031137-2.642177L510.950599 245.741867l366.897228 264.686335c2.073218 1.484817 4.498454 2.4017 7.030114 2.642177 1.877767 0.174985 3.734044 0.261966 5.590322 0.261966 17.577331 0 33.255405-7.839549 42.927695-21.48636l14.694677-20.35049C965.297528 447.651436 959.904705 414.30905 936.103626 397.124669zM924.74902 454.617082l-14.760169 20.459984c-4.149507 5.808286-10.961656 9.236362-18.778692 9.454326L519.510556 216.372979l-0.021489 0.021489c-4.825912-3.51608-12.314467-3.64604-17.315364 0.174985L130.778021 484.531392c-7.839549-0.217964-14.694677-3.64604-18.931165-9.54233l-14.629185-20.394493c-3.799536-5.218862-5.328355-11.659551-4.279467-18.122753 1.025353-6.506181 4.498454-12.161994 9.781784-15.96153l384.16859-277.088806c11.311627-8.209986 18.888186-13.712303 24.040533-17.554818 4.38896 3.231601 10.524704 7.642051 19.126616 13.908778l107.757213 77.776388c8.123005 5.808286 16.266475 8.79941 24.215518 8.79941 15.023158 0 30.176276-11.332093 30.176276-36.660968l0-41.028439c0-13.471826 10.939143-24.433482 24.367991-24.433482l36.572964 0c13.45136 0 24.433482 10.961656 24.433482 24.433482l0 123.478266c0 25.852808 16.463973 58.037834 37.513382 73.257467L919.247726 420.510286C930.164357 428.392814 932.610058 443.699428 924.74902 454.617082z" p-id="1242" fill="#ffffff"></path></svg>
                </mt-button>
            </mt-header>
            <div class="year">
                <ul>
                    <li class="active">2020年</li>
                </ul>
            </div>
            <div class="swiper-wrap">  
                <div class="my-swiper">
                    <ul :style="{width: ballList.length * 70 + 30 + 'px'}">
                        <li v-for="(item, idx) in ballList" :key="idx" @click="changeIssue(idx)">
                            <span class="tab-c" :class="{'active': currentTab == idx}">{{ (item.issue+'').replace('2020', '') }}期</span>
                        </li>
                    </ul>
                </div>
                <div class="s-more" @click="popupVisible = true">
                    <img src="@/assets/img/down.png" alt="">
                </div>
            </div>
        </div>
        <div class="lottoin" v-if="ballList.length && ballList[currentTab].opendBall">
            <div class="lottoin-tit">第<font id="lotteryNumPeriod">{{(ballList[currentTab].issue+'').replace('2020', '')}}</font>开奖结果</div>
            <div class="lottoin-box">
                <ul>
                    <li v-for="(item, idx) in ballList[currentTab].opendBall" :key="idx">
                        <span :class="'lotto-'+item.color">{{item.ball}}</span>
                        <p>{{item.zodiac}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="issue-img" v-if="zodiacObj.type && ballList.length">
            <img 
                :src="'http://images.00858tk.com/zodiac/' + zodiacObj.type + '/' + (ballList[currentTab].issue+'').replace('2020', '') + '_' + zodiacObj.img + '?_=' + currentTime" 
                v-real-img="zodiacObj.type + ',' + ballList[currentTab].issue + ',' + zodiacObj.img"
                alt="">
        </div>
        <div class="h10"></div>
        <div class="nygg">澳彩图库易记网址<font color="#FF0000">00858tk.com</font>请收藏，永不迷路~</div>
        <div class="h10"></div>
        <div class="advert" v-if="advert.id">
            <div class="img-wrap">
                <a :href="advert.url"><img :src="'/api/banner/' + advert.img" alt=""></a>
            </div>
            <div class="h10"></div>
        </div>
        <div class="hot-pl-tit" style="" v-if="hotList.length"><h2>热门评论</h2></div>
        <div class="hot-comment">
            <div class="hot-pl-con" v-for="(item, idx) in hotList" :key="idx">
                <div class="hot-pl-pic1">
                    <img v-if="item.user_tx" :src="'/api/tx/' + item.user_tx">
                    <img v-else src="@/assets/img/tx.jpg">
                </div>
                <div class="hot-pl-per">
                    <h3 class="hot-pl-chr">
                        <label><font style="">{{item.user_name}}</font></label>
                    </h3>
                    <div class="hot-pl-time">
                        <div class="hot-pl-timel">{{ item.date }}</div>
                        <!-- <div class="hot-pl-timer">
                            <img src="https://gy.ws5588.cn/lsm/m5/images/foot-ico1.png">
                            <span class="figPicCommendGoodCount2c9f7d4b742fe1640174307317990219">0</span>
                        </div> -->
                    </div>
                    <div class="hot-pl-detail">
                        <p>{{ item.cont }}</p>
                    </div>
                    <div class="hot-pl-btn">
                        <span @click="goComment(item.user_id)">回复</span>
                    </div>
                    <div class="hot-pl-replay-box" v-if="item.childList.length">
                        <div class="hot-pl-replay" v-for="(vv, idx2) in item.childList" :key="idx2">
                            <div class="hot-pl-replay-tit">
                                <img v-if="vv.user_tx" :src="'/api/tx/' + vv.user_tx">
                                <img v-else src="@/assets/img/tx.jpg">
                                <h3 class="hot-pl-chr2">
                                    <font style="">{{ vv.user_name }}</font>
                                </h3>
                            </div>
                            <div class="hot-pl-replay-con">
                                <span class="hot-pl-mm"><p>{{ vv.cont }}</p></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="hot-pl-tit" style=""><h2>最新评论</h2></div>
        <div>
            <div class="hot-pl-con" v-for="(item, idx) in commentList" :key="idx">
                <div class="hot-pl-pic1">
                    <img v-if="item.user_tx" :src="'/api/tx/' + item.user_tx">
                    <img v-else src="@/assets/img/tx.jpg">
                    <span><label class="">{{commentList.length - idx}}</label>楼</span>
                </div>
                <div class="hot-pl-per">
                    <h3 class="hot-pl-chr">
                        <label><font style="">{{item.user_name}}</font></label>
                    </h3>
                    <div class="hot-pl-time">
                        <div class="hot-pl-timel">{{ item.date }}</div>
                        <!-- <div class="hot-pl-timer">
                            <img src="https://gy.ws5588.cn/lsm/m5/images/foot-ico1.png">
                            <span class="figPicCommendGoodCount2c9f7d4b742fe1640174307317990219">0</span>
                        </div> -->
                    </div>
                    <div class="hot-pl-detail">
                        <p>{{ item.cont }}</p>
                    </div>
                    <div class="hot-pl-btn">
                        <span @click="goComment(item.user_id)">回复</span>
                    </div>
                    <div class="hot-pl-replay-box" v-if="item.childList.length">
                        <div class="hot-pl-replay" v-for="(vv, idx2) in item.childList" :key="idx2">
                            <div class="hot-pl-replay-tit">
                                <img v-if="vv.user_tx" :src="'/api/tx/' + vv.user_tx">
                                <img v-else src="@/assets/img/tx.jpg">
                                <h3 class="hot-pl-chr2">
                                    <font style="">{{ vv.user_name }}</font>
                                    <!-- <div data-v-7567672c="" class="hot-pl-timel">{{ vv.date }}</div> -->
                                </h3>
                            </div>
                            <div class="hot-pl-replay-con">
                                <!-- <span class="hot-pl-hf">回复</span>
                                <img class="hot-pl-pic3" src="/static//upload/attached/image/20200628/20200628124440_469.jpg">
                                <h3 class="hot-pl-chr3"><font style="">天下无敌</font>:</h3> -->
                                <span class="hot-pl-mm"><p>{{ vv.cont }}</p></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-comment" v-if="!commentList.length">暂无评论</div>

        <div class="tkin-foot">
            <div class="tkin-footl">
                <div class="tkin-footl-pic"><img src="@/assets/img/tx.jpg"></div>
                <div class="tkin-footl-input">
                    <input placeholder="说点什么..." @focus="goComment('new')" name="" type="text">
                </div>
            </div>
            <ul class="tkin-footr">
                <li  @click="dianzhang">    
                    <img v-if="iszang" src="@/assets/img/foot-ico1-2.png">
                    <img v-else src="@/assets/img/foot-ico1.png">
                    <span>{{ dzList.length }}</span>
                </li>
                <li>
                    <img src="@/assets/img/foot-ico2.png">
                    <span id="figPicCommendCount">{{ commentAll.length }}</span></li>
                <li @click="changeCollect">
                    <img v-if="isCollect" src="@/assets/img/foot-ico3-2.png">
                    <img v-else src="@/assets/img/foot-ico3.png">
                </li>
                <li @click="popupShareVisible = true">
                    <img src="@/assets/img/foot-ico4.png">
                </li>
            </ul>
        </div>
        <mt-popup v-model="popupVisible" position="bottom" class="issue-wrap">
            <ul class="issue-list">
                <li v-for="(item, idx) in ballList" :key="idx">
                    <span :class="{'active': currentTab == idx}" @click="changeIssue(idx, 'popup')">
                        {{ (item.issue+'').replace('2020', '') }}期
                    </span>
                </li>
            </ul>
        </mt-popup>
        <mt-popup v-model="popupShareVisible" popup-transition="popup-fade" class="share-wrap">
            <div class="fenx dialog shareDialog" style="">
                <div class="close" @click="popupShareVisible = false"><img src="@/assets/img/close.png"></div>
                <div class="tit"><h3>链接分享</h3></div>
                <div class="txt">复制链接发送给你的好友吧!</div>
                <div class="web"><input v-model="curUrl" type="text"></div>
                <div class="btn"><button @click="getCopy">复制链接</button></div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css'
export default {
    data() {
        return {
            zodiacObj: {},
            ballList: [],
            hotList: [],
            commentList: [],
            commentAll: [],
            currentTab: 0,
            currentTime: new Date().getTime(),
            swiperOptions: {
                slidesPerView: 5,
                paginationClickable: true,
                spaceBetween: 0,
                freeMode: true
            },
            popupVisible: false,
            popupShareVisible: false,
            user: {},
            iszang: false,
            dzLoading: false,
            dzList: [],
            advert: {},
            isCollect: false,
            curUrl: ''
        }
    },
    components: {
        Swiper,
        SwiperSlide
    },
    created() {
        var id = this.$route.params.id;
        var user = this.$store.state.user;
        var nowDate = new Date();
        var currHour = nowDate.getHours();
        var et = new Date(nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + " 22:00:00").getTime();
        this.$set(this, 'user', user);
        this.$http.post('/api/am/zodiacType', {id: Number(id)}).then(response => {
            var zodiac = response.data[0] || {};
            var examineDate = new Date(zodiac.examine_date).getTime();
            var noteMore = '';
            if (zodiac.examine_date) {
                if ((currHour >= 22 && examineDate > et) || (currHour < 22 && examineDate > (et - 24 * 60 * 60 * 1000))) {
                    noteMore = {issue: '2020' + zodiac.issue }
                }
            }
            this.$set(this, 'zodiacObj', zodiac);

            this.$http.post('/api/am/noteList', {pageSize: 10000}).then(response => {
                var list = response.data || [];
                var ballData = list.slice(0, list.length - 50);
                for (var i = 0; i < ballData.length; i++) {
                    ballData[i].opendBall = this.$common.ballNum(ballData[i].openCode.split(','));
                }
                if (noteMore) {
                    ballData.unshift(noteMore);
                }
                this.ballList = ballData;
                this.getDianzhangList(id);
                this.getCollect(id);
                this.getCommentList(id);
            }).catch(() => {})
        })
        
        this.getAdvert();
        this.getHotCommentList();
        this.curUrl = window.location.href;
    },
    methods: {
        getAdvert() {
            this.$http.post('/api/am/bannerList', {type: 2}).then(response => {
                this.advert = response.data[0] || {};
            })
        },
        changeIssue(idx, popup) {
            this.currentTab = idx;
            if (popup) {
                if (idx > 2) {
                    document.querySelector('.my-swiper').scrollLeft = 70 * (idx - 2);
                } else {
                    document.querySelector('.my-swiper').scrollLeft = 0;
                }
                this.popupVisible = false;
            }
            var id = this.zodiacObj.id;
            this.getDianzhangList(id);
            this.getCollect(id);
            this.getCommentList(id);
        },
        goComment(type) {
            this.$router.push('/comment/' + this.zodiacObj.id + '/' + this.ballList[this.currentTab].issue + '/' + type);
        },
        getCopy(val) {
            var input = document.createElement('input');
            input.value = this.curUrl;
            document.getElementsByTagName('body')[0].appendChild(input);
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios
                var range = document.createRange();
                range.selectNode(input);
                window.getSelection().addRange(range);
                var successful = document.execCommand('copy');
                if (!successful) {
                    alert('您的浏览器不支持复制点击复制。请手动复制~');
                } else {
                    this.$toast('复制成功');
                }
                window.getSelection().removeAllRanges();
            } else {
                input.select();
                document.execCommand('copy');
                this.$toast('复制成功');
            }
            input.parentNode.removeChild(input);
        },
        getCommentList(zdId) {
            this.$http.post('/api/am/commentList', { pageSize: 10000, examine: 2, zodiac_id: Number(zdId), issue: this.ballList[this.currentTab].issue }, {loading: true}).then(response => {
                var listALl = response.data || [];
                var replyList = listALl.filter(item => item.reply_id !== 0);
                var list = listALl.filter(item => item.reply_id === 0);
                for (var i = 0; i < list.length; i++) {
                    var date = this.$common.formatDate(new Date(list[i].create_date));
                    var childList = replyList.filter(item => {
                        if (item.reply_id == list[i].user_id) { 
                            var cDate = this.$common.formatDate(new Date(item.create_date));
                            item.date = cDate.year + '-' + cDate.month + '-' + cDate.day + ' ' + cDate.h + ':' + cDate.m + ':' + cDate.s;
                            return true
                        } else {
                            return false
                        }
                    })
                    list[i].date = date.year + '-' + date.month + '-' + date.day + ' ' + date.h + ':' + date.m + ':' + date.s;
                    list[i].childList = childList;
                }
                this.commentAll = listALl;
                this.commentList = list;
            }).catch(() => {})
        },
        getHotCommentList() {
            var vm = this;
            this.$http.post('/api/am/commentList', { pageSize: 1, examine: 2, user_id: 31 }).then(response => {
                var parList = response.data || [];
                if (parList.length) {
                    var startTime = vm.formterDate(parList[0].create_date);
                    var endTime = vm.formterDate();
                    this.$http.post('/api/am/commentList', { pageSize: 6, examine: 2, reply_id: 31, startTime: startTime, endTime: endTime }).then(responseReply => {
                        parList[0].date = startTime;
                        parList[0].childList = responseReply.data || [];
                        console.log(responseReply, '===')
                        vm.hotList = parList;
                    })
                } else {
                    vm.hotList = parList;
                }
                
            }).catch(() => {})
        },
        formterDate(date) {
            var getDate = '';
            if (date) {
                getDate = this.$common.formatDate(new Date(date));
            } else {
                getDate = this.$common.formatDate();
            }
            return getDate.year + '-' + getDate.month + '-' + getDate.day + ' ' + getDate.h + ':' + getDate.m + ':' + getDate.s;
        },
        dianzhang() {
            if (this.user.id) {
                if (this.dzLoading) {
                    return
                }
                this.dzLoading = true;
                // params.userId, params.zodiacId, params.userName, params.issue, params.zodiacTitle,
                if (this.iszang) {
                    this.$http.post('/api/am/dlDianzhang', {userId: this.user.id}).then(response => {
                        this.iszang = false;
                        this.dzLoading = false;
                        for (var i = 0; i < this.dzList.length; i++) {
                            if (this.dzList[i].user_id === this.user.id || this.dzList[i].userId === this.user.id) {
                                this.dzList.splice(i,1)
                                break
                            }
                        }
                    }).catch(() => {this.dzLoading = false})
                } else {
                    var params = {
                        userId: this.user.id,
                        zodiacId: this.zodiacObj.id,
                        userName: this.user.nickName,
                        issue: this.ballList[this.currentTab].issue,
                        zodiacTitle: this.zodiacObj.title,
                        zodiacType: this.zodiacObj.type,
                        zodiacImg: this.zodiacObj.img
                    }
                    this.$http.post('/api/am/dianzhang', params).then(response => {
                        this.iszang = true;
                        this.dzLoading = false;
                        this.dzList.push(params);
                    }).catch(() => {this.dzLoading = false})
                }
            } else {
                this.$router.push('/login')
            }
        },
        getDianzhangList(zdId) {
            this.$http.post('/api/am/dianzhangList', { pageSize: 10000, zodiac_id: zdId, issue: this.ballList[this.currentTab].issue }).then(response => {
                var list = response.data.list || [];
                this.dzList = list;
                var ft = list.filter(item => item.user_id == this.user.id);
                if(ft.length) {
                    this.iszang = true
                } else {
                    this.iszang = false
                }
            }).catch(() => {})
        },
        // 收藏相关
        getCollect(zdId) {
            if (!this.user.id) {
                return;
            }
            this.$http.post('/api/am/collectList', { userId: this.user.id, zodiac_id: zdId, issue: this.ballList[this.currentTab].issue}).then(response => {
                var list = response.data.list || [];
                if (list.length) {
                    this.isCollect = true
                } else {
                    this.isCollect = false
                }
            }).catch(() => {})
        },
        changeCollect() {
            if (this.user.id) {
                if (this.isCollect) {
                    this.$http.post('/api/am/dlCollect', {userId: this.user.id}).then(response => {
                        this.isCollect = false;
                    }).catch(() => {})
                } else {
                    var params = {
                        userId: this.user.id,
                        zodiacId: this.zodiacObj.id,
                        userName: this.user.nickName,
                        issue: this.ballList[this.currentTab].issue,
                        zodiacTitle: this.zodiacObj.title,
                        zodiacType: this.zodiacObj.type,
                        zodiacImg: this.zodiacObj.img
                    }
                    this.$http.post('/api/am/addCollect', params).then(response => {
                        this.isCollect = true;
                    }).catch(() => {})
                }
            } else {
                this.$router.push('/login')
            }
        }
    }
}
</script>

<style scoped>
@import url(../assets/css/tudetail.css);
</style>