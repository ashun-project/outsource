<template>
    <div class="ct">
       <mt-header title="2020年彩图">
            <span @click="$router.back(-1)" slot="left">
                <mt-button icon="back">返回</mt-button>
            </span>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="search">
            <div class="search-box">
                <div class="search-l">
                    <select name="type" v-model="type" @change="changeRoute">
                        <option value="col">彩色</option>
                        <option value="black">黑白</option>
                    </select>
                </div>
                <div class="search-r">
                    <input placeholder="搜索..." type="text" v-model="searchValue" @keyup="goSearch">
                </div>
            </div>
        </div>
        <mt-index-list :height="listHeight">
            <mt-index-section v-for="(item, idx) in listData" :key="idx" :index="item.type">
                <mt-cell v-for="vv in item.list" :key="vv.id" :title="vv.title" :to="'tudetail/' + vv.id"></mt-cell>
            </mt-index-section>
        </mt-index-list>
        <my-footer></my-footer>
    </div>
</template>

<script>
var winHeight = document.getElementById('app').clientHeight;
if (window.innerHeight) {
    winHeight = window.innerHeight;
} else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight;
}
export default {
    data() {
        return {
            type: '',
            searchValue: '',
            listHeight: winHeight-153,
            listData: []
        }
    },
    watch: {
        '$route' (n, o) {
            this.getList();
        }
    },
    created() {
        this.type = this.$route.params.type;
        this.getList()
    },
    methods: {
        getList() {
            this.$http.post('/api/am/zodiacType', {type: this.type}).then(response => {
                var list = response.data || [];
                var xin = [];
                var nal = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].sort === '#') {
                        xin.push(list[i]);
                    } else {
                        nal.push(list[i]);
                    }
                }
                let arrSort = nal.sort(function(s, t) {  
                    let a = s.sort.toLowerCase();
                    let b = t.sort.toLowerCase();
                    if (a < b) return -1;  
                    if (a > b) return 1;  
                    return 0;
                })
                var listData = arrSort.concat(xin);
                var type = 'A';
                var arr = [];
                var obj = {type: 'A', list: []};
                var num = 0
                for (var k = 0; k < listData.length; k++) {
                    if (listData[k].sort != type) {
                        arr.push(obj);
                        num += obj.list.length;
                        type = listData[k].sort;
                        obj = {type: listData[k].sort, list:[listData[k]]}
                    } else {
                        obj.list.push(listData[k]);
                    }
                    if (k === listData.length -1) {
                        arr.push(obj);
                        num += obj.list.length;
                    }
                }
                this.listData = arr;
                // console.log()
                // debugger
            }).catch(() => {})
        },
        changeRoute() {
            this.$router.push('/tu/' + this.type)
            // this.getList();
        },
        goSearch(ev) {
            if (ev.keyCode == 13 && this.searchValue) {
                this.$router.push({path: '/search/' + this.type, query: {value: this.searchValue}})
            }
        }
    }
}
</script>

<style scoped>
@import url(../assets/css/ct.css);
</style>