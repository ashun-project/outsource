<template>
    <div class="my">
        <div class="set" @click="goRoute('set')">
            <i class="iconfont">&#xe614;</i>
        </div>
        <div class="user-info">
            <div class="toxiang">
                <!-- <i class="iconfont">&#xe666;</i> -->
                <svg t="1587545038944" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8710" width="60" height="60"><path d="M310.956564 662.25202zM307.071733 652.841638zM303.914275 643.972652c0.219038 0.669513 0.471139 1.326628 0.69431 1.992009-0.231437-0.661248-0.471139-1.322495-0.69431-1.992009zM539.239951 781.611372a3.0872 3.0872 0 0 0 0.962942-0.181843c-0.698443 0.086789-1.401019 0.136382-2.103594 0.219038l1.140652-0.037195zM315.841531 672.418704zM292.044878 564.370822a1501.734968 1501.734968 0 0 0-0.169445-17.436277c-0.02893 5.926433 0.02893 11.737148 0.169445 17.436277zM729.39414 534.32951c-0.169445 10.910588-0.376085 22.056745-0.376085 33.368215 0 21.507083-2.49621 41.373445-7.021624 59.661078 7.401842-28.264209 9.476507-58.218732 7.397709-93.029293z" fill="#002738" p-id="8711"></path><path d="M507.843081 8.435042c-280.451702 0-507.838272 227.266719-507.838272 507.722553 0 187.54226 101.608982 351.250672 252.745422 439.200756 0.421545-1.169582 0.818294-2.359828 1.25637-3.52941 16.915544-45.564103 44.76234-81.97819 79.184418-109.176136 22.445228-17.886752 48.200828-32.198633 76.609685-42.39838-58.995698-51.403747-60.739739-65.430465-40.489026-63.53351a193.757989 193.757989 0 0 1-47.122168-53.015538c0.396749 0.648849 0.739771 1.310097 1.144785 1.963079-193.113273-186.203234-50.234165-534.188995 184.508786-411.072929l0.23557 0.115718c161.344451-84.825688 283.667019 58.342716 280.381444 212.863916-0.938145 70.860962-28.115428 143.685003-89.785046 196.799729 0.442209-0.789365 0.830692-1.582862 1.268769-2.368093-13.46879 22.879172-31.000121 41.844584-51.180576 56.966493 10.183215 3.32277 5.996691 19.816769-28.22288 61.500174h-0.264499c27.788937 10.046833 53.019671 24.02809 75.084682 41.456101 34.029462 26.623488 61.73161 62.17382 78.911653 106.630332 144.858718-89.433758 241.413288-249.592096 241.413288-432.406435-0.004133-280.451702-227.38657-507.718421-507.842405-507.71842z" fill="#002738" p-id="8712"></path><path d="M538.103431 781.648567c0.702576-0.082656 1.405151-0.13225 2.103595-0.219038 10.551034-3.149192 88.218715-49.08938 108.560349-42.452106 20.180455-15.121909 37.711786-34.087322 51.180576-56.966494 9.943513-18.072728 17.167645-36.000807 22.052612-54.652126 4.529547-18.287633 7.021625-38.149862 7.021625-59.661078 0-11.311469 0.20664-22.46176 0.376085-33.368215-0.793497-13.369603-2.18625-27.445914-4.1204-42.423176-95.711479 5.856175-163.658818-27.883991-217.426526-82.002987-75.208666 51.312825-146.904453 80.949123-214.029366 82.002987-1.074528 19.498543-1.843228 37.761379-1.938282 55.028211 0.086789 5.740457 0.152914 11.555304 0.169445 17.436277 0.739771 29.082503 3.979885 55.276179 11.865264 79.605963 0.227304 0.669513 0.462873 1.326628 0.69431 1.992009 0.776966 2.310234 1.603526 4.595672 2.467281 6.872844 1.103457 2.851631 2.248242 5.661934 3.459152 8.422643 0.144648 0.326491 0.276897 0.661248 0.425678 0.987739 1.330761 2.98388 2.73178 5.901636 4.186525 8.773931 0.23557 0.462873 0.462873 0.934012 0.698443 1.392753 1.186113 2.297836 2.434218 4.53368 3.694722 6.757126 0.867888 1.512604 1.731643 3.029341 2.653256 4.533679a193.757989 193.757989 0 0 0 47.122168 53.015539c31.421667 2.93842 115.805145 44.21681 121.429884 43.716742 19.167919 2.52514 28.243545 1.789502 47.353604 1.206777zM695.356412 841.933698c35.033732 27.66082 62.062234 63.967454 78.804201 106.692324l0.10332-0.066125c-17.17591-44.45238-44.873925-80.002712-78.907521-106.626199zM333.191019 842.656937c-34.422078 27.197947-62.264741 63.612034-79.184418 109.176137 16.485733-43.753937 43.708476-80.907795 79.184418-109.176137z" fill="#FCE9EA" p-id="8713"></path><path d="M695.356412 841.933698c-22.065011-17.428011-47.295745-31.413401-75.084682-41.456101l-210.363573-0.119852-0.107453-0.095054c-28.408856 10.199747-54.164456 24.511628-76.609685 42.398379-35.471809 28.272474-62.698685 65.422199-79.184418 109.176136-0.438077 1.165449-0.834825 2.355695-1.25637 3.52941 74.964831 43.629953 162.104886 68.633384 255.09285 68.633384 97.670425 0 188.88542-27.590562 266.317532-75.365712-16.741966-42.737269-43.770468-79.03977-78.804201-106.70059z" fill="#B0C11D" p-id="8714"></path><path d="M620.27173 800.473464h0.264499c34.219571-41.683405 38.406096-58.177404 28.222881-61.500174-20.341634-6.633141-98.009315 39.307046-108.56035 42.452106a3.124396 3.124396 0 0 1-0.962942 0.181843l-1.136519 0.037195c-19.11006 0.586857-28.181553 1.318363-47.36187-1.206777-5.624739 0.500069-90.008217-40.778322-121.429884-43.716742-20.250712-1.896954-18.510804 12.133896 40.489026 63.53351l0.107453 0.095055 210.367706 0.123984z" fill="#FF5947" p-id="8715"></path><path d="M315.841531 672.418704c-0.239702-0.458741-0.462873-0.92988-0.698442-1.392753a180.789268 180.789268 0 0 1-4.186525-8.773931l-0.425679-0.987739a184.876605 184.876605 0 0 1-5.926432-15.295487c-0.223171-0.665381-0.475272-1.322495-0.694311-1.992009-7.885379-24.329784-11.125493-50.523461-11.865264-79.605963a563.192974 563.192974 0 0 1-0.169445-17.436277c0.095054-17.266832 0.859622-35.529668 1.938283-55.028211 67.124912-1.053864 138.8207-30.694294 214.029365-82.002987v-135.30782c-234.742951-123.116065-377.622059 224.869696-184.508786 411.072929-0.409147-0.648849-0.748037-1.310097-1.144785-1.963079-0.921614-1.500206-1.785369-3.016943-2.653257-4.53368-1.281168-2.235844-2.521007-4.488219-3.694722-6.752993zM698.675049 684.379023c61.669618-53.118858 88.846901-125.938767 89.785046-196.799729-1.49194 69.976543-28.727082 142.279852-89.785046 196.799729z" fill="#FECF77" p-id="8716"></path><path d="M507.843081 409.903347c53.77184 54.123128 121.715047 87.863295 217.426526 82.002987 1.93415 14.977262 3.326903 29.053573 4.1204 42.423176 2.078798 34.810561 0.004133 64.765084-7.397709 93.029293-4.884968 18.651319-12.109099 36.579399-22.052613 54.652126-0.433944 0.785232-0.822427 1.578729-1.268769 2.368094 61.053831-54.515744 88.293106-126.823186 89.785046-196.799729 3.285575-154.525334-119.036993-297.689604-280.381444-212.863916l-0.23557-0.115719v135.303688z" fill="#FF9F31" p-id="8717"></path></svg>
            </div>
            <div class="info">
                <p>{{ user.phone }}</p>
                <span @click="getCopy">邀请码： {{ user.invite }}
                    <!-- <b>复制</b> -->
                    <svg t="1587545676752" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9629" width="20" height="20"><path d="M818.500072 355.760219H284.184491V783.082855h569.763515V355.760219z" fill="#98C4D8" p-id="9630"></path><path d="M758.987761 332.01939v-71.220439H189.223223v427.323659h71.220439V332.01939h474.804294z" fill="#98C4D8" p-id="9631"></path><path d="M794.759243 332.01939H260.443662v427.32366h569.764539V332.01939z" fill="#EFD9A0" p-id="9632"></path><path d="M735.247956 308.279585v-71.22044H165.483418V664.381781h71.220439V308.279585h474.80327z" fill="#EFD9A0" p-id="9633"></path><path d="M355.071327 414.779549a21.358248 45.386789 55.515 1 0 74.82234-51.395133 21.358248 45.386789 55.515 1 0-74.82234 51.395133Z" fill="#FEFEFE" p-id="9634"></path><path d="M309.208504 489.470229a14.239173 24.918297 55.515 1 0 41.079031-28.217004 14.239173 24.918297 55.515 1 0-41.079031 28.217004Z" fill="#FEFEFE" p-id="9635"></path></svg>
                </span>
            </div>
            <div class="cz-tx">
                <div><button class="cz" @click="goRoute('rechargetype')">充值</button></div>
                <div><button class="tx" @click="goRoute('withdraw')">提现</button></div>
            </div>
        </div>
        <div class="money">
            <div>
                <span>{{ user.amount || 0 }}</span>
                <p>总余额</p>
            </div>
            <div>
                <span>{{ successAmount.toFixed(2) }}</span>
                <p>今日收益</p>
            </div>
            <div class="no-af">
                <span>{{ frozenAmount.toFixed(2) }}</span>
                <p>冻结金额</p>
            </div>
            <div class="refresh no-af">
                <div :class="{loading: loading}" @click="refresh">
                    <i class="iconfont">&#xe64d;</i>
                </div>
            </div>
        </div>
        <!-- <div class="line"></div> -->
        <div class="gift" @click="$router.push('/share')">
            <img src="@/assets/img/gift.jpg" alt="">
        </div>
        <div class="cell-list">
            <ul>
                <li @click="goRoute('rechargenotes')">
                    <p>
                        <i class="iconfont">&#xe63e;</i>
                        <span>充值记录</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
                <li @click="goRoute('withdrawnotes')">
                    <p>
                        <i class="iconfont">&#xe68c;</i>
                        <span>提现记录</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
                <li @click="goRoute('commission')">
                    <p>
                        <i class="iconfont">&#xe62d;</i>
                        <span>团队佣金</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
                <!-- <li @click="goRoute('bankcard')">
                    <p>
                        <i class="iconfont">&#xe767;</i>
                        <span>收益记录</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li> -->
                <li @click="goRoute('address')">
                    <p>
                        <i class="iconfont">&#xe601;</i>
                        <span>地址管理</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
                <li @click="goRoute('grabnotes')">
                    <p>
                        <i class="iconfont">&#xe610;</i>
                        <span>抢单记录</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
                <li @click="goRoute('bankcard')">
                    <p>
                        <i class="iconfont">&#xe68e;</i>
                        <span>绑定银行卡</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
                <li @click="goRoute('noticetype')">
                    <p>
                        <i class="iconfont">&#xe602;</i>
                        <span>平台公告</span>
                    </p>
                    <i class="iconfont">&#xe6e0;</i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            user: {},
            successAmount: 0,
            frozenAmount: 0
        }
    },
    created() {
        var user = this.$store.state.user;
        if (!Number(user.id)) {
            this.$Toast({
                message: '请重新登录',
                duration: 1500
            })
            localStorage.setItem('user', JSON.stringify({}));
            this.$store.commit('userChange', {});
            this.$router.push('/');
            return
        }
        this.getOrder(user.id);
        this.getUser(user.id);
    },
    methods: {
        getCopy(val) {
            var loaction = window.location.origin;
            var url = loaction + '/#/register?from=' + this.user.invite;
            var err = false;
            var input = document.createElement('input');
            input.value = url;
            document.getElementsByTagName('body')[0].appendChild(input);
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios
                var range = document.createRange();
                range.selectNode(input);
                window.getSelection().addRange(range);
                var successful = document.execCommand('copy');
                if (!successful) {
                    err = true;
                    this.$Message('提示', '您的浏览器不支持点击复制。请手动复制');
                }
                window.getSelection().removeAllRanges();
            } else {
                input.select();
                document.execCommand('copy');
            }
            input.parentNode.removeChild(input);
            if (!err) {
                this.$Toast({
                    message: '复制成功',
                    duration: 1500
                })
            }
        },
        refresh() {
            this.getOrder(this.user.id);
            this.getUser(this.user.id);
        },
        getOrder(id) {
            this.successAmount = 0;
            this.frozenAmount = 0;
            this.$http.post('/grab/todayOrder', {userId: id}, {loading: true}).then(response => {
                var list = response.list || [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].status === 2) {
                        this.successAmount += list[i].earn;
                    }
                    if (list[i].status === 1) {
                        this.frozenAmount += (list[i].price * list[i].item);
                    }
                }
                this.$store.commit('frozenChange', this.frozenAmount);
            }).catch(() => {})
        },
        goRoute(val) {
            if (val == 'withdraw' && !this.user.capital) {
                this.$Message.alert('请先在设置资金密码').then(action => {
                    this.$router.push({ path: '/trade', query: { from: '/my' } });
                })
                return
            }
            this.$router.push('/' + val)
        },
        getUser(id) {
            this.loading = true;
            this.$http.post('/grab/queryUser', { id: id }).then(response => {
                localStorage.setItem('user', JSON.stringify(response.userInfo || ''));
                this.$store.commit('userChange', response.userInfo);
                this.$set(this, 'user', response.userInfo);
                setTimeout( () => {
                    this.loading = false;
                }, 300)
            }).catch(() => {})
        }
    }
}
</script>

