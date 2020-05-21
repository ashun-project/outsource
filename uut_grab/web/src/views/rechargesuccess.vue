<template>
  <div class="rechargesuccess">
    <my-header :title="titleTxt[bank.type]" :bkUrl="'/rechargebank/'+ routeId"></my-header>
    <div v-if="bank.type === 1" class="bank-head">
      <p class="tt">
        <i class="iconfont">&#xe671;</i> 填写您的转账资料
      </p>
      <p class="tip">以下是您的欲转账的银行账户资料</p>
    </div>
    <div v-if="bank.type === 1" class="bank-info">
        <div class="item">
                <span class="key">银行</span>
                <div>
                    <span class="txt">{{ bank.bank_name }}</span>
                    <span class="copy" @click="getCopy('bank_name')">复制</span>
                </div>
        </div>
        <div class="item">
                <span class="key">收款人</span>
                <div>
                    <span class="txt">{{ bank.payee }}</span>
                    <span class="copy" @click="getCopy('payee')">复制</span>
                </div>
        </div>
        <div class="item">
                <span class="key">账号</span>
                <div>
                    <span class="txt">{{ bank.bank_no }}</span>
                    <span class="copy" @click="getCopy('bank_no')">复制</span>
                </div>
        </div>
        <div class="item">
                <span class="key">开户网点</span>
                <div>
                    <span class="txt">{{ bank.bank_dot }}</span>
                    <span class="copy" @click="getCopy('bank_dot')">复制</span>
                </div>
        </div>
        <div class="item shuoming">
                <span class="key">限额说明</span>
                <div>
                    <span class="txt">{{ bank.remark }}</span>
                </div>
        </div>
    </div>
    <div v-if="bank.type !== 1" class="qr-code">
        <img :src="'/api/img/pay/' + bank.qr_code" alt="">
        <p>保存图片&nbsp;&nbsp;&nbsp;扫码支付</p>
    </div>
    <div class="line"></div>
    <mt-field label="存入金额" placeholder="" v-model="amount"></mt-field>
    <mt-field label="存款人姓名" placeholder="" v-model="depositor"></mt-field>
    <div class="opeation">
         <mt-button type="danger" @click="goRoute('rechargebank/' + routeId)">上一步</mt-button>
         <mt-button type="danger" @click="recharge">我已支付</mt-button>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            amount: '',
            depositor: '',
            routeId: this.$route.params.id,
            bank: {},
            user: {},
            isSubmit: true,
            titleTxt: ['', '银行卡转账', '微信扫码', '支付宝扫码']
        };
    },
    mounted() {
        document.querySelector('input').focus();
    },
    created() {
        var user = this.$store.state.user;
        this.user = user;
        var amount = this.$route.query.amount;
        if (amount) {
            this.amount = amount;
        }
        this.getBanks();
    },
    methods: {
        goRoute(val) {
            this.$router.push("/" + val);
        },
        getBanks() {
            this.$http.post('/grab/banks', {id: this.routeId, group_type: this.user.group_type}).then(response => {
                this.bank = response.banks[0] || {};
            }).catch(() => {})
        },
        getCopy(val) {
            var err = false;
            var input = document.createElement('input');
            input.value = this.bank[val];
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
        recharge() {
            var err = '';
            var str = /^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/;
            if (Number(this.amount) < 10) {
                err = '最低充值10'
            }
            if (!str.test(this.depositor) || this.depositor.length < 2 || this.depositor.length > 12) {
                err = '姓名只能为2-12位的中文字符';
            }
            if (!this.depositor) {
                err = '请填写存款人姓名';
            }
            if (!this.amount) {
                err = '请填写存入金额';
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
            this.isSubmit = false;
            this.$http.post('/grab/recharge', {depositor: this.depositor, amount: this.amount, id: this.user.id, parent_top: this.user.parent_top, type: this.bank.type}, {loading: true}).then(response => {
                this.$Toast({
                    message: response.message,
                    duration: 1500
                })
                this.goRoute('my')
            }).catch(() => {
                this.isSubmit = true
            })
        }
    }
};
</script>

<style scoped>
.bank-head {
  background: #f1f1f1;
  padding: 10px;
}
.bank-head .tt {
  color: #222;
  font-size: 16px;
}
.bank-head .tip {
  color: #666;
  font-size: 12px;
  margin-top: 3px;
}
.bank-info{
    padding: 10px;
}
.bank-info .item{
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}
.bank-info .item .key{
    width: 80px;
    display: block;
}
.bank-info .item > div{
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
}
.bank-info .txt{
    color: #989899;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
}
.bank-info .copy{
    border: 1px solid #ff7614;
    color: #ff7614;
    text-align: center;
    border-radius: 5px;
    padding: 0 10px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    margin-top: 3px;
    width: 50px;
}
.bank-info .shuoming{
    height: auto;
}
.bank-info .shuoming .txt{
     white-space: pre-wrap;
    overflow: visible;
    line-height: 20px;
    height: auto;
    margin-top: 5px;
}
.rechargesuccess >>> .mint-cell-wrapper{
    padding: 0 10px;
    background-image: none;
}
.rechargesuccess >>> .mint-cell{
    background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
}
.opeation{
    display: flex;
    justify-content: space-between;
    padding: 20px;
}
.opeation button{
    width: 130px;
    height: 35px;
    line-height: 35px;
}
.qr-code {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 50px 0;
}
.qr-code img{
    max-width: 70%;
    width: auto;
}
.qr-code p{
    margin-top: 20px;
    color: #ff7614;
}
</style>