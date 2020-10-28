import Vue from 'vue'
import Router from 'vue-router'

const home = resolve => require(['@/views/home'], resolve)
const tu = resolve => require(['@/views/tu'], resolve)
const tudetail = resolve => require(['@/views/tudetail'], resolve)
const search = resolve => require(['@/views/search'], resolve)
const my = resolve => require(['@/views/my'], resolve)
const collect = resolve => require(['@/views/collect'], resolve)
const set = resolve => require(['@/views/set'], resolve)
const editPassword = resolve => require(['@/views/editPassword'], resolve)
const contact = resolve => require(['@/views/contact'], resolve)
const opend = resolve => require(['@/views/opend'], resolve)
const login = resolve => require(['@/views/login'], resolve)
const register = resolve => require(['@/views/register'], resolve)
const comment = resolve => require(['@/views/comment'], resolve)
const dz = resolve => require(['@/views/dz'], resolve)
const pl = resolve => require(['@/views/pl'], resolve)

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            meta: { title: '首页' },
            component: home,
        },
        {
            path: '/tu/:type',
            name: 'tu',
            meta: { title: '澳图' },
            component: tu,
        },
        {
            path: '/tudetail/:id',
            name: 'tudetail',
            meta: { title: '图片详情' },
            component: tudetail,
        },
        {
            path: '/search/:type',
            name: 'search',
            meta: { title: '搜索' },
            component: search,
        },
        {
            path: '/my',
            name: 'my',
            meta: { title: '我的' },
            component: my,
        },
        {
            path: '/collect',
            name: 'collect',
            meta: { title: '收藏' },
            component: collect,
        },
        {
            path: '/set',
            name: 'set',
            meta: { title: '设置' },
            component: set,
        },
        {
            path: '/editPassword',
            name: 'editPassword',
            meta: { title: '修改密码' },
            component: editPassword,
        },
        {
            path: '/contact',
            name: 'contact',
            meta: { title: '联系我们' },
            component: contact,
        },
        {
            path: '/opend',
            name: 'opend',
            meta: { title: '开奖记录' },
            component: opend,
        },
        {
            path: '/login',
            name: 'login',
            meta: { title: '登录' },
            component: login,
        },
        {
            path: '/register',
            name: 'register',
            meta: { title: '注册' },
            component: register,
        },
        {
            path: '/comment/:id/:issue/:reply',
            name: 'comment',
            meta: { title: '评论' },
            component: comment,
        },
        {
            path: '/dz',
            name: 'dz',
            meta: { title: '我的点赞' },
            component: dz,
        },
        {
            path: '/pl',
            name: 'pl',
            meta: { title: '我的评论' },
            component: pl,
        },
        {
            path: '/',
            // name: '',
            redirect: 'home',
            component: home,
        }
    ]
})
