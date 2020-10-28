<template>
    <div class="collect">
        <mt-header title="我的评论">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        
        <div class="sc-list">
            <ul>
                <li v-for="item in list" :key="item.id" @click="$router.push('/tudetail/' + item.zodiac_id)">
                    <div class="pic">
                        <img :src="'http://images.00858tk.com/zodiac/' + item.zodiac_type + '/' + item.issue.replace('2020', '') + '_' + item.zodiac_img">
                    </div>
                    <div class="txt">{{ item.zodiac_title }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },
    methods: {
        getList() {
            var user = this.$store.state.user;
            this.$http.post('/api/am/commentList', {user_id: user.id}).then(response => {
                this.list = response.data;
            })
        }
    },
    created() {
        this.getList();
    }
}
</script>

<style scoped>
.sc-list ul {
    padding: 10px;
}
.sc-list ul li {
    display: flex;
    align-items: center;
    height: 80px;
    border-bottom: solid 1px #eee;
    background: url(../assets/img/arr.png) right center no-repeat;
    background-size: 12px auto;
}
.sc-list ul li:active {
    background-color: #f1f1f1;
}
.sc-list ul li .pic img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    /* background: url(../images/loader.gif) center center no-repeat; */
    /* background-size: 50% auto; */
}
</style>