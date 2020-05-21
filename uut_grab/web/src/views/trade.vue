<template>
    <div class="bindphone">
        <my-header title="交易密码" :bkUrl="gbRouter"></my-header>
        <!-- <div class="line"></div> -->
        <div class="bindphone-form">
            <div class="input-wrap" v-if="user.capital">
                <i class="iconfont">&#xe665;</i>
                <mt-field placeholder="请填写原密码" type="password" v-model="formData.oldCapital" @input="checkInputNum('', 'oldCapital')"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe623;</i>
                <mt-field placeholder="请填写新密码" type="password" v-model="formData.capital" @input="checkInputNum('', 'capital')"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe613;</i>
                <mt-field placeholder="确认密码" type="password" v-model="formData.checkCapital" @input="checkInputNum('', 'checkCapital')"></mt-field>
            </div>
            <div class="tip">
                <span>*&nbsp;请输入4位纯数字密码</span>
            </div>
           <mt-button type="primary" @click="capitalPassword">立即修改</mt-button>
       </div>
       
    </div>
</template>


<script>
export default {
    data() {
        return {
            formData: {
                checkCapital: '',
                capital: '',
                oldCapital: '',
                id: ''
            },
            gbRouter: '/set',
            user: {}
        }
    },
    created() {
        var user = this.$store.state.user;
        this.formData.id = user.id;
        this.formData.dataCapital = user.capital;
        this.user = user;
        if (this.$route.query.from) {
            this.gbRouter = this.$route.query.from;
        }
    },
    methods: {
        checkInputNum (value, key) {
            this.$nextTick(() => {
                var v = this.formData[key].replace(/[^0-9\.]/g, '');
                if (v.length > 4) {
                    v = v.substr(0, 4)
                }
                this.formData[key] = v;
            })
        },
        capitalPassword() {
            var err = '';
            if (!Number(this.formData.capital)) {
                err = '只能输入数字';
            }
            if (this.formData.capital.length !== 4) {
                err = '密码为4位数字';
            }
            if (this.formData.checkCapital !== this.formData.capital) {
                err = '两次输入密码不一致';
            }
            if (!this.formData.checkCapital) {
                err = '请确认新密码！';
            }
            if (!this.formData.capital) {
                err = '请填写新密码！';
            }
            if (!this.formData.oldCapital && this.user.capital) {
                err = '请填写旧密码！';
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            var newObj = JSON.parse(JSON.stringify(this.formData));
            newObj.capital = this.$md5(this.formData.capital);
            newObj.oldCapital = this.$md5(this.formData.oldCapital);
            this.$http.post('/grab/capitalPassword', newObj, { loading: true}).then(response => {
                this.user.capital = response.capital;
                localStorage.setItem('user', JSON.stringify(this.user || ''));
                this.$store.commit('userChange', this.user);
                this.$router.push(this.gbRouter);
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
    .tip{
        font-size: 13px;
        color: #de442c;
        margin-top: 10px
    }
</style>