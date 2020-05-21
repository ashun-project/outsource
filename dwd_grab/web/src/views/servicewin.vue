<template>
    <div class="goods">
        <my-header title="在线客服" bkUrl="/service"></my-header>
        <iframe id="iframe" src="https://kefu4.ziyun.com.cn/vclient/chat/?websiteid=174518&wc=c54c9c&groupid=44854" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },
    created() {
        this.$Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
        });
    },
    mounted() {
        var iframe = document.getElementById('iframe');
        var vm = this;
        iframe.onload = function () {
            vm.$Indicator.close();
        }
    }
}
</script>

<style scoped>
.goods{
    height: 100%;
    position: relative;
}
.goods >>> .head-vue{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
iframe{
width:100%;
border: 0;
height:100%;
padding-top: 44px;
}
</style>