export default [
    {
        path:"/transaction",
        name:"transactionList",
        component: () => import(/*webpackChunkName:'transactionList'*/'../views/transaction/List.vue'),
        meta: {
            group_name: "交易数据",
            menu_name: "交易数据",
            file: "views/transaction/List.vue",
        },
    }
]