<template>
    <div class="layout">
        <el-row style="height: 100%;">
            <el-col :span="4" class="menu-box">
                <div class="system-title">
                    <!-- <h6>抢单包后台管理系统</h6> -->
                    <img src="@/assets/img/logo.png" alt="">
                </div>
                <el-menu
                    router
                    :default-active="menuSelect"
                    :default-openeds="openeds"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#1b2329"
                    text-color="#5F6B87"
                    active-text-color="#ffd04b">
                    <el-menu-item index="/home">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu index="finance">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>
                            <span>财务管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/recharge">充值列表</el-menu-item>
                            <el-menu-item index="/rechargeExamine">充值审核</el-menu-item>
                            <el-menu-item index="/withdraw">提现列表</el-menu-item>
                            <el-menu-item index="/withdrawExamine">提现审核</el-menu-item>
                            <el-menu-item index="/zhifubao">平台支付宝</el-menu-item>
                            <el-menu-item index="/weixin">平台微信</el-menu-item>
                            <el-menu-item index="/banks">平台银行卡</el-menu-item>
                            <el-menu-item index="/reportList">全局报表</el-menu-item>
                            <el-menu-item index="/billList">资金明细</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="user">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span>会员管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/userList">会员列表</el-menu-item>
                            <el-menu-item index="/userBankList">用户银行卡</el-menu-item>
                            <el-menu-item index="/userAddressList">用户地址</el-menu-item>
                            <!-- <el-menu-item index="/verifyCodeList">短信验证码</el-menu-item> -->
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="order">
                        <template slot="title">
                            <i class="el-icon-takeaway-box"></i>
                            <span>抢单管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/orderList">抢单列表</el-menu-item>
                            <el-menu-item index="/profit">每日收益</el-menu-item>
                            <!-- <el-menu-item index="/userAddressList">用户地址</el-menu-item> -->
                            <!-- <el-menu-item index="/verifyCodeList">短信验证码</el-menu-item> -->
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="store">
                        <template slot="title">
                            <i class="el-icon-sell"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/storeList">分类列表</el-menu-item>
                            <el-menu-item index="/goodList">商品列表</el-menu-item>
                            <!-- <el-menu-item index="/userAddressList">用户地址</el-menu-item> -->
                            <!-- <el-menu-item index="/verifyCodeList">短信验证码</el-menu-item> -->
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="system">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/bannerList">轮播图列表</el-menu-item>
                            <el-menu-item index="/noticeList">公告列表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col class="content-box">
                <!-- <keep-alive>
                    <router-view></router-view>
                </keep-alive> -->
                <div class="cont-top">
                    <div class="current">
                        <svg t="1588582359853" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2144" width="200" height="200"><path d="M160 172.462933h704a32 32 0 1 1 0 64h-704a32 32 0 1 1 0-64z m0 320h704a32 32 0 0 1 0 64h-704a32 32 0 1 1 0-64z m0 298.666667h704a32 32 0 0 1 0 64h-704a32 32 0 1 1 0-64z" p-id="2145"></path></svg>
                        <span>{{ titleTxt }}</span>
                    </div>
                    <div class="account">
                        <div class="my-audio" style="width:0">
                            <audio id="chukuan">
                            　<source src="/static/video/chu.mp3" type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                            <audio id="rukuan">
                            　<source src="/static/video/ru.mp3" type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        <div class="churukuan">
                            <div @click="goPay('/rechargeExamine')">
                                入款
                                <span>
                                    <b v-if="rechargeStore.length > 9" class="ddd">...</b>
                                    <b v-else>{{rechargeStore.length}}</b>
                                </span>
                            </div>
                            <div @click="goPay('/withdrawExamine')" class="dg">
                                出款
                                <span>
                                    <b v-if="withdrawStore.length > 9" class="ddd">...</b>
                                    <b v-else>{{withdrawStore.length}}</b>
                                </span>
                            </div>
                        </div>
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                <svg t="1588582660303" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3026" width="30" height="30"><path d="M310.956564 662.25202zM307.071733 652.841638zM303.914275 643.972652c0.219038 0.669513 0.471139 1.326628 0.69431 1.992009-0.231437-0.661248-0.471139-1.322495-0.69431-1.992009zM539.239951 781.611372a3.0872 3.0872 0 0 0 0.962942-0.181843c-0.698443 0.086789-1.401019 0.136382-2.103594 0.219038l1.140652-0.037195zM315.841531 672.418704zM292.044878 564.370822a1501.734968 1501.734968 0 0 0-0.169445-17.436277c-0.02893 5.926433 0.02893 11.737148 0.169445 17.436277zM729.39414 534.32951c-0.169445 10.910588-0.376085 22.056745-0.376085 33.368215 0 21.507083-2.49621 41.373445-7.021624 59.661078 7.401842-28.264209 9.476507-58.218732 7.397709-93.029293z" fill="#002738" p-id="3027"></path><path d="M507.843081 8.435042c-280.451702 0-507.838272 227.266719-507.838272 507.722553 0 187.54226 101.608982 351.250672 252.745422 439.200756 0.421545-1.169582 0.818294-2.359828 1.25637-3.52941 16.915544-45.564103 44.76234-81.97819 79.184418-109.176136 22.445228-17.886752 48.200828-32.198633 76.609685-42.39838-58.995698-51.403747-60.739739-65.430465-40.489026-63.53351a193.757989 193.757989 0 0 1-47.122168-53.015538c0.396749 0.648849 0.739771 1.310097 1.144785 1.963079-193.113273-186.203234-50.234165-534.188995 184.508786-411.072929l0.23557 0.115718c161.344451-84.825688 283.667019 58.342716 280.381444 212.863916-0.938145 70.860962-28.115428 143.685003-89.785046 196.799729 0.442209-0.789365 0.830692-1.582862 1.268769-2.368093-13.46879 22.879172-31.000121 41.844584-51.180576 56.966493 10.183215 3.32277 5.996691 19.816769-28.22288 61.500174h-0.264499c27.788937 10.046833 53.019671 24.02809 75.084682 41.456101 34.029462 26.623488 61.73161 62.17382 78.911653 106.630332 144.858718-89.433758 241.413288-249.592096 241.413288-432.406435-0.004133-280.451702-227.38657-507.718421-507.842405-507.71842z" fill="#002738" p-id="3028"></path><path d="M538.103431 781.648567c0.702576-0.082656 1.405151-0.13225 2.103595-0.219038 10.551034-3.149192 88.218715-49.08938 108.560349-42.452106 20.180455-15.121909 37.711786-34.087322 51.180576-56.966494 9.943513-18.072728 17.167645-36.000807 22.052612-54.652126 4.529547-18.287633 7.021625-38.149862 7.021625-59.661078 0-11.311469 0.20664-22.46176 0.376085-33.368215-0.793497-13.369603-2.18625-27.445914-4.1204-42.423176-95.711479 5.856175-163.658818-27.883991-217.426526-82.002987-75.208666 51.312825-146.904453 80.949123-214.029366 82.002987-1.074528 19.498543-1.843228 37.761379-1.938282 55.028211 0.086789 5.740457 0.152914 11.555304 0.169445 17.436277 0.739771 29.082503 3.979885 55.276179 11.865264 79.605963 0.227304 0.669513 0.462873 1.326628 0.69431 1.992009 0.776966 2.310234 1.603526 4.595672 2.467281 6.872844 1.103457 2.851631 2.248242 5.661934 3.459152 8.422643 0.144648 0.326491 0.276897 0.661248 0.425678 0.987739 1.330761 2.98388 2.73178 5.901636 4.186525 8.773931 0.23557 0.462873 0.462873 0.934012 0.698443 1.392753 1.186113 2.297836 2.434218 4.53368 3.694722 6.757126 0.867888 1.512604 1.731643 3.029341 2.653256 4.533679a193.757989 193.757989 0 0 0 47.122168 53.015539c31.421667 2.93842 115.805145 44.21681 121.429884 43.716742 19.167919 2.52514 28.243545 1.789502 47.353604 1.206777zM695.356412 841.933698c35.033732 27.66082 62.062234 63.967454 78.804201 106.692324l0.10332-0.066125c-17.17591-44.45238-44.873925-80.002712-78.907521-106.626199zM333.191019 842.656937c-34.422078 27.197947-62.264741 63.612034-79.184418 109.176137 16.485733-43.753937 43.708476-80.907795 79.184418-109.176137z" fill="#FCE9EA" p-id="3029"></path><path d="M695.356412 841.933698c-22.065011-17.428011-47.295745-31.413401-75.084682-41.456101l-210.363573-0.119852-0.107453-0.095054c-28.408856 10.199747-54.164456 24.511628-76.609685 42.398379-35.471809 28.272474-62.698685 65.422199-79.184418 109.176136-0.438077 1.165449-0.834825 2.355695-1.25637 3.52941 74.964831 43.629953 162.104886 68.633384 255.09285 68.633384 97.670425 0 188.88542-27.590562 266.317532-75.365712-16.741966-42.737269-43.770468-79.03977-78.804201-106.70059z" fill="#B0C11D" p-id="3030"></path><path d="M620.27173 800.473464h0.264499c34.219571-41.683405 38.406096-58.177404 28.222881-61.500174-20.341634-6.633141-98.009315 39.307046-108.56035 42.452106a3.124396 3.124396 0 0 1-0.962942 0.181843l-1.136519 0.037195c-19.11006 0.586857-28.181553 1.318363-47.36187-1.206777-5.624739 0.500069-90.008217-40.778322-121.429884-43.716742-20.250712-1.896954-18.510804 12.133896 40.489026 63.53351l0.107453 0.095055 210.367706 0.123984z" fill="#FF5947" p-id="3031"></path><path d="M315.841531 672.418704c-0.239702-0.458741-0.462873-0.92988-0.698442-1.392753a180.789268 180.789268 0 0 1-4.186525-8.773931l-0.425679-0.987739a184.876605 184.876605 0 0 1-5.926432-15.295487c-0.223171-0.665381-0.475272-1.322495-0.694311-1.992009-7.885379-24.329784-11.125493-50.523461-11.865264-79.605963a563.192974 563.192974 0 0 1-0.169445-17.436277c0.095054-17.266832 0.859622-35.529668 1.938283-55.028211 67.124912-1.053864 138.8207-30.694294 214.029365-82.002987v-135.30782c-234.742951-123.116065-377.622059 224.869696-184.508786 411.072929-0.409147-0.648849-0.748037-1.310097-1.144785-1.963079-0.921614-1.500206-1.785369-3.016943-2.653257-4.53368-1.281168-2.235844-2.521007-4.488219-3.694722-6.752993zM698.675049 684.379023c61.669618-53.118858 88.846901-125.938767 89.785046-196.799729-1.49194 69.976543-28.727082 142.279852-89.785046 196.799729z" fill="#FECF77" p-id="3032"></path><path d="M507.843081 409.903347c53.77184 54.123128 121.715047 87.863295 217.426526 82.002987 1.93415 14.977262 3.326903 29.053573 4.1204 42.423176 2.078798 34.810561 0.004133 64.765084-7.397709 93.029293-4.884968 18.651319-12.109099 36.579399-22.052613 54.652126-0.433944 0.785232-0.822427 1.578729-1.268769 2.368094 61.053831-54.515744 88.293106-126.823186 89.785046-196.799729 3.285575-154.525334-119.036993-297.689604-280.381444-212.863916l-0.23557-0.115719v135.303688z" fill="#FF9F31" p-id="3033"></path></svg>
                               <span>admin<i class="el-icon-arrow-down el-icon--right"></i></span>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>退出</el-dropdown-item>
                                <!-- <el-dropdown-item>5555555狮子头</el-dropdown-item> -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="content-master">
                    <router-view></router-view>
                </div>
            
            </el-col>
    </el-row>
    </div>
