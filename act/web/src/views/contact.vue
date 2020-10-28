<template>
    <div class="contact">
        <mt-header title="联系我们">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <div class="lx-list">
            <ul>
                <li>QQ号：1165533390</li>
                <li>微信号：</li>
                <li>官方网址：https://00858tk.com</li>
            </ul>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.lx-list {
    padding: 10px 15px;
}
.lx-list li {
    padding: 15px 0;
    border-bottom: solid 1px #eee;
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