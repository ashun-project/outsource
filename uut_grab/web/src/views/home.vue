<template>
  <div class="home">
    <div class="banners">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="item in bannerList" :key="item.id">
          <a :href="item.url">
            <img :src="'/api/img/banner/' + item.img" alt />
          </a>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="notice">
      <!-- <i class="iconfont">&#xe629;</i> -->
      <span>【官方公告】</span>
      <!-- <div class="marquee">
        <marquee
        scrollamount="3"
        scrolldelay="100"
        direction="left"
        onmouseover="this.stop();"
        onmouseout="this.start();"
        style="cursor:pointer;"
      >尊敬的会员您好，充值、提现如遇到问题请及时联系在线客服，以便为您尽快处理！！！感谢您长期以来对本平台的支持与关注，祝您生活愉快！</marquee> -->
      <div class="text-box">
        <transition name="slide">
            <p class="text" :key="text.id" @click="goRoute('noticelist/' + text.type + '/' + text.id, 'home')">{{text.val}}</p>
        </transition>
      </div>
      <span class="show-more" @click="goRoute('noticetype', 'home')">更多<i class="iconfont">&#xe628;</i></span>
    </div>
    <div class="line"></div>
    <div class="flex_container">
      <div class="flex_item" @click="goRoute('rechargetype')">
        <div class="icon_cont">
          <img src="@/assets/img/cz.png" style="width:100%;height:100%" />
        </div>
        <p>充值</p>
      </div>
      <div class="flex_item" @click="goRoute('withdraw')">
        <div class="icon_cont">
          <img src="@/assets/img/tx.png" style="width:100%;height:100%" />
        </div>
        <p>提现</p>
      </div>
      <div class="flex_item" @click="goRoute('active')">
        <div class="icon_cont">
          <img src="@/assets/img/hd.png" style="width:100%;height:100%" />
        </div>
        <p>优惠活动</p>
      </div>
      <div class="flex_item" @click="goRoute('share')">
        <div class="icon_cont">
          <img src="@/assets/img/yq.png" style="width:100%;height:100%" />
        </div>
        <p>邀请好友</p>
      </div>
      <div class="flex_item" @click="goRoute('brief')">
        <div class="icon_cont">
          <img src="@/assets/img/pt.png" style="width:100%;height:100%" />
        </div>
        <p>平台简介</p>
      </div>
      <div class="flex_item" @click="goRoute('grabrule')">
        <div class="icon_cont">
          <img src="@/assets/img/qd.png" style="width:100%;height:100%" />
        </div>
        <p>抢单规则</p>
      </div>
      <div class="flex_item" @click="goRoute('togetherrule')">
        <div class="icon_cont">
          <img src="@/assets/img/dl.png" style="width:100%;height:100%" />
        </div>
        <p>代理合作</p>
      </div>
      <div class="flex_item" @click="goRoute('question')">
        <div class="icon_cont">
          <img src="@/assets/img/wt.png" style="width:100%;height:100%" />
        </div>
        <p>常见问题</p>
      </div>
    </div>
    <div class="line"></div>
    <div class="commission-list">
		<h5 class="title-txt">UU抢单宝介绍</h5>
		<div class="video-box">
            <div id="video"></div>
		</div>
	</div>
    <!-- 时时佣金 -->
    <div class="commission-list">
      <h5 class="title-txt">实时佣金</h5>
      <div class="myscroll" id="rule">
        <ul id="list">
          <!-- {volist name='user_notice' id='v'} -->
          <li class="myscrollRow" v-for="item in orderList" :key="item.id">
            <span v-if="item.phone">{{ item.phone.substr(0,3) + '****' + item.phone.substr(7, 11) }}</span>
            <span v-else>***********</span>
            <span style="color:#de442c;">获得返佣{{ item.earn }}元</span>
            <span>{{ $common.formatDate(item.create_date).substr(5) }}</span>
          </li>
        </ul>
        <ul id="list2"></ul>
      </div>
    </div>
    <div class="line"></div>
    <!-- 商品-列 -->
    <div class="order">
      <h5 class="title-txt">热门专区</h5>
      <ul>
        <li v-for="item in list" :key="item.id" :class="{hui: item.status == 1}" @click="goOrder(item.id, item.min_amount, item.status)">
          <a class="order-list">
            <aside class="order-content">
              <h1>{{ item.name }}</h1>
              <span>任务最低余额</span>
              <p>{{ item.min_amount }}元</p>
              <em>佣金:{{ item.profit }}%</em>
            </aside>
            <aside class="order-btn">
              <span>立即抢单</span>
              <img v-if="item.status === 1" src="@/assets/img/lock.png" alt="">
              <img v-else :src="'/api/img/store/' + item.logo" />
            </aside>
          </a>
        </li>
      </ul>
    </div>
    <!-- 商品列==结束 -->
    <div class="line"></div>
  </div>
