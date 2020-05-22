export default [
    {
        path: '/agent/list',
        name: 'agentList',
        component: () => import(/* webpackChunkName: 'agentList' */ '../views/agent/List.vue')
    },
    {
        path: '/agent/detail',
        name: 'agentDetail',
        component: () => import(/* webpackChunkName: 'agentDetail' */ '../views/agent/Detail.vue')
    },
    {
        path:'/agent/auditList',
        name:'agentAuditList',
        component:()=>import(/* webpackChunkName: 'agentAuditList' */ '../views/agent/AuditList.vue')
    },
    {
        path:'/agent/dredge',
        name:'agentDredge',
        component:()=>import(/* webpackChunkName: 'agentDredge' */ '../views/agent/Dredge.vue')
    },
    {
        path:'/agent/distributor',
        name:'agentDistributor',
        component:()=>import(/* webpackChunkName: 'agentDistributor' */ '../views/agent/Distributor.vue')
    },
]