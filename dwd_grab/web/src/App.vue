<template>
  <div id="app">
    <transition :name="'vux-pop-' + direction">
      <router-view></router-view>
    </transition>
    <div v-if="footNav" style="height:50px"></div>
    <div v-if="footNav" class="foot-nav">
      <ul>
        <li v-for="item in menu" :key="item.url" :class="{ qiandan: item.cls, active: currentUrl === item.url }" @click="grabOrder(item.url)">
          <div>
            <p v-html="item.icon"></p>
            <span>{{ item.name }}</span>
          </div>
        </li>
        <!-- <li>
          <p><i class="iconfont">&#xe640;</i></p>
          <span>商城</span>
        </li>
        <li class="qiandan">
          <div>
            <p><i class="iconfont">&#xe6cb;</i></p>
            <span>抢单</span>
          </div>
        </li>
        <li>
          <p><i class="iconfont">&#xe645;</i></p>
          <span>客服</span>
        </li>
        <li>
          <p><i class="iconfont">&#xe64f;</i></p>
          <span>我的</span>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            footNav: false,
            currentUrl: '',
            menu: [
                {name: '首页', icon: '<i class="iconfont">&#xe61d;</i>', url: '/home'},
                {name: '优惠券', icon: '<i class="iconfont">&#xe640;</i>', url: '/goods',},
                {name: '抢单', icon: '<i class="iconfont">&#xe6cb;</i>', url: '/order', cls: true},
                {name: '客服', icon: '<i class="iconfont">&#xe645;</i>', url: '/service'},
                {name: '我的', icon: '<i class="iconfont">&#xe64f;</i>', url: '/my'}
            ]
        }
    },
    computed: {
        direction() {
            return this.$store.state.direction
        }
    },
    watch:{
        $route(to, from){
            this.footNav = to.meta.nav;
            this.currentUrl = to.path;
            setTimeout(() => {
                this.$store.commit('directionChange', 'in');
            }, 2000)
        }
    },
    created() {
        this.footNav = this.$route.meta.nav;
        this.currentUrl = this.$route.path;
    },
    methods: {
        grabOrder(url) {
            if (this.$route.path === url) return;
            if (url === '/order') {
                this.goOrder();
                return;
            }
            this.$router.push(url)
        },
        goOrder() {
            var user = this.$store.state.user;
            var store = this.$store.state.store;
            var storeList = store.filter(item => item.status === 2);
            var frozenAmount = this.$store.state.frozenAmount;
            var amount = user.amount - frozenAmount;
            var selected = '';
            storeList.sort(function (a, b) {
                return b.min_amount - a.min_amount;
            })
            for (var i = 0; i < storeList.length; i++) {
                if (amount >= storeList[i].min_amount) {
                    selected = storeList[i];
                    break
                }
            }
            if (!selected) {
                this.$Toast({
                    message: '余额不足，请充值',
                    duration: 1500
                })
                return
            }
            this.$http.post('/grab/currentOrder', {userId: user.id}, {loading: true}).then(response => {
                if (response.list[0]) {
                    this.$Toast({
                        message: '你有未完成的订单',
                        duration: 1500
                    })
                    this.$router.push("/orderdetail");
                } else {
                    this.$router.push("/order/" + selected.id);
                }
            }).catch(() => {})
        }
    }
}
</script>

<style>
@import './assets/fonts/font.css';
@import './assets/css/common.css';
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif;
  font-style: normal;
  list-style: none;
}
html,body,#app{
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 750px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}
#app > div{
    width: 100%;
}
.line{
  height: 10px;
  width: 100%;
  background: #f2f2f2;
}
/* 底部菜单 */
.foot-nav ul{
  width: 100%;
  height: 50px;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 -5px 5px rgba(39, 0, 0, 0.03);
  border-top: 1px solid #de442c;
}
.foot-nav ul li{
  width: 20%;
  text-align: center;
  font-size: 12px;
  color: #8a716d;
}
.foot-nav ul li.active{
  color: #de442c;
}
.foot-nav ul li:active{
  color: #de442c;
}
.foot-nav ul li p{
  height: 28px;
  padding-top: 5px;
  overflow: hidden;
}
.foot-nav ul li p i{
  font-size: 20px;
}
.foot-nav ul li span{
  display: block;
}
.foot-nav .qiandan div{
  width: 55px;
  max-width: 100%;
  height: 55px;
  border-radius: 50%;
  background: #fff;
  color: #de442c;
  margin: -18px auto 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.29);
}
.foot-nav .qiandan div:active{
  background: #993323;
}


.video-box #video > div{
    display: flex;
    align-items: center;
}

/* 过度效果 */
/* .slide-left-enter-active {
  transition: all .3s ease;
}
.slide-left-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-left-enter, .slide-left-leave-to{
  transform: translateX(10px);
  opacity: 0;
} */

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
    will-change: transform;
    transition: all 250ms;
    height: 100%;
    top: 0;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
}

.vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}

.vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}

.vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}

.vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}

/* 头部效果 */
.vux-pop-out-enter-active .vuxPop-header,
.vux-pop-out-leave-active .vuxPop-header,
.vux-pop-in-enter-active .vuxPop-header,
.vux-pop-in-leave-active .vuxPop-header {
    position: absolute;
    transition: all  300ms;
    left:0;
    opacity: 1;
    z-index: 9999;
}
.vux-pop-in-enter-active, .vux-pop-out-enter-active{
    z-index: 101;
	transition: transform 300ms;
}
.vux-pop-in-enter-active .vuxPop-header,.vux-pop-out-enter-active .vuxPop-header{
	transition: all 300ms;
}
.vux-pop-out-enter{
    transform:translate3d(-100%,0px,0px);
}
.vux-pop-out-enter .vuxPop-header{
    opacity:  .8;
    left:-100%;
}
.vux-pop-out-leave-to {
    transform:translate3d(0,0px,0px);
}
.vux-pop-out-leave-to .vuxPop-header{
    opacity: .8;
	left:100%;
}
.vux-pop-in-enter {
    transform:translate3d(100%,0px,0px);
}
.vux-pop-in-enter .vuxPop-header{
    opacity: .8;
    left:100%;
}
</style>
