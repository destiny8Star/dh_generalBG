export default [
    {
        path: '/merchant/list',
        name: 'merchantList',
        component: () => import(/* webpackChunkName: 'merchantList' */ '../views/merchant/List.vue')
    },
    {
        path:'/merchant/detail',
        name:'merchantDetail',
        component:()=>import(/* webpackChunkName: 'merchantDetail' */ '../views/merchant/Detail.vue')
    },

    {
        path:'/merchant/alipayAudit',
        name:'merchantAlipayAudit',
        component:()=>import(/* webpackChunkName: 'merchantAlipayAudit' */ '../views/merchant/AlipayAudit.vue')
    },
    {
        path:'/merchant/alipayDetail',
        name:'merchantAlipayDetail',
        component:()=>import(/* webpackChunkName: 'merchantAlipayDetail' */ '../views/merchant/AlipayDetail.vue')
    },

    {
        path:'/merchant/weChatAudit',
        name:'merchantWeChatAudit',
        component:()=>import(/* webpackChunkName: 'merchantWeChatAudit' */ '../views/merchant/WeChatAudit.vue')
    },
    {
        path:'/merchant/weChatDetail',
        name:'merchantWeChatDetail',
        component:()=>import(/* webpackChunkName: 'merchantWeChatDetail' */ '../views/merchant/WeChatDetail.vue')
    },

    {
        path:'/merchant/lakalaAudit',
        name:'merchantLakalaAudit',
        component:()=>import(/* webpackChunkName: 'merchantLakalaAudit' */ '../views/merchant/LakalaAudit.vue')
    },
    {
        path:'/merchant/lakalaDetail',
        name:'merchantLakalaDetail',
        component:()=>import(/* webpackChunkName: 'merchantLakalaDetail' */ '../views/merchant/LakalaDetail.vue')
    }

]