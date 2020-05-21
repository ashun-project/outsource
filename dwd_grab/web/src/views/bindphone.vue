<template>
    <div class="bindphone">
        <my-header title="绑定手机" bkUrl="/set"></my-header>
        <div class="c-li">
            <i class="iconfont">&#xe62b;</i>
            <span>当前绑定：</span>
            <span>{{ user.phone }}</span>
        </div>
        <div class="line"></div>
        <div class="bindphone-form">
            <div class="input-wrap">
                <i class="iconfont">&#xe61b;</i>
                <mt-field placeholder="请填写手机号码" v-model="formData.phone"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont" style="font-size:18px;padding-left:3px">&#xe636;</i>
                <mt-field placeholder="请填写验证码" v-model="formData.code"></mt-field>
                <span class="vaild-password" :class="vaildTxt !== '获取验证码' ? 'dis' : ''" @click="getVaildCode">{{ vaildTxt }}</span>
            </div>
           <mt-button type="primary" @click="updatePhone">立即绑定</mt-button>
       </div>
       
    </div>
</template>


<script>
export default {
    data() {
        return {
            formData: {
                phone: '',
                code: '',
                id: ''
            },
            user: {},
            vaildTxt: '获取验证码'
        }
    },
    created() {
        var user = this.$store.state.user;
        this.user = user;
        this.formData.id = user.id;
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
        updatePhone(id) {
            var err = '';
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
            this.$http.post('/grab/updatePhone', this.formData, { loading: true}).then(response => {
                this.user.phone = this.formData.phone;
                localStorage.setItem('user', JSON.stringify(this.user || ''));
                this.$store.commit('userChange', this.user);
                this.$router.push('/set');
                this.$Toast({
                    message: '修改成功！',
                    duration: 1500
                })
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
    .bindphone{
        height: 100%;
    }
    .bindphone .c-li{
        height: 48px;
        line-height: 48px;
        background: #fff;
        padding-left: 20px;
        display: flex;
    }
    .bindphone .c-li i{
        font-size: 20px;
        color: #de442c;
    }
    .bindphone .c-li span{
        padding-left: 6px;
    }
    .bindphone-form{
        background: #fff;
        padding: 0 10px;
        border-radius: 3px;
    }
    .bindphone >>> .mint-cell-wrapper {
        background: none;
        padding: 0;
        position: relative;
    }
    .bindphone .mint-cell{
        background-image: -webkit-gradient(linear, left bottom, left top, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: bottom;
        padding: 5px 0 5px 50px;
    }
    .bindphone .mint-cell >>> input{
        color: #de442c;
        font-size: 14px;
    }
    .bindphone button{
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
        color: #de442c;
    }
    .vaild-password{
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -15px;
        font-size: 12px;
        background: #de442c;
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
</style>