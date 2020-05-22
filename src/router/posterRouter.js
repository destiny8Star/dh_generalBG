export default [
    {
        path:"/poster/verify",
        name:"posterVerify",
        component: () => import(/*webpackChunkName:'posterVerify'*/'../views/poster/Verify.vue')
    }
]