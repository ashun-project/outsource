<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>UUT管理后台</p>
		  		</div>
		    	<el-form :model="loginForm" ref="loginForm">
					<el-form-item prop="userName">
						<el-input v-model="loginForm.userName" placeholder="用户名"><span>dsfsf</span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
				  	</el-form-item>
				</el-form>
				<p class="tip">温馨提示：</p>
				<p class="tip">请保管好你的帐号密码</p>
				<!-- <p class="tip">注册过的用户可凭账号密码登录</p> -->
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	export default {
	    data(){
			return {
				loginForm: {
					userName: '',
					password: '',
				},
				rules: {
					userName: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				},
				showLogin: false,
			}
		},
		mounted(){
			this.showLogin = true;
		},
		methods: {
			submitForm() {
                if (this.loginForm.userName && this.loginForm.password) {
					this.$http.post('/admin/login', this.loginForm).then(response => {
						this.$Message.success(response.message);
                        this.$router.push('/home') 
					}).catch(() => {})
                } else {
                    this.$Message.error('请输入帐号密码');
                }
				
			},
		}
	}
</script>

<style scoped>
	.login_page{
		background-color: #324057;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
	}
    .form_contianer{
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 400px;
        min-width: 360px;
        width: 40%;
        transform: translate(-50%, -50%)
    }
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
	}
    .manage_tip p{
        font-size: 34px;
        color: #fff;
    }
	.form_contianer{
		padding: 45px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		
	}
   .form_contianer  .submit_btn{
		width: 100%;
		font-size: 16px;
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>
