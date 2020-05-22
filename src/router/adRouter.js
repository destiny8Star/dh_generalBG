export default [
    {
        path:"/ad",
        name:"adList",
        component: () => import(/*webpackChunkName:'adList'*/'../views/ad/List.vue'),
        meta: {
            group_name: "广告列表",
            menu_name: "广告列表",
            file: "views/ad/List.vue",
        },
    },
    {
        path: '/ad/detail',
        name: 'adDetail',
        component: () => import(/* webpackChunkName: "adDetail" */  '../views/ad/Detail.vue'),
        meta: {
            group_name: "广告详情",
            menu_name: "广告详情",
            file: "views/ad/Detail.vue",
        },
    },
]