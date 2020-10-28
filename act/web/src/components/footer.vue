<template>
    <div class="footer-warp">
        <div class="footer">
            <ul>
                <li class="footerNav" v-for="(item, idx) in menuList" :key="idx" 
                :class="{'active': item.url === currentUrl}"
                @click="goRoute(item.url)">
                    <img v-if="item.url === currentUrl" :src="'/static/img/footnav' + (idx+1) + '-2.png'">
                    <img v-else :src="'/static/img/footnav' + (idx+1) + '.png'">
                    <p>{{ item.name }}</p>
                </li>
                <!-- <li class="footerNav"><img src="@/assets/img/footnav2.png"><p>搜索</p></li>
                <li class="footerNav"><img src="@/assets/img/footnav3.png"><p>彩图</p></li>
                <li class="footerNav"><img src="@/assets/img/footnav4.png"><p>黑白</p></li>
                <li class="footerNav"><img src="@/assets/img/footnav5.png"><p>我的</p></li> -->
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentUrl: '',
            menuList: [
                {url: '/home', name: '首页'},
                {url: '/search/col', name: '搜索'},
                {url: '/tu/col', name: '彩图'},
                {url: '/tu/black', name: '黑白'},
                {url: '/my', name: '我的'}
            ]
        }
    },
    watch: {
        '$route' (n, o) {
            this.currentUrl = n.path;
        }
    },
    created() {
        var rt = this.$route;
        this.currentUrl = rt.path;
    },
    methods: {
        goRoute(url) {
            if (this.currentUrl == url) return;
            this.$router.push(url);
        }
    }
}
</script>

<style scoped>
.footer-warp{
    height: 50px;
}
.footer {
    width: 100%;
    max-width: 750px;
    height: 50px;
    margin: 0 auto;
    font-size: 12px;
    text-align: center;
    color: #333;
    border-top: solid 1px #eee;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 9;
}
.footer ul {
    display: flex;
}
.footer ul li.active {
    color: #0084ff;
}
.footer ul li {
    flex: 1;
    width: 20%;
    height: 50px;
    padding: 6px 0 3px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.footer ul li img {
    width: 20px;
    margin-bottom: 2px;
}
.footer ul li p{
    width: 100%;
    /* padding-bottom: 5px; */
}
</style>