<template>
  <div class="question">
    <my-header title="常见问题" bkUrl="/home"></my-header>
    <div class="biaozi">
        <img src="@/assets/img/qu.jpg" alt="">
    </div>
    
    <div class="question-cont">
        <p class="tip">温馨提示：同一个人银行卡信息请勿<span>重复注册抢单</span>，一经发现一律冻结账号ID。个人多账户抢单会导致商家封店，影响商家信誉以及销量单作废，平台禁止一卡绑定多账户，请各位兼职会员勿使用个人多账户，一经发现将作冻结资金90天永久封禁账号的处理。</p>
        
        <p><span>1、关于充值</span></p>
        充值在“我的”界面。点击“充值”按钮，然后填写转账人的姓名和需充值的金额点击转账在进行转账汇款（注：请使用网银进行转账充值）。按平台提供的账户汇款后，务必提交转账成功截图，然后点击“提交”（注：提交一次即可，多次会造成充值失败）。为保证充值快速到账，烦请您所填转账人姓名和汇款金额一定要和汇款时的一致<span>（注：提交一次即可）</span>。如在充值过程中遇到无法解决的问题，请及时联系人工客服。（注：充值时间为10：00-22:00）    



        <p><span>2、关于提现</span></p>
        在提现之前，烦请您先在APP绑定您的提现信息。在平台工作时间内，可在“我的”界面进行提现。点击“提现”按钮，输入你想要提现的金额和提现密码就可进行提现。提现到账时间是在提现 <span>次日24点前</span>到账的

        <p><span>3、关于抢单</span></p>
        在APP内完善好个人真实资料和真实收货地址后，充值到账即可进行抢单，每人每天最多可抢30单，抢单成功后需在2分钟内完成底单提交，否则该订单将被冻结。
        <p><span>4、关于订单冻结</span></p>
        平台将订单匹配给用户的同时，平台将该笔订单的信息提交到商家后台，若用户在两分钟之内不提交订单，为了规避网购平台的监管，该笔订单会被冻结。订单冻结后，该笔订单资金也会被冻结，<span>当日24点后</span>，系统可以自行解冻该笔资金，该笔资金会自动返回到资金账户里。
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
.biaozi{
    background: #fff;
    text-align: center;
}
.biaozi img{
    width: 100%;
}
.question-cont{
    padding: 10px;
    line-height: 32px;
    font-size: 14px;
}
.question-cont .tip{
    line-height: 25px;
    font-weight: 600;
    margin-bottom: 10px;
}
.question-cont span{
    color: #de442c;
}
.remark{
	margin-top: 20px;
	color: #717171;
}
.remark p{
	background: #f1f1f1;
	height: 1px;
	margin: 5px 0;
}
</style>