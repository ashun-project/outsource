<template>
    <div class="head-vue">
        <div class="vuxPop-header header" :style="{zIndex: zIndex}">
            <div class="head-left">
                <slot name="h-left" v-if="!noHistory">
                    <i @click="goback()" class="iconfont" style="color: #fff; font-size:22px">&#xe62a;</i>
                </slot>
            </div>
            <div class="head-content">
                <slot name="h-center">
                    <span>{{title}}</span>
                </slot>
            </div>
            <div class="head-right">
                <slot name="h-right"></slot>
            </div>
        </div>
        <div style="height:44px"></div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            // default: '彩票'
        },
        zIndex: {
            type: Number
        },
        noHistory: {
            type: Boolean
        },
        bkUrl: {
            type: String
        }
    },
    data () {
        return {

        }
    },
    methods: {
        goback () {
            this.$store.commit('directionChange', 'out');
            if (this.bkUrl) {
                this.$router.push(this.bkUrl)
            } else {
                this.$router.back(-1)
            }
        }
    }
}
</script>

<style scoped>
.header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
    line-height: 44px;
    color: #ffffff;
    width: 100%;
    min-height: 44px;
    font-size: 18px;
    text-align: center;
    display: table;
    background-color: #de442c;
}
.header .head-content {
    text-align: center;
}

.header .head-left,
.header .head-right {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    font-size: 18px;
}
.header .head-right {
    right: 0;
    left: auto;
}
</style>

