<template>
	<div class="noticedetail">
		<my-header title="平台详情" bkUrl="/notice"></my-header>
		<div class="site_info">
			<div class="info" @click="goRoute">
				<p>
					系统公告
				</p>
				<p class="detial">2020-02-09&nbsp;09:08:26</p>
			</div>
			<div class="btn_container">
				<i class="iconfont">&#xe6e0;</i>
			</div>
			<div class="cont">
				尊敬的会员您好，充值、提现如遇到问题请及时联系在线客服，以便为您尽快处理！！！感谢您长期以来对本平台的支持与关注，祝您生活愉快！
			</div>
		</div>
		
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		goRoute() {
			this.$router.push('/noticedetail')
		}
	}
};
</script>

<style scoped>
    .cont{
        font-size: 14px;
        padding: 10px;
        line-height: 26px;
        padding-top: 20px;
    }
</style>