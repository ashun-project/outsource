<template>
    <div class="bankingBank">
        <my-header title="绑定银行卡" :bkUrl="goBk"></my-header>
        <section>
            <div class="form-box">
                <div class="box-hd">请输入您的身份信息</div>
                <div class="box-bd">
                    <div class="form-box my-mt-field">
                        <label for="">
                            真实姓名
                        </label>
                        <input type="text" placeholder="请输入真实姓名" v-model="bandingInfo.realName">
                    </div>
                </div>
            </div>
            <div class="form-box">
                <div class="box-hd">请输入您的银行卡信息</div>
                <div class="box-bd">
                    <div class="form-box my-mt-field">
                        <label for="">
                            银行名称
                        </label>
                        <input type="text" placeholder="请输入银行名称" readonly v-model="bandingInfo.bankName" @focus="isShowRebates = true">
                    </div>
                    <div class="form-box my-mt-field">
                        <label for="">
                            银行卡号
                        </label>
                        <input type="text" placeholder="请输入银行卡号" maxlength="19" v-model="bandingInfo.bankNo" @input="setRole('num', 'bankNo')" @blur.stop="queryBankFrom">
                    </div>
                    <div class="form-box my-mt-field">
                        <label for="">
                            开户行
                        </label>
                        <input type="text" placeholder="请输入开户行" v-model="bandingInfo.bankDot">
                    </div>
                    <dl class="m-t-20">
                        <dt class="aui-content-padded">
                            <label><input type="checkbox" value="1" v-model="agressBtn" style="height:auto"> 我已同意《服务协议》</label>
                        </dt>
                    </dl>
                    <p class="tip">尊敬的用户，为了保障您的资金安全，请您绑定您的真实姓名和设置取款密码。如果姓名与开户名不一致，将无法取款</p>
                </div>
            </div>
        </section>
        <div class="ui-btn-wrap">
            <mt-button type="danger" @click="doBanding">确定绑卡</mt-button>
        </div>
        
        <mt-popup class="agent-rebate-popup" ref="rebatesPopup" v-model="isShowRebates" position="bottom">
            <div class="btn-group">
                <span class="btn cancle" @click.stop="isShowRebates = false">取消</span>
                <span class="btn right" @click.stop="setRebates">确定</span>
            </div>
            <mt-picker :slots="slots" ref="picker" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
export default {
    data () {
        return {
            goBk: '/bankcard',
            agressBtn: 1,
            isSubmit: true,
            isShowRebates: false,
            bandingInfo: {
                realName: "",
                bankNo: "",
                bankDot: "",
                bankName: "",
                userId: ""
            },
            slots: [
                {
                    flex: 1,
                    values: ['工商银行', '中国银行', '建设银行', '农业银行', '交通银行', '招商银行', '民生银行', '光大银行', '华夏银行', '中信银行', '广东发展银行', '深圳发展银行', '上海浦东发展银行', '兴业银行', '邮储银行', '平安银行'],
                    className: 'slot1',
                    textAlign: 'center'
                }
            ]
        };
    },
    created() {
        var user = this.$store.state.user;
        this.bandingInfo.userId = user.id;
        if (this.$route.query.from) {
            this.goBk = this.$route.query.from;
        }
    },
    methods: {
        queryBankFrom () {
            if (this.bandingInfo.bankNo == "") return;
            if (this.bandingInfo.bankNo.length < 16) {
                this.$Message({
                    title: '提示',
                    message: '请输入正确的银行卡号！'
                });
                return;
            }
        },
        setRole (type, value) {
            let role = /[^0-9]/ig;
            this.$set(this.bandingInfo, value, this.bandingInfo[value].replace(role, ''))
        },
        setRebates() {
            var value = this.$refs.picker.getSlotValue(0);
            this.bandingInfo.bankName = value;
            this.isShowRebates = false;
        },
        onValuesChange(picker, value) {
            // console.log(value, '===')
        },
        doBanding () {
            let str = /^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/;///^[^\u0000-\u00FF]*$/;
            let word = /^[\u4e00-\u9fa5]+$/;
            var err = '';
            if (!str.test(this.bandingInfo.realName) || this.bandingInfo.realName.length < 2 || this.bandingInfo.realName.length > 12) {
                err = '姓名只能为2-12位的中文字符';
            }
            if (this.bandingInfo.realName== "") {
                err = "请输入真实姓名";
            }
            if (this.bandingInfo.bankNo == "") {
                err = "请输入银行卡号";
            }
            if (this.bandingInfo.bankName == "" || this.bandingInfo.bankName.length <= 0) {
                err = "请输入银行名称";
            }
            if (!word.test(this.bandingInfo.bankName)) {
                err = "银行名称只能输入中文";
            }
            if (this.bandingInfo.bankDot == "" || this.bandingInfo.bankDot.length <= 0) {
                err = "请输入开户行";
            }
            if (!word.test(this.bandingInfo.bankDot)) {
                err = "开户行只能输入中文";
            }
            if (this.agressBtn != "1") {
                err = "请先同意服务协议";
            }
            if (this.bandingInfo.bankNo.length < 16) {
                err = "银行卡号最少16位";
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
            this.$http.post("/grab/bindBank", this.bandingInfo, {loading: true}).then(response => {
                this.isSubmit = true;
                // 判断从提现页面进来
                this.$router.push(this.goBk);
            }).catch(() => {
                this.isSubmit = true
            });
        }
    }
};
</script>

<style scoped>
.form-box .box-hd {
    background-color: #f1f1f1;
    font-size: 16px;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    color: #333;
}
.bankingBank .my-mt-field {
    box-sizing: border-box;
    color: inherit;
    min-height: 48px;
    font-size: 16px;
    line-height: 48px;
    width: 100%;
    position: relative;
}
.bankingBank .my-mt-field label {
    width: 100px;
    padding-left: 20px;
    display: inline-block;
    float: left;
    color: #999;
    font-size: 14px;
    /* text-align: right; */
}
.bankingBank .my-mt-field input {
    font-size: 14px;
    user-select: text;
    outline: 0;
    height: 100%;
    line-height: 26px;
    padding: 11px 0 11px 110px;
    position: absolute;
    left: 0;
    right: 0;
    border: 0;
    width: 100%;
    display: block;
    background: none;
}
.bankingBank .block {
    display: block;
}
.bankingBank .box-shadow-red {
    box-shadow: 0 1px 7px rgba(211, 67, 55, 0.8);
}
.bankingBank .background-none {
    background-image: none;
}
.bankingBank .margin-center {
    margin-left: auto;
    margin-right: auto;
}
.bankingBank .tip {
    font-size: 0.6rem;
    padding: 8px 20px;
    color: #ec0022;
}
.aui-content-padded{
    padding-top: 10px;
    padding-left: 20px;
    border-top: 1px solid #eee;
    /* margin: 0 10px; */
}
.ui-btn-wrap{
    padding: 0 20px;
}
button{
    width: 100%;
    margin: 30px 0 10px;
    background: #de442c;
}
.btn-group{
    color: #333;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
}
.btn-group span{
    width: 50%;
    text-align: center;
}
.btn-group .right{
    /* border-left: 1px solid #eee; */
    color: #26a2ff;
}

</style>