<template>
  <div class="share">
    <my-header title="分享好友" bkUrl="/home"></my-header>
    <div class="cont-img" @click="getCopy">
        <img src="@/assets/img/share.png" alt="">
    </div>
    <div class="invite-code">您的邀请ID：<span>{{user.invite}}</span></div>
    <div class="qrcode">
        <div id="qrcode"></div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
        user: this.$store.state.user
    };
  },
  mounted () {
    this.qrcode();
  },
  methods: {
    qrcode() {
        var loaction = window.location.origin
        let qrcode = new QRCode('qrcode', {
            width: 132,  
            height: 132,
            text: loaction + '/#/register?from=' + this.user.invite, // 二维码地址
            colorDark : "#000",
            colorLight : "#fff",
        })
    },
    getCopy() {
        var loaction = window.location.origin;
        var url = loaction + '/#/register?from=' + this.user.invite;
        var err = false;
        var input = document.createElement('input');
        input.value = url;
        document.getElementsByTagName('body')[0].appendChild(input);
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios
            var range = document.createRange();
            range.selectNode(input);
            window.getSelection().addRange(range);
            var successful = document.execCommand('copy');
            if (!successful) {
                err = true;
                this.$Message('提示', '您的浏览器不支持点击复制。请手动复制');
            }
            window.getSelection().removeAllRanges();
        } else {
            input.select();
            document.execCommand('copy');
        }
        input.parentNode.removeChild(input);
        if (!err) {
            this.$Toast({
                message: '复制成功',
                duration: 1500
            })
        }
    },
  }
};
</script>

<style scoped>
.cont-img{
    display: flex;
    align-items: center;
}
.cont-img img{
    width: 100%;
}
.qrcode{
    position: absolute;
    top: 68px;
    right: 25px;
    padding: 10px;
    border-radius: 6px;
    background: #fff;
}
.invite-code{
    position: absolute;
    top: 240px;
    left: 0;
    right: 0;
    width: 100%;
    font-size: 16px;
    color: #de442c;
    font-weight: 600;
    text-align: center;
}
.invite-code span{
    color: #880a0a;
}
</style>