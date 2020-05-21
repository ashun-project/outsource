import Vue from 'vue'
import Router from 'vue-router'


const login = resolve => require(['@/views/login'], resolve)
const register = resolve => require(['@/views/register'], resolve)
const forget = resolve => require(['@/views/forget'], resolve)
const home = resolve => require(['@/views/home'], resolve)
const bankcard = resolve => require(['@/views/bankcard'], resolve)
const bandingbank = resolve => require(['@/views/bandingbank'], resolve)
const my = resolve => require(['@/views/my'], resolve)
const set = resolve => require(['@/views/set'], resolve)
const bindphone = resolve => require(['@/views/bindphone'], resolve)
const updatepassword = resolve => require(['@/views/updatepassword'], resolve)
const trade = resolve => require(['@/views/trade'], resolve)
const rechargetype = resolve => require(['@/views/rechargetype'], resolve)
const rechargebank = resolve => require(['@/views/rechargebank'], resolve)
const rechargesuccess = resolve => require(['@/views/rechargesuccess'], resolve)
const grabnotes = resolve => require(['@/views/grabnotes'], resolve)
const address = resolve => require(['@/views/address'], resolve)
const addressedit = resolve => require(['@/views/addressedit'], resolve)
const commission = resolve => require(['@/views/commission'], resolve)
const withdraw = resolve => require(['@/views/withdraw'], resolve)
const withdrawnotes = resolve => require(['@/views/withdrawnotes'], resolve)
const withdrawdetail = resolve => require(['@/views/withdrawdetail'], resolve)
const withdrawquota = resolve => require(['@/views/withdrawquota'], resolve)
const rechargenotes = resolve => require(['@/views/rechargenotes'], resolve)
const rechargedetail = resolve => require(['@/views/rechargedetail'], resolve)
const active = resolve => require(['@/views/active'], resolve)
const activedetail = resolve => require(['@/views/activedetail'], resolve)
const share = resolve => require(['@/views/share'], resolve)
const brief = resolve => require(['@/views/brief'], resolve)
const grabrule = resolve => require(['@/views/grabrule'], resolve)
const togetherrule = resolve => require(['@/views/togetherrule'], resolve)
const question = resolve => require(['@/views/question'], resolve)
const noticetype = resolve => require(['@/views/noticetype'], resolve)
const noticelist = resolve => require(['@/views/noticelist'], resolve)
const noticedetail = resolve => require(['@/views/noticedetail'], resolve)
const order = resolve => require(['@/views/order'], resolve)
const orderdetail = resolve => require(['@/views/orderdetail'], resolve)
const goods = resolve => require(['@/views/goods'], resolve)
const service = resolve => require(['@/views/service'], resolve)
const servicewin = resolve => require(['@/views/servicewin'], resolve)




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: { nav: true }
    },
    {
      path: '/my',
      name: 'my',
      component: my,
      meta: { nav: true }
    },
    {
      path: '/bankcard',
      name: 'bankcard',
      component: bankcard
    },
    {
      path: '/bandingbank',
      name: 'bandingbank',
      component: bandingbank
    },
    {
      path: '/set',
      name: 'set',
      component: set
    },
    {
      path: '/bindphone',
      name: 'bindphone',
      component: bindphone
    },
    {
      path: '/updatepassword',
      name: 'updatepassword',
      component: updatepassword
    },
    {
      path: '/trade',
      name: 'trade',
      component: trade
    },
    {
      path: '/rechargetype',
      name: 'rechargetype',
      component: rechargetype
    },
    {
      path: '/rechargebank/:id',
      name: 'rechargebank',
      component: rechargebank
    },
    {
      path: '/rechargesuccess/:id',
      name: 'rechargesuccess',
      component: rechargesuccess
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: withdraw
    },
    {
      path: '/grabnotes',
      name: 'grabnotes',
      component: grabnotes
    },
    {
      path: '/address',
      name: 'address',
      component: address
    },
    {
      path: '/addressedit/:id',
      name: 'addressedit',
      component: addressedit
    },
    {
      path: '/commission',
      name: 'commission',
      component: commission
    },
    {
      path: '/withdrawnotes',
      name: 'withdrawnotes',
      component: withdrawnotes
    },
    {
      path: '/withdrawdetail/:id',
      name: 'withdrawdetail',
      component: withdrawdetail
    },
    {
      path: '/rechargenotes',
      name: 'rechargenotes',
      component: rechargenotes
    },
    {
      path: '/rechargedetail/:id',
      name: 'rechargedetail',
      component: rechargedetail
    },
    {
      path: '/active',
      name: 'active',
      component: active
    },
    {
      path: '/activedetail/:id',
      name: 'activedetail',
      component: activedetail
    },
    {
      path: '/share',
      name: 'share',
      component: share
    },
    {
      path: '/brief',
      name: 'brief',
      component: brief
    },
    {
      path: '/grabrule',
      name: 'grabrule',
      component: grabrule
    },
    {
      path: '/togetherrule',
      name: 'togetherrule',
      component: togetherrule
    },
    {
      path: '/question',
      name: 'question',
      component: question
    },
    {
      path: '/order/:id',
      name: 'order',
      component: order,
      // meta: { nav: true }
    },
    {
      path: '/orderdetail',
      name: 'orderdetail',
      component: orderdetail
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods,
      meta: { nav: true }
    },
    {
      path: '/service',
      name: 'service',
      component: service,
      meta: { nav: true }
    },
    {
      path: '/servicewin',
      name: 'servicewin',
      component: servicewin
    },
    {
      path: '/withdrawquota',
      name: 'withdrawquota',
      component: withdrawquota
    },
    {
      path: '/noticedetail/:id',
      name: 'noticedetail',
      component: noticedetail
    },
    {
      path: '/noticelist/:type/:id',
      name: 'noticelist',
      component: noticelist
    },
    {
      path: '/noticetype',
      name: 'noticetype',
      component: noticetype
    }
  ]
})
