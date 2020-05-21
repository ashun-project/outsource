<template>
    <div class="active">
        <my-header title="活动列表" bkUrl="/home"></my-header>
        <ul>
            <li @click="goRoute('yq')">
                <img src="@/assets/img/h_yq.jpg" alt="">
                <p>查看详情
                    <i class="iconfont">&#xe6e0;</i>
                </p>
            </li>
            <li @click="goRoute('cj')">
                <img src="@/assets/img/h_cj.jpg" alt="">
                <p>查看详情
                    <i class="iconfont">&#xe6e0;</i>
                </p>
            </li>
            <li @click="goRoute('zl')">
                <img src="@/assets/img/h_zl.jpg" alt="">
                <p>查看详情
                    <i class="iconfont">&#xe6e0;</i>
                </p>
            </li>
            <li @click="goRoute('sr')">
                <img src="@/assets/img/h_sr.jpg" alt="">
                <p>查看详情
                    <i class="iconfont">&#xe6e0;</i>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    methods: {
        goRoute(id) {
            this.$router.push('/activedetail/' + id)
        }
    }
};
</script>

<style scoped>
.active{
    /* min-height: 100%;
    background: #f1f1f1; */
}
.active ul{
    /* padding-top: 10px; */
}
.active li{
    padding: 10px;
    margin: 10px;
    margin-top: 20px;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
.active li img{
    width: 100%;
}
.active li p{
    line-height: 30px;
    font-size: 14px;
}
.active li i{
    float: right;
    color: #de442c;
}
</style>