</template>

<script>
import DPlayer from 'dplayer';
export default {
    data() {
        return {
            list: [],
            noticeList:[],
            frozenAmount: 0,
            number: 0,
            orderList: [],
            bannerList: [],
            user: {}
        };
    },
    computed: {
        text () {
            var data = this.noticeList[this.number] || {}
            return {
                id: data.id,
                val: data.title,
                type: data.type
            }
        }
    },
    mounted() {
        var banners = document.querySelector(".banners");
        banners.style.height = (300 / 750) * banners.clientWidth + "px";
		this.startMove();

        var videoObject = {
            container: '#video', //容器的ID或className
            variable: 'player',//播放函数名称
            flashplayer: true,
            poster: '/static/m3u8/fm.png',//封面图片
            video: '/static/m3u8/demo.m3u8'
        };
        var player = new ckplayer(videoObject);
		var playVideo = document.querySelector('.video-box');
		var _5ye_height = playVideo.clientWidth / 16 * 9;
		playVideo.style.height = _5ye_height + 'px';
    },
    created() {
        this.$http.post('/grab/storeList', {}, {loading: true}).then(response => {
            localStorage.setItem('store', JSON.stringify(response.list || ''));
            this.$store.commit('storeChange', response.list);
            this.list = response.list
        }).catch(() => {})

        this.$http.post('/grab/bannerList', {}).then(response => {
            this.bannerList = response.list
        }).catch(() => {})
        
        var user = this.$store.state.user;
        this.getUser(user.id);
        this.getNoticeList(user.id);
        this.getOrderList();
    },
    methods: {
        startMove () {
            // eslint-disable-next-line
            let timer = setTimeout(() => {
                if (this.number === (this.noticeList.length - 1)) {
                    this.number = 0;
                } else {
                    this.number += 1;
                }
                this.startMove();
            }, 2000); // 滚动不需要停顿则将2000改成动画持续时间
        },
        getNoticeList(id) {
          this.$http.post('/grab/noticelist', {userId: id, type: 'all'}, {loading: true}).then(response => {
                    this.noticeList = response.list;
                }).catch(() => {})
        },
        getUser(id) {
            this.$http.post('/grab/queryUser', { id: id }).then(response => {
                localStorage.setItem('user', JSON.stringify(response.userInfo || ''));
                this.$store.commit('userChange', response.userInfo);
                this.$set(this, 'user', response.userInfo);
            }).catch(() => {})
            this.$http.post('/grab/todayOrder', {userId: id}, {loading: true}).then(response => {
                var list = response.list || [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].status === 1) {
                        this.frozenAmount += (list[i].price * list[i].item);
                    }
                }
                this.$store.commit('frozenChange', this.frozenAmount);
            }).catch(() => {})
        },
        goRoute(val, from) {
            if (val == 'withdraw' && !this.user.capital) {
                this.$Message.alert('请先在设置资金密码').then(action => {
                    this.$router.push({ path: '/trade', query: { from: '/my' } });
                })
                return
            }
            if (from) {
                this.$router.push({path: "/" + val, query: {from: '/' + from} });
            } else {
                this.$router.push("/" + val);
            }
        },
        goOrder(id, amount, status) {
            var err = '';
            var list = this.list.filter(item => item.status === 2);
            for (var i = 0; i  < list.length; i++) {
              if (list[i].min_amount > amount && (this.user.amount - this.frozenAmount) >= list[i].min_amount) {
                err = '您的账户余额已超过该专区限制，请进入相对于的专区进行抢单，佣金更高！'
                break
              }
            }
            if ((this.user.amount - this.frozenAmount) < amount) {
                err = '您的账户余额不足，请充值后再次进入该专区进行抢单！'
            }
            if (status === 1) {
                err = '专区已锁定'
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 2500
                })
                return
            }
            this.$http.post('/grab/currentOrder', {userId: this.user.id}, {loading: true}).then(response => {
                if (response.list[0]) {
                    this.$Toast({
                        message: '你有未完成的订单',
                        duration: 1500
                    })
                    this.$router.push("/orderdetail");
                } else {
                    this.$router.push("/order/" + id);
                }
            }).catch(() => {})
		},
		getOrderList() {
			this.$http.post('/grab/orderList', {status: 2, page: 1, pageSize: 100 }).then(response => {
				this.orderList = response.list;
				this.$nextTick(() => {
					this.wuxiangundong();
				})
            }).catch(() => {})
		},
		wuxiangundong() {
			// 无限滚动
			var speed = 37;
			var list = document.getElementById("list");
			var list2 = document.getElementById("list2");
			var rule = document.getElementById("rule");
			list2.innerHTML = list.innerHTML;
			function Marquee() {
				if (list.offsetHeight * 2 - 100 - rule.scrollTop <= 0) {
					rule.scrollTop -= list.offsetHeight;
				} else {
					rule.scrollTop++;
				}
			}
			var MyMar = setInterval(Marquee, speed);
			rule.addEventListener("mouseover", function() {
				clearInterval(MyMar);
			});
			rule.addEventListener("mouseout", function() {
				MyMar = setInterval(Marquee, speed);
			});
		}
    }
};
</script>

