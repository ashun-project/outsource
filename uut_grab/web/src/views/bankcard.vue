<template>
    <div class="bankList">
        <my-header title="我的银行卡" bkUrl="/my"></my-header>
        <section class="" style="margin:1rem 0.75rem;">
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
            <p class="bind-bank-tip">注：请绑定大型商业银行，如需修改，请您联系在线客服，谢谢</p>
            <div class="clear"></div>
        </section>
    </div>
</template>

<script>
export default {
    data () {
        return {
            bankList: [],
            realName: '',
            user: {}
        }
    },
    created () {
        this.user = this.$store.state.user;
        this.$http.post('/grab/userBanks', { userId: this.user.id }, { loading: true}).then(response => {
            this.bankList = response.list || [];
        }).catch(() => {})
    },
    methods: {
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
        addCard () {
            this.$router.push('/bandingbank');
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
        }
    }
    
}
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
.bind-bank-tip{
    width: 90.13333333vw;
    margin: 3.73333333vw auto 0;
    font-size: 3.46666667vw;
    color: #989898;
}
</style>