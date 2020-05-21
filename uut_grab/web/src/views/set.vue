<template>
    <div class="set">
        <my-header title="设置中心" bkUrl="/my"></my-header>
        <div class="cell-list">
            <div class="c-li" @click="goRoute('bindphone')">
                  <p>
                    <i class="iconfont">&#xe62b;</i>
                    <span>绑定手机</span>
                </p>
                <i class="iconfont">&#xe6e0;</i>
            </div>
            <div class="line"></div>
            <div class="c-li" @click="goRoute('updatepassword')">
                <p>
                    <i class="iconfont">&#xe665;</i>
                    <span>登录密码</span>
                </p>
                <i class="iconfont">&#xe6e0;</i>
            </div>
            <div class="c-li no-bor" @click="goRoute('trade')">
                <p>
                    <i class="iconfont">&#xe6aa;</i>
                    <span>交易密码</span>
                </p>
                <i class="iconfont">&#xe6e0;</i>
            </div>
            <div class="line"></div>
            <div class="c-li no-bor exit" @click="goRoute('')">
               <span>退&nbsp;出</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        goRoute(val) {
            if (!val) {
                this.$http.post('/grab/signout', {}, { loading: true}).then(response => {
                    localStorage.setItem('user', '');
                    this.$store.commit('userChange', {});
                    this.$router.push('/');
                    this.$Toast({
                        message: '退出成功！',
                        duration: 1500
                    })
                }).catch(() => {})
            } else {
                this.$router.push('/' + val)
            }
        }
    }
}
</script>

<style scoped>
.set{
    height: 100%;
    background: #f1f1f1;
}
.cell-list .c-li{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    line-height: 1;
    min-height: inherit;
    overflow: hidden;
    padding: 0 10px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    position: relative;
    background: #fff;
}
.cell-list .c-li::after{
    content: '';
    position: absolute;
    border-bottom: 1px solid #d9d9d9;
    transform: scaleY(0.5);
    bottom: 0;
    left: 0;
    right: 0;
}
.cell-list .c-li.no-bor::after{
    border: 0;
}
.cell-list .c-li:active{
    background: #faeaea;
}
.cell-list .c-li span{
    font-size: 15px;
    padding-left: 6px;
}
/* .cell-list li i{
    color: #777;
} */
.cell-list .c-li i{
    color: #de442c;
}
.cell-list .exit span{
    display: block;
    text-align: center;
    width: 100%;
    padding-left: 0;
    font-size: 18px;
    color: #de442c;
}
</style>