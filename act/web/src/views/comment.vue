<template>
    <div class="comment">
        <!-- <mt-header title="">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">取消</mt-button>
            </span>
        </mt-header> -->
        <header class="fbpl-header">
            <div class="back" @click="$router.back(-1)">取消</div>
        </header>
        <div class="fbpl-con">
            <mt-field class="fbpl-box" placeholder="请留下您的评论..." :attr="{ maxlength: 5000 }" type="textarea" rows="5" v-model="introduction"></mt-field>
            <div class="fbpl-num">{{ introduction.length }}/5000</div>
        </div>
        <div class="fbpl-btn">
            <button type="button" @click="addComment">提交</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            introduction: '',
            zodiacObj: {},
            user: {},
            issue: ''
        }
    },
    created() {
        var id = this.$route.params.id;
        this.issue = this.$route.params.issue;
        this.reply = this.$route.params.reply;
        var user = this.$store.state.user;
        this.$set(this, 'user', user);
        this.$http.post('/api/am/zodiacType', {id: Number(id)}).then(response => {
            var zodiac = response.data[0] || {};
            this.$set(this, 'zodiacObj', zodiac);
        })
    },
    methods: {
        addComment() {
            if (!this.introduction) {
                this.$toast('请填写内容');
                return
            }
            // [params.userId, params.zodiacId, params.userName, params.issue, params.zodiacTitle, params.replyId, new Date()]
            var params = {
                userId: this.user.id,
                zodiacId: this.zodiacObj.id,
                userName: this.user.nickName,
                issue: this.issue,
                zodiacTitle: this.zodiacObj.title,
                zodiacType: this.zodiacObj.type,
                zodiacImg: this.zodiacObj.img,
                replyId: Number(this.reply) ? Number(this.reply) : 0,
                cont: this.introduction,
                userTx: this.user.tx
            }
            this.$http.post('/api/am/addComment', params).then(response => {
                this.$toast('评论成功');
                this.$router.back(-1);
            })
        }
    }
}
</script>

<style scoped>
header {
    width: 100%;
    max-width: 750px;
    height: 50px;
    line-height: 50px;
    margin: 0 auto;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: solid 1px #eee;
    background: #f1f1f1;
    position: relative;
}
.fbpl-header .back {
    position: absolute;
    top: 0;
    left: 15px;
    font-family: Arial,"微软雅黑";
}
.fbpl-con {
    background: #fff;
}
.fbpl-con .fbpl-box {
    width: 100%;
    /* min-height: 20vh;
    line-height: 1.75;*/
    padding: 5px; 
    box-sizing: border-box;
}
.comment >>> textarea {
    resize: none;
}
.comment >>> .mint-cell-wrapper{
    border: 0;
    background-image: none;
}
.fbpl-btn {
    padding: 25px 15px 15px 15px;
    background: #f5f5f5;
}
.fbpl-btn button {
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border-radius: 3px;
    border: solid 1px #0084ff;
    background: #0084ff;
    outline: none;
}
.fbpl-btn button:active{
    background: #41a0f8;
}
.fbpl-con .fbpl-num {
    padding: 10px 15px;
    text-align: right;
    font-size: 13px;
    color: #999;
    background: #fff;
}
</style>>