</template>

<script>
var chukuan = '';
var rukuan = '';
var timer = false;
export default {
    data() {
        return {
            menuSelect: '',
            openeds: [],
            titleTxt: '',
        }
    },
    computed: {
        withdrawStore () {
            return this.$store.state.withdraw
        },
        rechargeStore() {
            return this.$store.state.recharge
        }
    },
    watch: {
        '$route' (to, from) {
            this.titleTxt = to.meta.title;
        }   
    },
    created() {
        var route = this.$route
        this.menuSelect = route.path;
        this.openeds = [route.meta.parent];
        this.titleTxt = route.meta.title;
        this.getOrderNotice();
    },
    mounted() {
        chukuan = document.querySelector('#chukuan');
        rukuan = document.querySelector('#rukuan');
        timer = setInterval(() => {
            this.getOrderNotice();
        }, 15000)
    },
    destroyed() {
        if(timer) {
            clearInterval(timer)
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        },
        goPay(url) {
            if (this.menuSelect === url) {
                return
            }
            this.menuSelect = url;
            this.openeds = ['finance'];
            this.$router.push(url);
        },
        handleCommand() {
            this.$http.post('/admin/signout', this.loginForm).then(response => {
                this.$Message.success(response.message);
                this.$router.push('/login') 
            }).catch(() => {})
        },
        getOrderNotice() {
            // var timeSeconds = new Date().getTime() - 3000;
            // var startTime = this.$common.formatDate(timeSeconds, 2);
            // var endTime = this.$common.formatDate();
            this.$http.post('/admin/allWithdrawList', {status: 1}).then(response => {
                var list = response.list;
                this.setStore(list, 'withdraw');
            }).catch(() => {})
            this.$http.post('/admin/allRechargeList', {status: 1}).then(response => {
                var list = response.list;
                this.setStore(list, 'recharge')
            }).catch(() => {})
        },
        setStore(list, type) {
            // var oldList = JSON.parse(JSON.stringify(this[type + 'Store']));
            // var changed = false;
            // for (var i = 0; i < list.length; i++) {
            //     var filterArr = oldList.filter(item => item.id === list[i].id)
            //     if (!filterArr.length) {
            //         changed = true;
            //     }
            // }
            this.$store.commit(type + 'Change', list);
            if (list.length) {
                if (type == 'withdraw') {
                    chukuan.play();
                } else {
                    rukuan.play();
                }
            }
        }
    }
}
</script>

