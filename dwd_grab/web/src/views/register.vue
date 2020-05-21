<template>
    <div class="register">
        <div class="aui-jop-chang"><img src="@/assets/img/login.png" alt=""></div>
        <div class="register-form">
            <div class="input-wrap">
                <i class="iconfont">&#xe61b;</i>
                <mt-field placeholder="请填写手机号码" v-model="formData.phone"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont" style="font-size:18px;padding-left:2px">&#xe636;</i>
                <mt-field placeholder="请填写验证码" v-model="formData.code"></mt-field>
                <span class="vaild-password" :class="vaildTxt !== '获取验证码' ? 'dis' : ''" @click="getVaildCode">{{ vaildTxt }}</span>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe623;</i>
                <mt-field placeholder="请填写登录密码" type="password" v-model="formData.password"></mt-field>
            </div>
            <!-- <div class="input-wrap">
                <i class="iconfont" style="color: #ffa93d">&#xe744;</i>
                <mt-field placeholder="请填写交易密码" type="password" v-model="formData.username"></mt-field>
            </div> -->
            <div class="input-wrap">
                <i class="iconfont" style="color: #008be8">&#xe689;</i>
                <mt-field placeholder="邀请码（必填）" v-model="formData.invite"></mt-field>
            </div>
           <mt-button type="danger" @click="register">立即注册</mt-button>
           <div class="support">
               <span @click="goLogin">已有帐号？去登录</span>
           </div>
           <!-- <footer class="aui-footer-link">
                <a href="javascript:;" class="aui-tabBar-item aui-tabBar-item-active">注册即代表阅读并同意 <em>用户协议</em></a>
            </footer> -->
       </div>
        <div class="beian">
            Copyright © 2012-2020 &nbsp;点我达抢单宝
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            formData: {
                phone: '',
                password: '',
                invite: '',
                code: ''
            },
            vaildTxt: '获取验证码'
        }
    },
    created() {
        var from = this.$route.query.from
        if (from) {
            this.formData.invite = from
        }
    },
    methods: {
        getVaildCode() {
            if(!this.formData.phone || this.vaildTxt !== '获取验证码') {
                if (!this.formData.phone || !(/^1[23456789]\d{9}$/.test(this.formData.phone))) {
                    this.$Toast({
                        message: '请正确填写手机号！',
                        duration: 1500
                    })
                }
                return
            }
            // 发送请求
            this.$http.post('/grab/verifyCode', {phone: this.formData.phone});

            var timeNum = 60;
            this.vaildTxt = '60秒后重新获取';
            var timer = setInterval(() => {
                timeNum--;
                this.vaildTxt = timeNum + '秒后重新获取';
                if (timeNum < 1) {
                    this.vaildTxt = '获取验证码';
                    clearInterval(timer);
                }
            }, 1000)
        },
        goLogin() {
            this.$router.push('/')
        },
        register() {
            var err = '';
            if (this.formData.password.length > 16 || this.formData.password.length < 6) {
                err = '密码长度在6--16位之间';
            }
            if (!this.formData.invite) {
                err = '请填写邀请码！';
            }
            if (!this.formData.password) {
                err = '请填写密码！';
            }
            if (!this.formData.code) {
                err = '请填写验证码！';
            }
            if (!this.formData.phone || !(/^1[23456789]\d{9}$/.test(this.formData.phone))) {
                err = '请正确填写手机号！';
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            this.$http.post('/grab/register', this.formData, {loading: true}).then(response => {
                this.$Toast({
                    message: '注册成功，请登录',
                    duration: 1500
                })
                this.$router.push('/')
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
    .register{
        background: #ff3e41;
        min-height: 100%;
    }
    .aui-jop-chang {
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 50px 0;
    }
    .aui-jop-chang img{
        width: 40%;
    }
    .register-form{
        background: #fff;
        padding: 20px 20px 10px;
        border-radius: 6px;
        margin: -20px 10px 0;
        position: relative;
        z-index: 100;
        /* box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); */
    }
    .register >>> .mint-cell-wrapper {
        background: none;
        padding: 0;
        position: relative;
    }
    .register .mint-cell{
        background-image: -webkit-gradient(linear, left bottom, left top, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: bottom;
        padding: 5px 0 5px 50px;
    }
    .register .mint-cell >>> input{
        color: #de442c;
        font-size: 14px;
    }
    .register button{
        width: 96%;
        margin: 30px auto 10px;
        background: #de442c;
        border-radius: 20px;
        display: block;
        font-size: 16px;
    }
    .input-wrap{
        position: relative;
    }
    .input-wrap .iconfont{
        position: absolute;
        left: 10px;
        top: 50%;
        font-size: 22px;
        z-index: 20;
        margin-top: -11px;
        color: #008be8;
    }
    .support{
        text-align: center;
        font-size: 13px;
        color: #de442c;
        padding: 0 10px;
    }
    .vaild-password{
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -15px;
        font-size: 12px;
        background: #008be8;
        border-radius: 3px;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        display: block;
        color: #fff;
    }
    .vaild-password.dis{
        background: #ccc;
        color: #f1f1f1;
        opacity: 0.8;
    }
    .aui-footer-link{
        /* position: absolute;
        bottom: -40px;
        left: 0; */
        text-align: center;
        color: #333;
        font-size: 14px;
        text-align: center;
        width: 100%;
        margin-top: 30px;
    }
     .aui-footer-link a{
        color: #333;
        text-decoration: none;
    }
    .aui-footer-link em{
        color: #008be8;
        font-style: normal;
    }
    .beian{
        color: #f1f1f1;
        font-size: 12px;
        text-align: center;
        height: 50px;
        padding-top: 10px;
    }
</style>