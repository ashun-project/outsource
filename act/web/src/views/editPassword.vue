<template>
    <div class="edit-password">
        <mt-header title="修改密码">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <div class="h10"></div>
        <div class="edit-form">
            <mt-field label="旧密码" placeholder="请输入旧密码" type="password" v-model="oldPassword"></mt-field>
            <mt-field label="新密码" placeholder="请输入新密码" type="password" v-model="newPassword"></mt-field>
            <mt-field label="确认密码" placeholder="请输入确认密码" type="password" v-model="checkPassword"></mt-field>
        </div>
        <div class="btn-wrap">
            <mt-button type="primary" @click="editPassword">确认修改</mt-button>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            checkPassword: '',
            user: {}
        }
    },
    methods: {
        editPassword() {
            if (!this.oldPassword || !this.newPassword || !this.checkPassword) {
                this.$toast('请填写完整的数据');
                return
            }
            if (this.newPassword !== this.checkPassword) {
                this.$toast('两次输入密码不一致');
                return
            }
            this.$http.post('/api/am/updatePassword', {oldPassword: this.oldPassword, newPassword: this.newPassword, id: this.user.id}).then(response => {
                this.$toast('修改成功');
                this.$router.back(-1);
            })
        }
    },
    created() {
        var user = this.$store.state.user;
        this.$set(this, 'user', user);
    }
}
</script>

<style scoped>
.edit-form{
    /* margin-top: 50px; */
}
.btn-wrap{
    padding: 30px 10px;
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