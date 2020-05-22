export default [
    {
        path: '/account/list',
        name: 'accountList',
        component: () => import(/* webpackChunkName: "accountList" */  '../views/account/List.vue'),
        meta: {
            group_name:"我的账户",
            menu_name: "设备信息",
            file: "views/account/List.vue",
        },
    },
    {
        path: '/account/info',
        name: 'accountInfo',
        component: () => import(/* webpackChunkName: "accountInfo" */  '../views/account/Info.vue'),
        meta: {
          group_name:"我的账户",
            menu_name: "商户信息",
            file: "views/account/Info.vue",
        },
    },
    {
        path: '/account/change',
        name: 'accountChange',
        component: () => import(/* webpackChunkName: "accountChange" */  '../views/account/Change.vue'),
        meta: {
            group_name:"我的账户",
            menu_name: "修改密码",
            file: "views/account/Change.vue",
        },
    },

]
