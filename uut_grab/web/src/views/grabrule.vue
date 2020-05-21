<template>
  <div class="grabrule">
    <my-header title="抢单规则" bkUrl="/home"></my-header>
    <img class="jianjie" src="@/assets/img/yxgz.jpg" alt="">
    <div class="brief-cont">
        <p>尊敬的用户：您好！。</p>
        <div>
            佣金分配:平台会员所得佣金（请参考首页佣金规则）,提交订单后系统自动将订单金额及佣金一并返还到会员账户上为了提升平台的匹配速度,注册成功7天0抢单记录的账号进行封号处理。同一人银行卡信息请勿<span style="color:red">重复注册抢单</span>,一经发现将会<span style="color:red">冻结账户</span>。个人多账户抢单会导致商家封店,影响商家的信誉以及销售单作废,本平台禁止一卡绑定多账户,请各位会员遵守规则,若发现一卡绑定多账户行为给以资金冻结90天,账户永久封号处理。优优淘为了防止有人恶意进行洗黑钱或者套现一系列不法行为,会员每日未完成30单提现系统审核不通过,会员需完成30单方可全额提现,提现审核成功后,到账时间为T+1(次日24点前)到账,具体到账时间以银行为准!<br>
        </div>
    </div>
    <div class="tip">
		<p>
			郑重提醒： 为避免订单冻结，请用户离开抢单页面前结束自动抢单，2分钟内未提交的订单将会被冻结，当日24点后自动解冻！
		</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style scoped>
.jianjie{
    width: 100%;
}
.brief-cont{
    padding: 10px;
    line-height: 32px;
    font-size: 14px;
}
.brief-cont > div{
    text-indent: 32px
}
.tip{
    color: #de442c;
    font-size: 14px;
    padding: 0 10px 20px;
}
</style>