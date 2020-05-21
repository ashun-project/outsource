<template>
    <div class="noticetype">
        <my-header title="平台公告" :bkUrl="gbRoute"></my-header>
        <div class="aui-jop-chang"><img src="@/assets/img/gg.jpg" alt=""></div>
        <div class="notice-form cell-list">
            <ul>
                <li @click="goRoute(1)">
                    <p>
                        <i class="iconfont">&#xe7b7;</i>
                        <span>系统公告</span>
                    </p>
                    <span><i class="iconfont">&#xe6e0;</i></span>
                </li>
                <!-- <li @click="goRoute(2)">
                    <p>
                        <i class="iconfont">&#xe758;</i>
                        <span>会员公告</span>
                    </p>
                    <span><i class="iconfont">&#xe6e0;</i></span>
                </li> -->
                <li @click="goRoute(3)">
                    <p>
                        <i class="iconfont">&#xe64f;</i>
                        <span>会员站内信</span>
                    </p>
                    <span><i class="iconfont">&#xe6e0;</i></span>
                </li>
            </ul>
       </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gbRoute: '/my'
        }
    },
    created() {
        var from = this.$route.query.from;
        if (from) {
            this.gbRoute = from;
        }
    },
    methods: {
        goRoute(type) {
            this.$router.push('/noticelist/' + type + '/0')
        }
    }
}
</script>

<style scoped>
    .noticetype{
        background: #F1F1F1;
        height: 100%;
    }
    .aui-jop-chang {
        width: 100%;
        /* padding: 35px 0; */
        text-align: center;
        background-image: -webkit-linear-gradient(left,#de442c,#de442c);
        background-image: -moz-linear-gradient(left,#de442c,#de442c);
        background-image: linear-gradient(to right,#de442c,#de442c);
        background-color: #fe7844;
        height: 230px;
        color: #fff;
        font-size: 0.95rem;
    }
    .aui-jop-chang img{
        max-width: 80%;
    }
    .notice-form{
        position: absolute;
        left: 10px;
        right: 10px;
        top: 250px;
        background: #fff;
        padding: 60px 20px 40px;
        border-radius: 3px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
        max-width: 730px;
    }
   .cell-list li{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    min-height: inherit;
    overflow: hidden;
    padding: 0 10px;
    width: 100%;
    height: 43px;
    line-height: 43px;
    position: relative;
    border: 1px solid #eee;
    margin-bottom: 15px;
    border-radius: 6px;
}

.cell-list li:active{
    background: #faeaea;
}
.cell-list li span{
    font-size: 15px;
    padding-left: 6px;
}
/* .cell-list li i{
    color: #777;
} */
.cell-list li span i{
    color: #de442c
}

</style>