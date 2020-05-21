<template>
  <div class="brief">
    <my-header title="平台简介" bkUrl="/home"></my-header>
    <img class="jianjie" src="@/assets/img/ptji.jpg" alt="">
    <div class="brief-cont">
        <p>尊敬的用户：您好！。</p>
        <div>
            欢迎您来到<span style="color:red">点我达抢单宝</span>APP，<span style="color:red">点我达抢单宝</span>是2012年成立的一个第三方智能云控主机匹配订单平台，平台与淘宝、京东、唯品会、拼多多、苏宁、国美、当当等网购平台商家合作，通过智能云系统将商家订单匹配给平台用户，提高商家在各大平台的成交量和信誉度。改进了传统网购提交订单繁琐的模式，由远程智能云服务器自动化提交订单，平台用户只需要在平台提供真实的收货地址，电话和一些真实的购物信息，传入智能云主机，即可由智能云控制远程电脑机器人自动模拟人工提交订单操作流程，让网购订单匹配变得更加高效简单！ 平台每天都会将需要提高曝光度的商家产品放到平台上，提供给平台用户进行抢单。
			<p style="height:10px"></p>
			为了规避网购平台的检测，提高订单的真实性，新用户在抢单前必须先完善个人真实信息，并填写真实的收货地址。使商家在提高曝光度和销量的同时不被网购平台认定为虚拟订单，从而促进商家在各大网购平台的良性健康发展，为了有效的帮助商家提升订单成功率，规避商家被检查到虚拟订单的风险，平台将会根据您当前的操作IP，设备型号对当天的订单进行优化匹配。所有订单匹配均需要通过智能云算法实现。
        </div>
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
</style>