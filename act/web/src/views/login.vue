<template>
    <div class="login">
        <mt-header title="登录">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <div class="login-pic"><img src="@/assets/img/app-logo.png"></div>
        <div class="edit-form">
            <mt-field label="帐号" placeholder="请输入帐号" type="text" v-model="account"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
        </div>
        <div class="btn-wrap">
            <mt-button type="primary" @click="submitLogin">登录</mt-button>
        </div>
        <div class="btn-wrap">
            <mt-button type="default" @click="$router.push('register')">注册</mt-button>
        </div>

        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            account: '',
            password: ''
        }
    },
    methods: {
        submitLogin() {
            if (this.account && this.password) {
                this.$http.post('/api/am/login', {account: this.account, password: this.password}).then(response => {
                    this.$toast({
                        message: '登录成功',
                        iconClass: 'icon icon-success'
                    });
                    var data = response.data;
                    localStorage.setItem('user', JSON.stringify(data));
                    this.$store.commit('userChange', data);    
                    this.$router.back(-1);
                })
            }
        }
    },
    created() {
        
    }
}
</script>

<style scoped>
.login-pic {
    width: 130px;
    margin: 0 auto;
    padding: 30px 0;
}
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