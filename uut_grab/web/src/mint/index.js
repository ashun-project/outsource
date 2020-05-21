import Vue from 'vue'
import header from "@/components/header"
import md5 from '@/components/md5.js'
import common from '@/components/common.js'
import {
    Button, 
    Cell,
    Field,
    Toast,
    Indicator,
    MessageBox,
    Swipe,
    SwipeItem,
    InfiniteScroll,
    Spinner,
    Picker,
    Popup
} from 'mint-ui'

Vue.use(InfiniteScroll);
Vue.component('my-header', header);
Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Spinner.name, Spinner);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);

Vue.prototype.$md5 = md5.encrypt.md5;
Vue.prototype.$common = common.common;
Vue.prototype.$Toast = Toast;
Vue.prototype.$Indicator = Indicator;
Vue.prototype.$Message = MessageBox;
// Vue.component(Toast.name, Toast);
// Vue.component(Indicator.name, Indicator);
// Vue.component(MessageBox.name, MessageBox);