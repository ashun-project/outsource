import Vue from 'vue'
import Router from 'vue-router'

const login = resolve => require(['@/views/login/login'], resolve)
const layout = resolve => require(['@/views/layout/layout'], resolve)
const userList = resolve => require(['@/views/userList'], resolve)
const rechargeList = resolve => require(['@/views/rechargeList'], resolve)
const addOrder = resolve => require(['@/views/addOrder'], resolve)



Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            // name: '',
            redirect: 'rechargeList',
            component: layout,
            children: [
                {
                    path: 'userList',
                    name: 'userList',
                    meta: { title: '会员列表' },
                    component: userList
                },
                {
                    path: 'rechargeList',
                    name: 'rechargeList',
                    meta: { title: '充值记录' },
                    component: rechargeList
                },
                {
                    path: 'addOrder',
                    name: 'addOrder',
                    meta: { title: '用户充值' },
                    component: addOrder
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            meta: { title: '登录' },
            component: login,
        }
    ]
})