<style  scoped>
   .layout{
       height: calc(100vh);
   }
   .layout .system-title {
       text-align: center;
       padding: 30px 0 28px;
       border-bottom: 1px solid rgba(238, 238, 238, 0.03);
       /* margin-bottom: 10px; */
   }
   .layout .system-title img{
       max-width: 120px;
   }
   /* .layout .system-title h6{
       color: #fff;
       font-size: 16px;
       margin-top: 60px;
       margin-bottom: 10px;
       text-align: center;
       border-bottom: 1px solid rgba(238, 238, 238, 0.03);
       padding-bottom: 60px;
   } */
   .menu-box{
       position: fixed;
       left: 0;
       top: 0;
       bottom: 0;
       min-height: calc(100vh);
       background-color: #1b2329;
       overflow: auto;
   }
   .content-box{
       padding-left: 16.66667%;
       overflow: auto;
   }
   .cont-top{
       height: 50px;
       border-bottom:1px solid #eee;
       width: 100%;
       display: flex;
       justify-content: space-between;
       line-height: 50px;
       padding: 0 15px;
       font-size: 14px;
       box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
       position: relative;
       z-index: 1;
       overflow: hidden;
    }
    .cont-top .current{
        display: flex;
        color: khaki;
    }
    .cont-top .current .icon{
        width: auto;
        height: 20px;
        margin-top: 15px;
        fill: #3d4852;
    }
    .cont-top .current span{
        color: #e0523b;
        padding-left: 10px;
    }
    .cont-top .account{
        display: flex;
    }
    .cont-top .account .el-dropdown{
        font-size: 16px;
        cursor: pointer;
        padding-right: 2px;
    }
    .cont-top .account .icon{
        margin-top: 10px;
        margin-right: 10px;
        float: left;
    }
    .cont-top .account .el-dropdown-link > span{
        float: left;
    }
    .content-master{
        padding: 15px;
        min-height: calc(100vh - 50px);
        background: #f1f1f1;
    }
    .churukuan{
        display: flex;
        height: 100%;
        margin-right: 10px;
    }
    .churukuan > div{
        padding: 0 15px;
        position: relative;
        height: 25px;
        line-height: 25px;
        background: #66c23a;
        margin-top: 13px;
        margin-right: 15px;
        font-size: 12px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
    }
     .churukuan .dg{
        background: #f56b6c;
    }
    .churukuan > div span{
        position: absolute;
        right: -6px;
        top: -6px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
        background: #e0523b;
        text-align: center;
        display: block;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #fff;
        transform: scale(0.88);
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }
    .churukuan > div span .ddd{
        margin-top: -3px;
        display: block;
    }
</style>