<template>
    <div>
        <!-- <el-form :model="addForm" label-width="120px"> -->
        <el-form :model="formData" label-width="120px" class="demo-form-inline">
            <el-form-item label="充值人">
                <el-input v-model="formData.list" type="textarea" :autosize="{ minRows: 5}" style="width:500px" placeholder="以换行分割"></el-input>
            </el-form-item>
            <el-form-item label="充值金额">
                <el-input v-model="formData.amount"  style="width:500px" clearable placeholder="金额"></el-input>
            </el-form-item>
            <el-form-item label="快捷充值">
                <el-radio-group v-model="formData.amount">
                    <el-radio-button label="10"></el-radio-button>
                    <el-radio-button label="20"></el-radio-button>
                    <el-radio-button label="50"></el-radio-button>
                    <el-radio-button label="100"></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <input type="file" id="files" name="files" @change="handleFileSelect"/>
                <el-button type="file" @click="uploadFile">上传</el-button>
                <!-- <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload> -->
                <el-button type="primary" :loading="loading" @click="confirmOrder">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
    data() {
        return {
            loading: false,
            formData: {
                list: '',
                amount: ''
            }
       }
    },
    created() {
    },
    methods: {
        uploadFile() {
           var fileEvn = document.getElementById('files');
           fileEvn.click();
        },
        handleFileSelect(evt) {
            var vm  = this;
            var files = evt.target.files; // FileList object
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = (function (theFile) {
                    return function (e) {
                        var txt = e.target.result;
                        // console.log(e.target.result.split(/[\s\n]/))
                        vm.formData.list = txt;//.split(/[\s\n]/).join(',');
                    };
                })(f);
                reader.readAsText(f);
            }
        },
        confirmOrder() {
            this.loading = true;
            var totalAmount = 0;
            var account = localStorage.getItem('account');
            var list = this.formData.list.split(/[\s\n]/);
            var amount = Number(this.formData.amount) || 0;
            if (!this.formData.list || !this.formData.amount) {
                this.$Message.error('请输入电话号码以及充值金额');
                this.loading = false;
                return
            }
            if (account && account !== 'admin') {
                totalAmount = this.$store.state.user.amount || 0;
                if ((list.length * amount) > totalAmount) {
                    this.$Message.error('余额不足');
                    this.loading = false;
                    return
                }
            }
            this.$http.post('/admin/createOrder', {account: account, amount: amount, list: list}).then(response => {
                this.$Message.success('申请成功');
                this.$router.push('/rechargeList')
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
    
}
</script>

<style scoped>
    #files{
        width: 70px;
        height: 40px;
        position: absolute;
        left: 0;
        opacity: 0;
        z-index: -1;
    }
</style>