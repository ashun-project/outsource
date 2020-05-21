<template>
    <div class="forget">
        <div class="aui-jop-chang"><img src="@/assets/img/login.png" alt=""></div>
        <div class="forget-form">
            <div class="input-wrap">
                <i class="iconfont">&#xe61b;</i>
                <mt-field placeholder="请输入手机号码" v-model="formData.phone"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont" style="font-size:18px;padding-left:2px">&#xe636;</i>
                <mt-field placeholder="请输入验证码" v-model="formData.code"></mt-field>
                <span class="vaild-password" :class="vaildTxt !== '获取验证码' ? 'dis' : ''" @click="getVaildCode">{{ vaildTxt }}</span>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe623;</i>
                <mt-field placeholder="请输入登录密码" type="password" v-model="formData.password"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe623;</i>
                <mt-field placeholder="请再次输入密码" type="password" v-model="formData.checkPassword"></mt-field>
            </div>
           <mt-button type="danger" @click="getRetrieve">确认</mt-button>
           <div class="support">
               <span @click="goLogin">已找回密码？去登录</span>
           </div>
       </div>
       <div class="beian">
            Copyright © 2012-2020 &nbsp;UU抢单宝
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
                code: '',
                checkPassword: ''
            },
            vaildTxt: '获取验证码'
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
        getRetrieve() {
            var err = '';
            if (this.formData.checkPassword !== this.formData.password) {
                err = '两次输入的密码不一致';
            }
            if (!this.formData.checkPassword) {
                err = '请填写确认密码！';
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
            this.$http.post('/grab/retrieve', this.formData, {loading: true}).then(response => {
                this.$Toast({
                    message: '找回成功，请登录',
                    duration: 1500
                })
                this.$router.push('/')
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
    .forget{
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
    }
    .aui-jop-chang img{
        width: 100%;
    }
    .forget-form{
        background: #fff;
        padding: 20px 20px 10px;
        border-radius: 6px;
        margin: -20px 10px 0;
        position: relative;
        z-index: 100;
    }
    .forget >>> .mint-cell-wrapper {
        background: none;
        padding: 0;
        position: relative;
    }
    .forget .mint-cell{
        background-image: -webkit-gradient(linear, left bottom, left top, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: bottom;
        padding: 5px 0 5px 50px;
    }
    .forget .mint-cell >>> input{
        color: #de442c;
        font-size: 14px;
    }
    .forget button{
        width: 100%;
        margin: 30px 0 10px;
        background: #de442c;
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
        padding: 10px;
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
     .beian{
        color: #f1f1f1;
        font-size: 12px;
        text-align: center;
        height: 50px;
        padding-top: 10px;
    }
</style>