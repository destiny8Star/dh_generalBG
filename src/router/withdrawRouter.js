export default [
    {
        path: '/withdraw/list',
        name: 'withdrawList',
        component: () => import(/* webpackChunkName: "withdrawList" */  '../views/withdraw/List.vue'),
        meta: {
            group_name:"提现记录",
            menu_name: "提现记录",
            file: "views/withdraw/List.vue",
        },
    }
]
