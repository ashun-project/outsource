<template>
    <div class="login">
        <div class="aui-jop-chang"><img src="@/assets/img/login.jpg" alt=""></div>
        <div class="login-form">
            <div class="input-wrap">
                <i class="iconfont">&#xe61b;</i>
                <mt-field placeholder="请输入手机号码" v-model="formData.phone"></mt-field>
            </div>
            <div class="input-wrap input-password">
                <i class="iconfont">&#xe623;</i>
                <mt-field placeholder="请输入密码" type="password" v-model="formData.password"></mt-field>
                <span class="forget-pas" @click="forget">忘记密码</span>
            </div>
           <mt-button type="danger" @click="getLogin">登录</mt-button>
           <div class="support">
               <a href="http://download.dianwodaqiangdan.com/" class="download-app" target="_bank">下载app</a>
               <span @click="register"><span>没有帐号？</span>去注册</span>
           </div>
       </div>
       <div class="login-b">
           <img src="@/assets/img/login-b.png" alt="">
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
                username: '',
                password: ''
            }
        }
    },
    methods: {
        register() {
            this.$router.push('/register')
        },
        forget() {
            this.$router.push('/forget')
        },
        getLogin() {
            var err = '';
            if (!this.formData.password) {
                err = '请填写密码！';
            }
            if (!(/^1[23456789]\d{9}$/.test(this.formData.phone))) {
                err = '手机号错误！';
            }
            if (!this.formData.phone) {
                err = '请填写手机号！';
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            this.$http.post('/grab/login',this.formData, {loading: true}).then(response => {
                this.$Toast({
                    message: '登录成功',
                    duration: 1500
                })
                localStorage.setItem('user', JSON.stringify(response.userInfo));
                this.$store.commit('userChange', response.userInfo);
                this.$router.push('/home');
                
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
    .login{
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
    .login-form{
        background: #fff;
        padding: 20px 20px 10px;
        border-radius: 6px;
        margin: -20px 10px 0;
        position: relative;
        z-index: 100;
    }
    .login >>> .mint-cell-wrapper {
        background: none;
        padding: 0;
        position: relative;
    }
    .login >>> .input-password .mint-cell-wrapper .mint-field-clear{
        margin-right: 70px;
    }
    .login .mint-cell{
        background-image: -webkit-gradient(linear, left bottom, left top, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: bottom;
        padding: 5px 0 5px 50px;
    }
    .login .mint-cell >>> input{
        color: #de442c;
        font-size: 14px;
    }
    .login button{
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
        color: #de442c;
    }
    .support{
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #de442c;
        padding: 10px 10px;
    }
    .support span span{
        color: #666;
    }
    .download-app{
        border: 1px solid #de442c;
        height: 25px;
        line-height: 25px;
        display: inline-block;
        padding: 0 10px;
        border-radius: 13px;
        margin-top: -3px;
        text-decoration: none;
        color: #de442c;
    }
    .login-b{
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
    .login-b img{
        width: 100%;
    }
    .beian{
        color: #f1f1f1;
        font-size: 12px;
        text-align: center;
        height: 50px;
        padding-top: 10px;
    }
    .forget-pas{
        position: absolute;
        top: 20px;
        right: 10px;
        font-size: 13px;
        color: #666;
    }
</style>