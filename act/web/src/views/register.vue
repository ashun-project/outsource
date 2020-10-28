<template>
    <div class="register">
        <mt-header title="注册">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <div class="h10"></div>
        <div class="edit-form">
            <mt-field label="帐号" placeholder="请输入帐号" type="text" v-model="account"></mt-field>
            <mt-field label="昵称" placeholder="请输入昵称：如小小" type="text" v-model="nickName"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
            <mt-field label="确认密码" placeholder="请输入确认密码" type="password" v-model="checkPassword"></mt-field>
        </div>
        <div class="btn-wrap">
            <mt-button type="primary" @click="submiRegister">确认注册</mt-button>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            account: '',
            nickName: '',
            password: '',
            checkPassword: ''
        }
    },
    methods: {
        submiRegister() {
            var err = '';
            if (!this.nickName) {
                err = '请填写用户昵称';
            } else if (!this.password) {
                err = '请填写密码';
            } else if (!this.account) {
                err = '请填写帐号';
            } else if (this.account.length < 6 || this.account.length > 12) {
                err = '帐号必须是大于6位小于12位';
            } else if (this.nickName.length > 6) {
                err = '昵称不能大于6位字符';
            } else if (this.password !== this.checkPassword) {
                err = '两次输入密码不一致';
            }
            if (err) {
                this.$toast(err);
                return
            }
            var params = {
                account: this.account,
                nickName: this.nickName,
                password: this.password
            }
            this.$http.post('/api/am/register', params).then(response => {
                this.$toast({
                    message: '注册成功',
                    iconClass: 'icon icon-success'
                });
                this.$router.back(-1);
            })
        }
    },
    created() {
        
    }
}
</script>

<style scoped>
.btn-wrap{
    padding: 25px 10px 0px;
}
.btn-wrap button{
    width: 100%;
}
.mask{
    position: fixed;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    background: #fff;
    z-index: -1;
}
</style>