<style scoped>
.banners {
  height: 150px;
}
.mint-swipe-item img {
  width: 100%;
}
.flex_container {
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 1rem;
  font-size: 0.7rem;
  text-align: center;
}
.flex_item {
  width: 25%;
  margin-bottom: 0.8rem;
}
.icon_cont {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 auto 6px;
  display: flex;
  /* padding: 5px; */
}
.flex_container p {
  font-size: 14px;
  color: #907878;
  outline: none;
}
.notice {
  padding-left: 35px;
  height: 40px;
  line-height: 40px;
  position: relative;
  font-size: 14px;
  border-top: 1px solid rgba(241, 241, 241, 0.6);
}
.notice span {
  position: absolute;
  left: 0px;
  color: #de442c;
  font-size: 13px;
  background: #ffffff;
  display: block;
  font-weight: 600;
}
.notice .show-more{
  color: #666;
  font-size: 12px;
  right: 0;
  top: 0;
  left: initial;
  font-weight: normal;
  display: flex;
}
.notice .show-more:active{
    color: #000;
}
.notice .show-more i{
  font-size: 18px;
  /* float: right; */
}
.order ul {
  padding: 10px 5px 20px;
  display: flex;
  flex-wrap: wrap;
}
.order li {
  width: 50%;
  padding: 0 5px;
}
.order-list {
  background: #f83110;
  display: block;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  padding: 0 10px;
}
.hui {
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  -webkit-filter: grayscale(100%);
}
.order-content {
  display: flex;
  flex-direction: column;
}
.order-content h1 {
  color: #fff;
  padding: 10px 0 0;
  font-size: 20px;
}
.order-content span,
.order-content p {
  color: #ddd;
  font-size: 14px;
}
.order-content em {
  background-image: linear-gradient(to right, #cb86f9, #8324f8);
  color: #fff;
  border-radius: 20px;
  font-size: 12px;
  width: 80px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin: 6px 0;
}
.order-btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.order-btn span {
  background: #ffe80a;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  width: 80px;
  height: 30px;
  border-radius: 20px;
  line-height: 30px;
  text-align: center;
  color: #fe0101;
  font-size: 16px;
  font-weight: bold;
}
.order-btn img {
  width: 50px;
  height: 50px;
  position: relative;
  top: -20px;
}
.title-txt {
  font-size: 20px;
  margin-top: 20px;
  padding-left: 10px;
}
.video-box{
	height: 150px;
	background: #000;
}
.video-box video{
	height: 100%;
	width: 100%;
}
.commission-list {
  padding-bottom: 20px;
}
.commission-list .title-txt {
  padding-bottom: 10px;
}
.myscroll {
  height: 100px;
  padding: 0 10px;
  font-size: 12px;
  overflow: hidden;
}
.myscroll li {
  margin-bottom: 5px;
  display: flex;
  text-align: center;
  font-size: 14px;
}
.myscroll li span {
  width: 33.33%;
}
.text-box {
    width: 100%;
    height: 40px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    padding: 0 60px 0 46px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .text {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s linear;
  }
  .slide-enter{
    transform: translateY(20px) scale(1);
    opacity: 1;
  }
  .slide-leave-to {
    transform: translateY(-30px) scale(1);
    opacity: 0;
  }
</style>