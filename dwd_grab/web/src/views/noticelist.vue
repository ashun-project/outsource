<template>
	<div class="notice">
		<my-header :title="titleTxt" :bkUrl="gbRoute"></my-header>
		<div class="site_info" v-for="(item, idx) in list" :key="idx" :class="{more: item.more || listId === item.id}">
			<div class="info" @click="showMore(item, idx)">
				<p>
					{{ item.title }}
				</p>
				<p class="detial">{{ $common.formatDate(item.create_date) }}</p>
			</div>
			<div class="btn_container">
				<i class="iconfont">&#xe6e0;</i>
			</div>
			<div class="cont">
				{{ item.cont }}
			</div>
		</div>
		<div class="no-data" v-if="list.length === 0">暂无公告</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			type: '',
			titleTxt: '',
			gbRoute: '/noticetype',
			listId: '',
			list: [
				{title: '系统公告', id: '', date: '2020-09-18 20:20:19', cont: '尊敬的会员您好，充值、提现如遇到问题请及时联系在线客服，以便为您尽快处理！！！感谢您长期以来对本平台的支持与关注，祝您生活愉快！'}
			]
		};
	},
	created() {
		var from = this.$route.query.from;
		this.type = this.$route.params.type;
		this.listId = Number(this.$route.params.id);
		if (this.type == '1') {
			this.titleTxt = '系统公告'
		} else if (this.type == '2'){
			this.titleTxt = '会员公告'
		} else {
			this.titleTxt = '会员站内信'
		}
		if (from) {
			this.gbRoute = from;
        }
		this.getList();
	},
	methods: {
		showMore(item, idx) {
			this.listId = '';
			var obj = Object.assign({}, this.list[idx]);
			obj.more  = !item.more;
			this.list.splice(idx, 1, obj);
		},
		getList() {
			var user = this.$store.state.user;
			this.$http.post('/grab/noticelist', {type: Number(this.type), userId: user.id}, {loading: true}).then(response => {
                this.list = response.list;
            }).catch(() => {})
		}
	}
};
</script>

<style scoped>
.no-data {
  text-align: center;
  color: #666;
  padding-top: 20px;
}
.site_info{
	padding: 10px;
	border-bottom: 10px solid #f1f1f1;
	display: flex;
	justify-content: space-between;
	font-size: 16px;
	color: #333;
	flex-wrap: wrap;
	height: 75px;
	overflow: hidden;
}
.site_info .cont{
	width: 100%;
	font-size: 14px;
	margin-top: 10px;
}
.site_info.more{
	height: auto;
	background: #fff6f6;
}
.detial{
	font-size: 13px;
	color: #666;
	margin-top: 8px;
}
.info{
	flex: 1;
	min-width: 0;
	height: 45px;
}
.btn_container{
	/* width: 30px; */
	padding-top: 14px;
}
.site_info i{
	transition: all 0.3;
	display: block;
}
.site_info.more i{
	-webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
	transform: rotate(90deg);
	color: #de442c;
}
</style>