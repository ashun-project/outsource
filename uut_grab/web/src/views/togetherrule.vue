<template>
  <div class="together-rule">
    <my-header title="代理合作" bkUrl="/home"></my-header>
    <img class="biaozi" src="@/assets/img/hzgz.jpg" alt="">
    <div class="together-cont">
        <b>UU抢单宝0投资开启三级代理模式例如：</b><br>
        <span>
            <b>1.</b>
        </span>
        您是本平台的会员A，进行了抢单任务之后既有代理权，系统将自动形成您的会员中心，【推广专属二维码/邀请码】自己分享您的【专属二维码/邀请码】出去！ B通过A的【推广专属二维码/邀请码】注册成为会员，并进行抢单任务之后 
        <span>A将获得B佣金的16%</span> 与此同时，系统也将自动形成B的会员中心，【推广专属二维码/邀请码】
        <div style="height: 15px"></div>
        <span><b>2.</b></span>
        C通过B的【推广专属二维码/邀请码】注册成为会员，并进行抢单任务之后 
        <span>B将获得C佣金的16%，A将获得C佣金的8% </span> 与此同时，系统也将自动形成C的会员中心，【推广专属二维码/邀请码】

        <div style="height: 15px"></div>
        <span><b>3.</b></span>
        D通过C的【推广专属二维码/邀请码】注册成为会员，并进行抢单任务之后 
        <span>C将获得D佣金的16% B将获得D佣金的8% A将获得D佣金的4% </span> 以上代理模式以此类推 
        <div style="height: 15px"></div>
        温馨提示：所有代理线下的会员，产生的佣金奖励均由本平台所处，不影响所有代理线下会员的佣金！
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
    width: 100%;
}
.together-cont{
    padding: 10px;
    line-height: 32px;
    font-size: 14px;
}
.together-cont > div{
    text-indent: 32px
}
.together-cont span{
    color: #de442c;
}
</style>