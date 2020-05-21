<template>
  <div class="address-edit">
        <my-header :title="'地址'+titleTxt" bkUrl="/address"></my-header>
        <div class="address-edit-form">
            <div class="input-wrap">
                <mt-field label="收货人姓名" placeholder="请填写姓名" v-model="formData.name"></mt-field>
            </div>
            <div class="input-wrap" @click="toSelect">
                <mt-field label="城市" placeholder="请选择地区" readonly v-model="formData.city"></mt-field>
            </div>
            <div class="input-wrap">
                <mt-field label="详细地址" placeholder="请填写详细地址" type="passowrd" v-model="formData.address"></mt-field>
            </div>
            <div class="input-wrap">
                <mt-field label="手机" placeholder="请填写手机号" type="passowrd" v-model="formData.phone"></mt-field>
            </div>
           <mt-button type="primary" @click="addAddress">立即{{titleTxt}}</mt-button>
       </div>
       <div id="picker-address"></div>
  </div>
</template>

<script>
import PickerExtend from 'picker-extend';
import jsonAdrs from '@/components/address';
var mobileSelect = '';

export default {
    data() {
        return {
            titleTxt: '添加',
            formData: {
                name: '',
                city: '',
                address: '',
                phone: '',
                userId: ''
            }
        };
    },
    created() {
        var id = this.$route.params.id;
        var user = this.$store.state.user;
        this.formData.userId = user.id;
        if (id !== 'add') {
            this.titleTxt = '修改';
            this.formData.id = id;
            this.$http.post('/grab/addressList', { id: id }, {loading: true}).then(response => {
                var obj = response.list[0] || {};
                this.$set(this, 'formData', obj);
            }).catch(() => {})
        }
    },
    mounted() {
        var vm = this;
        mobileSelect = new PickerExtend({
            trigger: "#picker-address",
            title: "单项选择",
            triggerDisplayData: false,
            wheels: [
                {data: jsonAdrs}
            ],
            callback:function(indexArr, data){
                vm.formData.city = '';
                for (var i = 0; i < data.length; i++) {
                    vm.formData.city += data[i].value
                }
            }
        });
    },
    methods: {
        toSelect() {
            mobileSelect.show();
        },
        addAddress() {
            var err = '';
            if (!this.formData.phone || !(/^1[23456789]\d{9}$/.test(this.formData.phone))) {
                err = '请正确填写手机号！';
            }
            if (!this.formData.address) {
                err = '请填写详细地址！';
            }
            if (!this.formData.city) {
                err = '请选择城市！';
            }
            if (!this.formData.name) {
                err = '请填写姓名！';
            }
            if (err) {
                this.$Toast({
                    message: err,
                    duration: 1500
                })
                return
            }
            var url = '/grab/addAddress';
            if (this.formData.id) {
                url = '/grab/editAddress'
            }
            this.$http.post(url, this.formData, {loading: true}).then(response => {
                this.$Toast({
                    message: response.message,
                    duration: 1500
                })
                this.$router.push('/address')
            }).catch(() => {})
        }
    }
};
</script>

<style scoped>
.address-edit{
    height: 100%;
}
.address-edit-form{
    background: #fff;
    padding: 0 10px;
    border-radius: 3px;
}
.address-edit >>> .mint-cell-wrapper {
    background: none;
    padding: 0;
    position: relative;
}
.address-edit .mint-cell{
    background-image: -webkit-gradient(linear, left bottom, left top, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
    background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    padding: 5px 0 5px 0;
}
.address-edit .mint-cell >>> input{
    color: #de442c;
    font-size: 14px;
}
.address-edit button{
    width: 100%;
    margin: 30px 0 10px;
    background: #de442c;
}
.input-wrap{
    position: relative;
}
.input-wrap .iconfont{
    position: absolute;
    left: 10px;
    top: 50%;
    font-size: 22px;
    z-index: 20;
    margin-top: -11px;
    color: #de442c;
}
</style>