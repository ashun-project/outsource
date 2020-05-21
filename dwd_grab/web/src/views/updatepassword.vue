<template>
    <div class="bindphone">
        <my-header title="修改登录密码" bkUrl="/set"></my-header>
        <!-- <div class="line"></div> -->
        <div class="bindphone-form">
            <div class="input-wrap">
                <i class="iconfont">&#xe665;</i>
                <mt-field placeholder="请填写原密码" type="password" v-model="formData.oldPassword"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe623;</i>
                <mt-field placeholder="请填写新密码" type="password" v-model="formData.password"></mt-field>
            </div>
            <div class="input-wrap">
                <i class="iconfont">&#xe613;</i>
                <mt-field placeholder="确认密码" type="password" v-model="formData.checkPassword"></mt-field>
            </div>
           <mt-button type="primary" @click="updatePassword">立即修改</mt-button>
       </div>
       
    </div>
</template>


<script>
export default {
    data() {
        return {
            formData: {
                oldPassword: '',
                checkPassword: '',
                password: '',
                id: '',
            },
            user: {}
        }
    },
    created() {
        var user = this.$store.state.user;
        this.user = user;
        this.formData.id = user.id;
        this.formData.dataPassword = user.password;
    },
    methods: {
        updatePassword() {
            var err = '';
            if (this.formData.checkPassword !== this.formData.password) {
                err = '两次输入密码不一致';
            }
            if (!this.formData.checkPassword) {
                err = '请确认新密码！';
            }
            if (!this.formData.password) {
                err = '请填写新密码！';
            }
            if (!this.formData.oldPassword) {
                err = '请填写旧密码！';
            }

            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            this.$http.post('/grab/updatePassword', this.formData, { loading: true}).then(response => {
                this.user.password = this.formData.password;
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
</style>