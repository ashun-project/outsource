<template>
    <div class="zx-kf">
        <my-header title="客服中心" bkUrl="/home"></my-header>
        <div class="tu">
            <img src="@/assets/img/banner/banner1.jpg" alt="">
        </div>
        <div class="kf">
            <p @click="$router.push('/servicewin')">
                <i class="iconfont">&#xe645;</i>充值客服
            </p>
            <p @click="$router.push('/servicewin')">
                <i class="iconfont">&#xe645;</i>提现客服
            </p>
            <p @click="$router.push('/servicewin')">
                <i class="iconfont">&#xe645;</i>活动咨询
            </p>
            <p @click="$router.push('/servicewin')">
                <i class="iconfont">&#xe645;</i>代理咨询
            </p>
        </div>
        <div class="tip">
            <span>客服服务时间：上午10点～晚上10点</span>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.zx-kf{
    height: 100%;
    background: #f1f1f1;
}
.tu{
    border-bottom: 8px solid #f1f1f1;
}
    .tu img{
        width: 100%;
    }
    .kf{
        display: flex;
        justify-content: space-between;
        padding: 10px;
        flex-wrap: wrap;
        background: #fff;
        padding-bottom: 20px;
    }
    .kf p{
        height: 40px;
        line-height: 40px;
        /* margin-left: 10px; */
        width: 48%;
        text-align: center;
        border: 1px solid #eee;
        margin-top: 20px;
        font-size: 14px;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .kf p a{
        text-decoration: none;
        color: #252525;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .kf p i{
        color: #de442c;
        font-size: 18px;
        padding-right: 15px;
    }
    .tip{
        font-size: 14px;
        color: #de442c;
        text-align: center;
        line-height: 30px;
        margin-top: 20px;
    }
</style>