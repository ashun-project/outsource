<template>
    <div class="withdraw">
        <my-header title="提现" bkUrl="/my">
            <!-- <slot name="h-center">
                    <span>{{title}}</span>
            </slot> -->

            <div slot="h-right" class="shuoimg" @click="goRoute('withdrawquota')">
                <i class='iconfont'>&#xe719;</i>
                <span>限额说明</span>
            </div>
        </my-header>
        <div class="bank-list">
            <ul v-if="bankList.length > 0">
                <li class="ui-bank-card" v-for="(userBank,index) in bankList" :key="index">
                    <div class="cion">
                        <i class="iconfont">&#xe657;</i>
                    </div>
                    <div class="row">
                        <div class="row-top">
                            <span class="bankName">{{userBank.bank_name}}</span>
                            <span class="real-name">{{getRealName(userBank.payee)}}</span>
                        </div>
                        <p class="bank-dot">{{userBank.bank_dot}}</p>
                        <p class="bank-no">{{setInterNum(userBank.bank_no)}}</p>
                    </div>
                </li>
                
            </ul>
            <ul v-else class="list">
                <li class="ui-bank-card card-created" @click="addCard">
                    <i class="iconfont icon-jia">&#xe6a9;</i>
                    添加银行卡
                </li>
            </ul>
        </div>
        <div v-if="bankList.length == 0" class="bing-card">*&nbsp;请先绑定一张银行卡</div>
        <div class="input-money" v-if="bankList.length > 0">
            <p class="tt">提现金额</p>
            <div class="input-box amount-it">
                <span>￥</span>
                <input type="number" placeholder="请输入提现金额" ref="payMoney" @blur="blurInput($event,'payMoney')" @input="checkInputNum($event,'payMoney')" v-model="totalFee">
            </div>
            <p class="tip">
                <span class="most-money">最多可提现{{maxAmount}}元 </span>
            </p>
            <p class="tt">资金密码 </p>
            <div class="input-box psd">
                <div class="my-field-pwd">
                    <input type="password" ref="payPwd" :class="{allfill: payPwd.length>= 4}" maxlength="4" v-model="payPwd" @click="lastRange('payPwd')" @input="setPayPwd('payPwd')" />
                    <div class="analog-input">
                        <span>
                            <i v-show="payPwd.length >= 1"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 2"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 3"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 4"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <mt-button type="danger" class="btn-commit" @click="comminTakeFee()">马上提现</mt-button>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data () {
        return {
            isSubmit: true,
            user: {},
            bankList: [],
            payPwd: '',
            totalFee: '',
            frozenAmount: 0,
            maxAmount: 0
        }
    },
    created () {
        this.user = this.$store.state.user;
        this.frozenAmount = this.$store.state.frozenAmount;
        this.$http.post('/grab/withdrawList', { page: 1, pageSize: 100, userId: this.user.id }, { loading: true}).then(response => {
            var list = response.list, total = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i].status === 1) {
                    total += list[i].amount
                }
            }
            this.maxAmount = (this.user.amount - this.frozenAmount - total).toFixed(2);
        }).catch(() => {})
        this.$http.post('/grab/userBanks', { userId: this.user.id }, { loading: true}).then(response => {
            if (response.list.length) {
                this.bankList = [response.list[0] || {} ];
                // response.list
            }
        }).catch(() => {})
    },
    methods: {
        goRoute(val) {
            this.$router.push('/' + val);
        },
        addCard () {
            this.$router.push({ name: 'bandingbank', query: { from: '/withdraw' } })
        },
        checkInputNum ($event, data) {
            let target = $event.target, v = parseFloat(target.value.replace(/[^0-9\.]/g, ''));
            target.value = this[data] = v;
        },
        blurInput ($event, data) {
            let target = $event.target;
            if (!target.value) {
                this[data] = ''
            } else {
                this.checkInputNum($event, data)
            }
        },
        setPayPwd (box) {
            let len = this[box].length;
            if (len >= 4) {
                let rf = this.$refs[box];
                // this[box] = this[box].substr(0, 4);
                rf.blur()
            }
        },
        lastRange (box) {
            let rf = this.$refs[box];
            let vLen = this[box].length;
            if (rf.setSelectionRange) {                    //非ie
                rf.setSelectionRange(vLen, vLen);
            } else {                                         //ie
                let a = rf.createTextRange();            //ie支持creatTextRange
                a.moveStart('character', vLen);
                a.collapse(true);
                a.select();                                //选中操作
            }
        },
        setInterNum (value) {
            if (/\S{5}/.test(value) && value) {
                value = value.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
            }
            let val = value.split(' ');
            let str = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i < val.length - 1) {
                    str += '**** ';
                } else {
                    str += val[i] + ' ';
                }
            }
            return str;
        },
        getRealName (realName) {
            let name = realName.split('');
            let str = '';
            for (let i = 0; i < name.length; i++) {
                if (i !== name.length - 1) {
                    str += '*'
                } else {
                    str += name[i]
                }
            }
            return str;
        },
        comminTakeFee () {
            var err = '';
            if (Number(this.totalFee) && Number(this.totalFee) > this.maxAmount) {
                err = "当前余额最多可提现" + this.maxAmount;
            }
             if (Number(this.totalFee) && Number(this.totalFee) < 100) {
                err = "提现金额必须大于100";
            }
            if (this.payPwd == "") {
                err = "请输入支付密码";
            }
            if (this.totalFee === "") {
                err = "请输入提现金额";
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            if (!this.isSubmit) {
                return
            }
            this.isSubmit = false
            let params = {
                userId: this.user.id,
                parent_top: this.user.parent_top,
                capital: this.$md5(this.payPwd),
                amount: Number(this.totalFee),
                bankNo: this.bankList[0].bank_no,
                bankName: this.bankList[0].bank_name,
                bankDot: this.bankList[0].bank_dot,
                bankPayee: this.bankList[0].payee
            }
            this.$http.post('/grab/withdraw', params, {loading: true }).then(response => {
                this.$Toast({
                    message: '申请提现成功',
                    duration: 1500
                });
                this.$router.push('/my');
            }).catch(() => {
                this.isSubmit = true
            });
        },
    }
}
</script>

