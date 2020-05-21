<template>
  <div class="address">
    <my-header title="地址管理" :bkUrl="gbRoute">
        <div class="add-address" slot="h-right" @click="goRoute('add')">
            <i class="iconfont">&#xe6a9;</i>
        </div>
    </my-header>
    <div class="tip-default" v-if="(defaultList < 1 && list.length > 0)">请设置一个默认地址</div>
    <ul class="site_list" v-if="list.length > 0">
        <li v-for="(item, idx) in list" :key="item.id" :class="{default: item.status == 2}">
            <div class="select" @click="setDefault(item.id, idx)">
                <span class="txt">{{item.status === 2 ? '默认' : '设为默认'}}</span>
            </div>
            <div class="site_info">
                <div class="info">
                    <p>
                        <span>{{ item.name }}</span>
                        <span>&nbsp;&nbsp;{{ item.phone }}</span>
                    </p>
                    <p class="detial">{{ item.city + item.address }}</p>
                </div>
                <div class="btn_container">
                    <div class="compile" @click="goRoute(item.id)">
                        <i class="iconfont">&#xe718;</i>
                        <span>&nbsp;编辑</span>
                    </div>
                    <div class="remove" @click="deleteAddress(item.id)">
                        <i class="iconfont">&#xe62c;</i>
                        <span>&nbsp;删除</span>
                    </div>
                </div>
            </div>
        </li>
    </ul>
    <div v-else class="ui-bank-card card-created" @click="goRoute('add')">
        <i class="iconfont icon-jia">&#xe6a9;</i>
        添加地址
    </div>
  </div>
</template>

<script>
export default {
  data() {
        return {
            list: [],
            user: {},
            defaultList: [],
            gbRoute: '/my',
            from: ''
        };
    },
    created() {
        var from = this.$route.query.from;
        if (from) {
            this.from = from;
            this.gbRoute = from;
        }
        var user = this.$store.state.user;
        this.user = user;
        this.getList();
    },
    methods: {
        goRoute(value) {
            this.$router.push('/addressedit/' + value)
        },
        getList(update) {
            this.$http.post('/grab/addressList', { userId: this.user.id}, {loading: true}).then(response => {
                this.list = response.list;
                this.defaultList = response.list.filter(item => item.status == 2);
                if (update) {
                    this.$Toast({
                        message: '设置成功',
                        duration: 1500
                    })
                }
            }).catch(() => {})
        },
        setDefault(id, idx) {
            this.$http.post('/grab/updateAddress', { userId: this.user.id, id: id}, {loading: true}).then(response => {
                // var obj = JSON.parse(JSON.stringify(this.list[idx]));
                // obj.status = 2;
                // this.list.splice(idx, 1, obj);
                this.getList(true);
            }).catch(() => {})
        },
        deleteAddress(id) {
            this.$http.post('/grab/deleteAddress', { userId: this.user.id, id: id}, {loading: true}).then(response => {
                this.getList();
            }).catch(() => {})
        }
    }
};
</script>

<style scoped>
.ui-bank-card {
    width: 90.13333333vw;
    height: 90px;
    padding: 10px;
    margin: auto;
    margin-top: 3.73333333vw;
    box-shadow: 0 0 2.66666667vw 0.8vw #d8ecf7;
    border: 1px solid #eee;
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
}
.ui-bank-card.card-created {
    text-align: center;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.ui-bank-card.card-created .icon-jia {
    display: inline-block;
    width: 25px;
    height: 25px;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1px solid #eee;
    text-align: center;
    line-height: 25px;
    color: #e62c2c;
    margin-right: 5px;
}
.add-address{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    overflow: hidden;
    margin-top: 10px;
}
.add-address i{
    color: #de442c;
    font-size: 20px;
    float: left;
    margin-top: -9px;
    margin-left: 2px;
}
.add-address:active{
    background: #de442c;
}
.site_list li{
    display: flex;
    justify-content: space-between;
    height: 80px;
    border-bottom: 10px solid #f1f1f1;
    padding: 10px;
    overflow: hidden;
}
.select{
    width: 70px;
    position: relative;
    color: rgb(239, 99, 98);
    font-size: 12px;
    padding-left: 14px;
    line-height: 50px;
}
.select::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgb(239, 99, 98);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
}
.default .select::before {
    background: rgb(239, 99, 98);
}
.site_info{
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
}
.site_info .detial{
    color: #666;
    font-size: 13px;
    line-height: 14px;
    margin-top: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.btn_container {

}
.btn_container > div{
    /* background: #4395ff; */
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    padding: 0 10px;
    font-size: 12px;
    color: #4395ff;
    border-radius: 6px;
}
.btn_container > div * {
    float: left;
}
.btn_container .compile i{
    font-size: 14px;
}
.btn_container .remove{
    color: #de442c;
    margin-top: 10px;
}
.btn_container .remove i{
    margin-top: -1px;
}
.tip-default{
    line-height: 30px;
    font-size: 13px;
    color: #de442c;
    background: rgba(255, 174, 162, 0.32);
    padding-left: 10px;
}
</style>