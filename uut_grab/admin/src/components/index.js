import Vue from 'vue';
import common from './common';
import { 
    Button,
    Table,
    TableColumn,
    Submenu,
    Row,
    Col,
    Menu,
    MenuItem,
    MenuItemGroup,
    Form,
    FormItem,
    Input,
    DatePicker,
    Select,
    Option,
    Tag,
    Pagination,
    Dialog,
    Loading,
    Message,
    Radio,
    MessageBox,
    Upload,
    Dropdown,
    DropdownMenu,
    DropdownItem
} from 'element-ui';

Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Row);
Vue.use(Col);
Vue.use(Submenu);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Radio);
Vue.use(Upload);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);



Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$common = common.common;
Vue.prototype.$Message = Message;
Vue.prototype.$confirm = MessageBox.confirm;