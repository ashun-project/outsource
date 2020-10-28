import Vue from 'vue';
import axios from 'axios'
import common from './common';
import footer from './footer';
import { Popup, Swipe, SwipeItem, Header, Button, IndexList, IndexSection, Cell, Field, InfiniteScroll, Spinner, Toast } from 'mint-ui';


Vue.component(Popup.name, Popup);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);
Vue.component(Spinner.name, Spinner);


Vue.use(InfiniteScroll);
Vue.prototype.$toast = Toast;
Vue.prototype.$common = common.common;
Vue.component('my-footer', footer);

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', {
    inserted: function (el, binding) {//指令名称为：real-img
        // console.log(23423423432, binding.value.split(','));
        el.onerror = function () {
            var arr = binding.value.split(',');
            var src = el.src.split('?')[0];
            var params = {
                type: arr[0],
                issue: arr[1],
                img: arr[2]
            }
            axios.post('/api/am/zodiacImg', params).then(response => {
                if (response.code == 0) {
                    el.src = src + '?_=' + new Date().getTime();
                }
                el.onerror = null;
            }).catch(() => {
                el.onerror = null;
            })
        }
    }
})
