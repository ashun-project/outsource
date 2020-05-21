<template>
    <div class="active-detail">
        <my-header title="活动详情" bkUrl="/active"></my-header>
        <div class="cont">
            <img :src="img" alt="">
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            headTitle: '',
            img: ''
        };
    },
    created() {
        this.img = '/static/active/' + this.$route.params.id + '.jpg'
        // var titleList = ['']
    },
    methods: {

    }
};
</script>

<style scoped>
    .active-detail{
        min-height: 100%;
        height: 100%;
    }
    .cont img{
        width: 100%;
    }
</style>