<style scoped>
.set{
   position: absolute;
   top: 10px;
   right: 10px; 
   color: #f2f2f2;
}
.set:active{
    color: #d9d9d9;
}
.set i{
    font-size: 20px;
}
.user-info{
    background: url(../assets/img/mycenter-bg.png);
    height: 160px;
    background-size: 100% 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0 0 10px;
}
.user-info .info{
    color: #f1f1f1;
    margin-top: 6px;
    margin-left: 10px;
    line-height: 25px;
    font-size: 14px;
}
.user-info .info span{
    display: block;
    background: rgba(0, 0, 0, 0.61);
    padding: 0 40px 0 10px;
    border-radius: 17px;
    position: relative;
}
.user-info .info span .icon{
    position: absolute;
    right: 10px;
    top: 2px;
}
.user-info .cz-tx{
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: center;
}
.user-info .cz-tx div{
    width: 50%;
}
.user-info .cz-tx button{
    width: 100px;
    height: 30px;
    border-radius: 15px;
    background-image: linear-gradient(90deg,#521b1c,#b90000);
    color: #fff;
    font-size: 14px;
    border: 0;
    outline: none;
}
.user-info .cz-tx button:active{
    background: #333 !important;
    color: #fff !important;
}
.user-info .cz-tx button.tx{
    background-image: linear-gradient(90deg,#ffde04,#bbb064);
    color: #333;
    font-size: 14px;
    border: 0;
}
.money {
    display: flex;
    padding: 20px 0 20px;
}
.money > div{
    width: 29%;
    text-align: center;
    font-size: 12px;
    color: #666;
    position: relative;
}
.money > div span{
    font-size: 16px;
    font-weight: 600;
    color: #de442c;
    display: block;
    margin-bottom: 3px;
}
.money div.refresh{
    width: 13%;
    padding-top: 9px;
}
.money div.refresh > div{
    width: 22px;
    height: 22px;
    margin: 0 auto;
}
.money div.refresh i{
    font-size: 22px;
    color: #de442c;
}
.money > div::after{
    content: '';
    height: 10px;
    width: 1px;
    background: #999;
    position: absolute;
    right: 0;
    top: 50%;
}
.money > div.no-af::after{
    width: 0;
}
.gift{
    display: flex;
    align-content: center;
    align-items: center;
}
.gift img{
    width: 100%;
}
.cell-list li{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    min-height: inherit;
    overflow: hidden;
    padding: 0 10px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    position: relative;
}
.cell-list li::after{
    content: '';
    position: absolute;
    border-bottom: 1px solid #d9d9d9;
    transform: scaleY(0.5);
    bottom: 0;
    left: 0;
    right: 0;
}
.cell-list li:last-child::after{
    border: 0;
}
.cell-list li:active{
    background: #faeaea;
}
.cell-list li span{
    font-size: 15px;
    padding-left: 6px;
}
/* .cell-list li i{
    color: #777;
} */
.cell-list li i{
    color: #de442c;
}

/* loadding效果 */
.loading{
    width: 22px;
    height: 22px;
    -webkit-animation: animal 2s infinite linear ;
    -webkit-transform-origin: center center;
    -ms-transform-origin: center center;
    transform-origin: center center;
}
@-webkit-keyframes animal {
    0%{
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
}
</style>