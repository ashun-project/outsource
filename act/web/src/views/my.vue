<template>
    <div class="my">
        <mt-header title="用户中心">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
            <mt-button icon="more" slot="right" @click="goRoute('set')"></mt-button>
        </mt-header>
        <div class="user-info">
            <div class="user-infol">
                <img v-if="user.tx" :src="'/api/tx/' + user.tx">
                <img v-else class="userHeadImg" src="@/assets/img/tx.jpg">
            </div>
            <div class="user-infor" v-if="!user.nickName">
                <span @click="$router.push('login')">登录</span>
                <span @click="$router.push('register')">注册</span>
            </div>
            <div v-else class="nick-name">
                {{user.nickName}}
            </div>
        </div>
        <div class="user-list">
            <ul>
                <li @click="goRoute('collect')"><img src="@/assets/img/xinxin.png">我的收藏</li>
                <li @click="goRoute('pl')"><img src="@/assets/img/pl.png">我的评论</li>
                <li @click="goRoute('dz')"><img src="@/assets/img/dz.png">我的点赞</li>
            </ul>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {}
        }
    },
    computed: {
        getUser() {
            return this.$store.state.user;
        }
    },
    watch: {
        getUser(val) {
            this.$set(this, 'user', val);
        }
    },
    created() {
        var user = this.$store.state.user;
        this.$set(this, 'user', user);
    },
    methods: {
        goRoute(str) {
            if (this.user.id) {
                this.$router.push('/' + str)
            } else {
                this.$toast('请先登录')
            }
        }
    },
    
}
</script>

<style scoped>
.my .mint-header {
    font-size: 16px;
    font-weight: 600;
    padding-top: 10px;
}
.my .mint-header >>> .mint-header-title{
    font-weight: 600;
}
.my .mint-header >>> .mintui {
    font-weight: 600;
    font-size: 18px;
}
.my .mint-header >>> .mint-button-icon{
    margin-top: -1px;
}
.user-info{
    display: flex;
    align-items: center;
    padding: 20px 20px 30px 20px;
    color: #fff;
    background: #0084ff;
}
.user-info .user-infol {
    margin-right: 20px;
}
.user-info .user-infol img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: solid 5px #fff;
    background: #fff;
    object-fit: cover;
}
.user-info .user-infor span {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
}
.user-list {
    position: relative;
}
.user-list:before {
    content: "";
    width: 100%;
    height: 50px;
    display: block;
    background: #0084ff;
    position: absolute;
    top: 0;
    left: 0;
}
.user-list ul {
    margin: 0 15px;
    padding: 10px 15px;
    border-radius: 5px;
    box-shadow: 0 3px 8px rgba(0,0,0,.05);
    background: #fff;
    position: relative;
    z-index: 1;
}
.user-list ul li {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: solid 1px #eee;
    background: url(../assets/img/arr.png) right center no-repeat;
    background-size: 12px auto;
    cursor: pointer;
}
.user-list ul li:active{
    color: #0084ff;
}
.user-list ul li:last-child {
    border-bottom: 0;
}
.user-list ul li img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
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
.nick-name{
    font-weight: 600;
}
</style>