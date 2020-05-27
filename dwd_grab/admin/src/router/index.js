import Vue from 'vue'
import Router from 'vue-router'

const login = resolve => require(['@/views/login/login'], resolve)
const layout = resolve => require(['@/views/layout/layout'], resolve)
const home = resolve => require(['@/views/home/home'], resolve)
const recharge = resolve => require(['@/views/finance/recharge'], resolve)
const rechargeExamine = resolve => require(['@/views/finance/rechargeExamine'], resolve)
const withdraw = resolve => require(['@/views/finance/withdraw'], resolve)
const withdrawExamine = resolve => require(['@/views/finance/withdrawExamine'], resolve)
const commission = resolve => require(['@/views/finance/commission'], resolve)
const banks = resolve => require(['@/views/finance/banks'], resolve)
const zhifubao = resolve => require(['@/views/finance/zhifubao'], resolve)
const weixin = resolve => require(['@/views/finance/weixin'], resolve)
const billList = resolve => require(['@/views/finance/billList'], resolve)
const reportList = resolve => require(['@/views/finance/reportList'], resolve)
const userList = resolve => require(['@/views/user/userList'], resolve)
const userBankList = resolve => require(['@/views/user/userBankList'], resolve)
const userAddressList = resolve => require(['@/views/user/userAddressList'], resolve)
const agentList = resolve => require(['@/views/user/agentList'], resolve)
const verifyCodeList = resolve => require(['@/views/user/verifyCodeList'], resolve)
const orderList = resolve => require(['@/views/order/orderList'], resolve)
const profit = resolve => require(['@/views/order/profit'], resolve)
const storeList = resolve => require(['@/views/store/storeList'], resolve)
const goodList = resolve => require(['@/views/store/goodList'], resolve)
const bannerList = resolve => require(['@/views/system/bannerList'], resolve)
const noticeList = resolve => require(['@/views/system/noticeList'], resolve)
const password = resolve => require(['@/views/system/password'], resolve)



Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            // name: '',
            redirect: 'home',
            component: layout,
            children: [
                {
                    path: 'home',
                    name: 'home',
                    meta: { title: '首页' },
                    component: home
                },
                {
                    path: 'recharge',
                    name: 'recharge',
                    meta: { title: '充值列表', parent: 'finance' },
                    component: recharge
                },
                {
                    path: 'rechargeExamine',
                    name: 'rechargeExamine',
                    meta: { title: '充值审核', parent: 'finance' },
                    component: rechargeExamine
                },
                {
                    path: 'withdraw',
                    name: 'withdraw',
                    meta: { title: '提现列表', parent: 'finance' },
                    component: withdraw
                },
                {
                    path: 'withdrawExamine',
                    name: 'withdrawExamine',
                    meta: { title: '提现审核', parent: 'finance' },
                    component: withdrawExamine
                },
                {
                    path: 'commission',
                    name: 'commission',
                    meta: { title: '佣金列表', parent: 'finance' },
                    component: commission
                },
                {
                    path: 'banks',
                    name: 'banks',
                    meta: { title: '平台银行卡', parent: 'finance' },
                    component: banks
                },
                {
                    path: 'zhifubao',
                    name: 'zhifubao',
                    meta: { title: '平台支付宝', parent: 'finance' },
                    component: zhifubao
                },
                {
                    path: 'weixin',
                    name: 'weixin',
                    meta: { title: '平台微信', parent: 'finance' },
                    component: weixin
                },
                {
                    path: 'billList',
                    name: 'billList',
                    meta: { title: '资金明细', parent: 'finance' },
                    component: billList
                },
                {
                    path: 'reportList',
                    name: 'reportList',
                    meta: { title: '全局报表', parent: 'finance' },
                    component: reportList
                },
                {
                    path: 'userList',
                    name: 'userList',
                    meta: { title: '会员列表', parent: 'user' },
                    component: userList
                },
                {
                    path: 'userBankList',
                    name: 'userBankList',
                    meta: { title: '用户银行卡', parent: 'user' },
                    component: userBankList
                },
                {
                    path: 'userAddressList',
                    name: 'userAddressList',
                    meta: { title: '用户地址', parent: 'user' },
                    component: userAddressList
                },
                {
                    path: 'agentList/:id',
                    name: 'agentList',
                    meta: { title: '代理报表', parent: 'user' },
                    component: agentList
                },
                {
                    path: 'verifyCodeList',
                    name: 'verifyCodeList',
                    meta: { title: '短信验证码', parent: 'user' },
                    component: verifyCodeList
                },
                {
                    path: 'orderList',
                    name: 'orderList',
                    meta: { title: '抢单列表', parent: 'order' },
                    component: orderList
                },
                {
                    path: 'profit',
                    name: 'profit',
                    meta: { title: '每日收益', parent: 'order' },
                    component: profit
                },
                {
                    path: 'storeList',
                    name: 'storeList',
                    meta: { title: '分类列表', parent: 'store' },
                    component: storeList
                },
                {
                    path: 'goodList',
                    name: 'goodList',
                    meta: { title: '商品列表', parent: 'store' },
                    component: goodList
                },
                {
                    path: 'bannerList',
                    name: 'bannerList',
                    meta: { title: '轮播图列表', parent: 'system' },
                    component: bannerList
                },
                {
                    path: 'noticeList',
                    name: 'noticeList',
                    meta: { title: '公告列表', parent: 'system' },
                    component: noticeList
                },
                {
                    path: 'password',
                    name: 'password',
                    meta: { title: '修改密码', parent: 'system' },
                    component: password
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