<style scoped>
 /* @import '../../personal_center.less'; */
.withdraw {
    height: 100%;
    background: #f1f1f1;
}

.withdraw .input-money {
    margin: 20px 15px 0;
    background: #fff;
    border-radius: 1px;
    padding: 10px 20px;
    border-radius: 0.2rem;
    /* box-shadow: 0 0 10px 2px #cccc; */
}
.withdraw .input-money .tt {
    color: #333;
    font-size: 14px;
}
.withdraw .input-money .tip {
    color: #333;
    margin: 6px 0 4px;
}
.withdraw .most-money {
    font-size: 0.6rem;
    line-height: 1.2rem;
    color: #999;
}
.withdraw .input-money .input-box {
    color: #de442c;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    margin: 10px 0;
}
.withdraw .input-money .input-box.psd {
    border: 0;
    /* margin-top: 0.5rem; */
}
.withdraw .input-money .input-box input {
    color: #de442c;
    font-size: 20px;
    height: 100%;
    line-height: 30px;
    left: 0;
    outline: none;
    border: 0;
    padding-left: 0;
}
.withdraw .input-money .amount-it{
    display: flex;
    justify-content: space-between;
}
.withdraw .input-money .input-box.amount-it input{
    flex: 1;
    min-width: 0;
    padding: 10px 0 10px 5px;
    display: block;
}
.withdraw .input-money .input-box .analog-input {
    left: 0;
    /*     left: 0;
    top: 0;
    right: inherit; */
}
.withdraw .btn-commit {
    width: 100%;
    margin-bottom: 25px;
    margin-top: 1rem;
}
.withdraw .btn-commit.is-disabled {
    opacity: 1;
    background-color: #ddd;
}
.withdraw .mint-popup-bottom {
    width: 100%;
    height: 50%;
    left: 0;
    right: 0;
    transform: translate(0, 0);
    /* padding-top: 2rem; */
    border-radius: 3px 3px 0 0;
}
.withdraw .mint-popup-bottom .title {
    text-align: center;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    background: #fff;
    font-weight: 600;
    color: #333;
    position: relative;
    z-index: 99;
    border-bottom: 1px solid #eee;
}
.withdraw .mint-popup-bottom .title i {
    float: right;
    margin-right: 0.3rem;
}

.withdraw .mint-popup-bottom ul {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    padding-top: 2rem;
    overflow-y: scroll;
}
.my-field-pwd {
    position: relative;
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
}
.my-field-pwd label {
    color: #999;
    font-size: 16px;
    width: 105px;
}
.input-money .input-box .my-field-pwd input {
    height: 100%;
    position: absolute;
    left: 0;
    right: 10px;
    z-index: 30;
    background: none;
    letter-spacing: 28px;
    padding-left: 18px;
    /* opacity: 0; */
    color: #ec0022;
    width: 144px;
    padding-right: 5px;
    text-shadow: #fff;
    -webkit-text-fill-color: transparent;
    transition: all 0.1s;
}
.my-field-pwd .allfill {
    left: 100px;
    padding-right: 0;
    width: 160px;
}
.my-field-pwd .analog-input {
    height: 36px;
    border-left: 1px solid #eee;
    position: absolute;
    top: 6px;
    left: 115px;
}
.my-field-pwd .analog-input span {
    display: inline-block;
    width: 36px;
    height: 36px;
    border: 1px solid #eee;
    text-align: center;
    line-height: 33px;
    float: left;
    border-left: 0;
}
.my-field-pwd .analog-input span i {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #000;
    border-radius: 100%;
}
.withdraw .bank-list {
    width: 100%;
    background: #fff;
    padding: 15px;
}

.ui-bank-card {
    width: 90.13333333vw;
    height: 90px;
    padding: 10px;
    margin: auto;
    margin-top: 0.93333333vw;
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
.ui-bank-card .cion{
    width: 42px;
    height: 42px;
    background: #f1f1f1;
    border-radius: 50%;
    text-align: center;
    line-height: 41px;
    margin-top: 14px;
}
.ui-bank-card .cion i{
    font-size: 20px;
    color: #999;
}
.ui-bank-card .row{
    flex: 1;
    min-width: 0;
    font-size: 12px;
    color: #acacae;
    padding-left: 15px;
}
.ui-bank-card .row-top{
    font-size: 14px;
    color: #333;
    padding-top: 4px;
}
.ui-bank-card .bank-dot{
    margin-top: 4px;
    margin-bottom: 4px;
}
.ui-bank-card .real-name{
    float: right;
    color: #acacae;
    font-size: 13px;
}
.bing-card{
    font-size: 14px;
    padding-top: 10px;
    padding-left: 20px;
    color: #de442c;
}
.shuoimg {
    display: flex;
}
.shuoimg span{
    font-size: 12px;
    padding-left: 3px;
}
</style>
