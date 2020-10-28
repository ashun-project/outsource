import Vue from 'vue'
import Router from 'vue-router'

const login = resolve => require(['@/views/login/login'], resolve)
const layout = resolve => require(['@/views/layout/layout'], resolve)
const userList = resolve => require(['@/views/admin_user'], resolve)
const commentList = resolve => require(['@/views/admin_comment'], resolve)
const collectList = resolve => require(['@/views/admin_collect'], resolve)
const dzList = resolve => require(['@/views/admin_dz'], resolve)
const bannerList = resolve => require(['@/views/admin_banner'], resolve)
const noticeList = resolve => require(['@/views/admin_notice'], resolve)
const tuList = resolve => require(['@/views/admin_tu'], resolve)
const tuDownedList = resolve => require(['@/views/admin_tu_downed'], resolve)
const commentExamineList = resolve => require(['@/views/admin_comment_examine'], resolve)


Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            // name: '',
            redirect: 'userList',
            component: layout,
            children: [
                {
                    path: 'userList',
                    name: 'userList',
                    meta: { title: '会员列表' },
                    component: userList
                },
                {
                    path: 'commentList',
                    name: 'commentList',
                    meta: { title: '评论列表' },
                    component: commentList
                },
                {
                    path: 'commentExamineList',
                    name: 'commentExamineList',
                    meta: { title: '评论审核' },
                    component: commentExamineList
                },
                {
                    path: 'collectList',
                    name: 'collectList',
                    meta: { title: '收藏列表' },
                    component: collectList
                },
                {
                    path: 'dzList',
                    name: 'dzList',
                    meta: { title: '点赞列表' },
                    component: dzList
                },
                {
                    path: 'bannerList',
                    name: 'bannerList',
                    meta: { title: '轮播图列表' },
                    component: bannerList
                },
                {
                    path: 'noticeList',
                    name: 'noticeList',
                    meta: { title: '公告列表' },
                    component: noticeList
                },
                {
                    path: 'tuList',
                    name: 'tuList',
                    meta: { title: '下载图片' },
                    component: tuList
                },
                {
                    path: 'tuDownedList',
                    name: 'tuDownedList',
                    meta: { title: '已下载列表' },
                    component: tuDownedList
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
