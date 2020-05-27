<template>
    <div class="update-password">
        <el-form :model="editForm" label-width="120px" class="form-pas">
            <el-form-item label="旧密码:">
                <el-input v-model="editForm.oldPassword" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码:">
                <el-input v-model="editForm.password" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码:">
                <el-input v-model="editForm.checkPassword" type="password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="primary" @click="updtatePassword({})">确认修改</el-button>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            editForm: {
                oldPassword: '',
                password: '',
                checkPassword: ''
            }
        }
    },
    created() {

    },
    methods: {
        updtatePassword() {
            if (this.editForm.password !== this.editForm.checkPassword) {
                this.$Message.error('两次密码输入不一致!');
                return
            }
            this.$http.post('/admin/updatePassword', this.editForm).then(response => {
                this.$Message.success(response.message);
                this.editForm.oldPassword = '';
                this.editForm.password = '';
                this.editForm.checkPassword = '';
            }).catch(() => {})
        }
    }
    
}
</script>

<style scoped>
    .update-password{
        background: #fff;
        padding: 30px;
       min-height: 100vh;
    }
    .form-pas{
        width: 400px;
    }
    .footer{
        margin-left: 120px;
    }
</style>