<template>
    <div class="opend">
        <mt-header title="开奖记录">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <div class="lotto">
            <div class="lotto-tit">
                <div class="lotto-tit1">第 <font color="#0084ff">2020224</font> 期开奖结果</div>
                <div class="lotto-tit2">2020年08月20日</div>
            </div>
            <div class="lotto-box">
                <ul>
                    <li class="lotto-ball"><span class="lotto-blue">37</span><p>鼠</p></li>
                    <li class="lotto-ball"><span class="lotto-blue">20</span><p>蛇</p></li>
                    <li class="lotto-ball"><span class="lotto-green">27</span><p>狗</p></li>
                    <li class="lotto-ball"><span class="lotto-green">43</span><p>马</p></li>
                    <li class="lotto-ball"><span class="lotto-red">35</span><p>虎</p></li>
                    <li class="lotto-ball"><span class="lotto-blue">48</span><p>牛</p></li>
                    <li class="lotto-jia">+</li>
                    <li class="lotto-ball"><span class="lotto-red">08</span><p>蛇</p></li>
                </ul>
            </div>
        </div>
        <div class="lotto">
            <div class="lotto-tit">
                <div class="lotto-tit1">第 <font color="#0084ff">2020224</font> 期开奖结果</div>
                <div class="lotto-tit2">2020年08月20日</div>
            </div>
            <div class="lotto-box">
                <ul>
                    <li class="lotto-ball"><span class="lotto-blue">37</span><p>鼠</p></li>
                    <li class="lotto-ball"><span class="lotto-blue">20</span><p>蛇</p></li>
                    <li class="lotto-ball"><span class="lotto-green">27</span><p>狗</p></li>
                    <li class="lotto-ball"><span class="lotto-green">43</span><p>马</p></li>
                    <li class="lotto-ball"><span class="lotto-red">35</span><p>虎</p></li>
                    <li class="lotto-ball"><span class="lotto-blue">48</span><p>牛</p></li>
                    <li class="lotto-jia">+</li>
                    <li class="lotto-ball"><span class="lotto-red">08</span><p>蛇</p></li>
                </ul>
            </div>
        </div>

        <ul class="indexed-list">
        </ul>
        
    </div>
</template>

<script>
var jsonAA = require('./json/aa.json');
var jsonCol = require('./json/col.json');
var jsonBl = require('./json/bl.json');
export default {
    data() {
        return {
            
        }
    },
    methods: {
        getData(num) {
            // this.$http.get('/fig/'+ num +'.html').then(response => {
            //     console.log(response.list.length, '======')
            //     arr = arr.concat(response.list)
            //     // console.log(JSON.stringify(arr))
            //     if (num <= 100) {
            //         this.getData(num+1)
            //     } else {
            //         console.log(JSON.stringify(arr))
            //     }
            // }).catch(() => {})
        }
    },
    mounted() {
        // var indexedList = document.querySelectorAll('.indexed-list li');
        // console.log(indexedList.length)
        // var arr = [];
        // for (var i  = 0; i < indexedList.length; i++) {
        //     var sortType = indexedList[i].querySelector('h2').textContent;
        //     var aList = indexedList[i].querySelectorAll('dl dd');
        //     for (var k = 0; k < aList.length; k++) {
        //         var label = aList[k].querySelector('label');
        //         var span = label.querySelector('span');
        //         label.removeChild(span);
        //         var txt = label.textContent;
        //         var url = label.getAttribute('onclick').replace('gotoUrl(', '').replace(/\'/g, '');
        //         arr.push({sortType: sortType, url: url.replace(')', ''), title: txt});
        //     }
        // }
        // console.log(arr.length)
        // console.log(JSON.stringify(arr))
    },
    created() {
        // console.log(jsonAA.length, '===', jsonCol.length, '====', jsonBl.length)
        var arr = jsonCol.concat(jsonBl);
        var result = [];
        for (var i = 0; i  < jsonAA.length; i++) {
            var ft = arr.filter(item => item.url === jsonAA[i].url);
            var img = jsonAA[i].pic.split('/225/')[1] || jsonAA[i].pic.split('/224/')[1];
            if (img) {
                var imgType = img.split('.')[0];
            } else {
                var imgType = '';
                debugger
            }
            var type = jsonAA[i].url.indexOf('/black/') > -1 ? 'black' : 'col';
            if (!img || !type) {
                console.log(jsonAA[i])
            }
            result.push({
                sortType: ft[0].sortType, 
                url: ft[0].url, 
                title: ft[0].title, 
                imgType: img,
                type: type
            })
        }
        console.log(JSON.stringify(result), '=====', result.length)
    }
}
</script>

<style scoped>
.lotto {
    padding: 15px 10px;
    box-sizing: border-box;
    text-align: center;
    background: #fff;
}
.lotto font{
    font-weight: 600;
}
.lotto .lotto-tit {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.lotto .lotto-tit2 {
    color: #999;
}
.lotto .lotto-box ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.lotto .lotto-box ul li.lotto-ball {
    margin-left: 4px;
    padding: 5px;
    border: solid 1px #e5e5e5;
    border-radius: 5px;
}
.lotto .lotto-box ul li.lotto-ball:nth-child(1) {
    margin-left: 0;
}
.lotto .lotto-box ul li.lotto-ball span {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    background-size: 100% 100%!important;
}
.lotto .lotto-box ul li.lotto-ball p {
    margin-top: 5px;
    font-size: 13px;
}
</style>