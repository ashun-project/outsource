<template>
    <div class="set">
        <mt-header title="设置">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        
        <div class="set-list" id="userConttainer" style="position: relative;">
            <ul>
                <li>
                    <div class="set1">
                        <img v-if="user.tx" :src="'/api/tx/' + user.tx">
                        <img v-else class="userHeadImg" src="@/assets/img/tx.jpg">
                    </div>
                    <div class="set2">更换头像</div>
                    <div class="set3"><img src="@/assets/img/arr.png"></div>
                    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="updateLoad"/>
                </li>
                <!-- <div class="h10"></div> -->
                <li @click="$router.push('/editPassword')">
                    <div class="set1">修改密码</div>
                    <div class="set3"><img src="@/assets/img/arr.png"></div>
                </li>
                <li @click="$router.push('/contact')">
                    <div class="set1">联系我们</div>
                    <div class="set3"><img src="@/assets/img/arr.png"></div>
                </li>
            </ul>
        </div>
        <div class="logout" @click="loginOut">退出登录</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {}
        }
    },
    created() {
        var user = this.$store.state.user;
        this.$set(this, 'user', user);
    },
    methods: {
        updateLoad: function (e) { 
            var file = e.target.files[0];
            var param = new FormData(); //创建form对象
            param.append('file',file,file.name);//通过append向form对象添加数据
            param.append('userId', this.user.id);//添加form表单中其他数据
            param.append('userTx', this.user.tx);//添加form表单中其他数据
            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            };  //添加请求头

            this.$http.post('/api/am/upload/tx',param,config).then(response=>{
                // console.log(response.data);
                var obj = JSON.parse(JSON.stringify(this.user));
                obj.tx = response.fileName;
                localStorage.setItem('user', JSON.stringify(obj));
                this.$store.commit('userChange', obj);
                this.$set(this, 'user', obj);
                this.$toast('上传成功')
            })
        },
        loginOut() {
            this.$http.post('/api/am/loginOut').then(response=>{
                this.$toast(response.message);
                localStorage.setItem('user', '');
                this.$store.commit('userChange', {});
                this.$router.push('/my')
            })
        }
    }
}
</script>

<style scoped>
.set-list{
    position: relative;
    padding: 0 15px;
}
.set-list ul li {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: solid 1px #eee;
    position: relative;
}
.set-list ul li input{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    filter: alpha(opacity=0);
    opacity: 0;
    
}
.set-list ul li .set1 {
    flex: 1;
}
.set-list ul li .set1 img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.set-list ul li .set3 img {
    width: 12px;
    height: 12px;
    margin-left: 10px;
}
.logout {
    width: 100%;
    max-width: 750px;
    height: 50px;
    line-height: 50px;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background: #0084ff;
    position: fixed;
    bottom: 0;
}
</style>