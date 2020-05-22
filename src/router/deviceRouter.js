export default [
    {
        path: '/device',
        name: 'deviceIndex',
        component: () => import(/* webpackChunkName: "deviceIndex" */  '../views/device/Index.vue'),
        meta: {
            group_name:"设备管理",
            menu_name: "设备管理",
            file: "views/device/Index.vue",
        },
    },
    {
        path: '/device/detail',
        name: 'deviceDetail',
        component: () => import(/* webpackChunkName: "deviceDetail" */  '../views/device/Detail.vue'),
        meta: {
            group_name:"设备详情",
            menu_name: "设备详情",
            file: "views/device/Detail.vue",
        },
    },
    {
        path: '/device/storage',
        name: 'deviceStorage',
        component: () => import(/* webpackChunkName: "deviceStorage" */  '../views/device/storage/List.vue'),
        meta: {
            group_name:"入库列表",
            menu_name: "入库列表",
            file: "views/device/storage/List.vue",
        },
    },
    {
        path: '/device/storage/detail',
        name: 'deviceStorageDetail',
        component: () => import(/* webpackChunkName: "deviceStorageDetail" */  '../views/device/storage/Detail.vue'),
        meta: {
            group_name:"入库详情",
            menu_name: "入库详情",
            file: "views/device/storage/Detail.vue",
        },
    },
    {
        path: '/device/importDevice',
        name: 'deviceImportDevice',
        component: () => import(/* webpackChunkName: "deviceImportDevice" */  '../views/device/storage/ImportDevice.vue'),
        meta: {
            group_name:"导入设备",
            menu_name: "导入设备",
            file: "views/device/storage/ImportDevice.vue",
        },
    },
    {
        path: '/device/delivery',
        name: 'deviceDelivery',
        component: () => import(/* webpackChunkName: "deviceDelivery" */  '../views/device/delivery/List.vue'),
        meta: {
            group_name:"出库列表",
            menu_name: "出库列表",
            file: "views/device/delivery/List.vue",
        },
    },
    {
        path: '/device/delivery/detail',
        name: 'deviceDeliveryDetail',
        component: () => import(/* webpackChunkName: "deviceDeliveryDetail" */  '../views/device/delivery/Detail.vue'),
        meta: {
            group_name:"出库详情",
            menu_name: "出库详情",
            file: "views/device/delivery/Detail.vue",
        },
    },
    {
        path: '/device/exportDevice',
        name: 'deviceExportDevice',
        component: () => import(/* webpackChunkName: "deviceExportDevice" */  '../views/device/delivery/ExportDevice.vue'),
        meta: {
            group_name:"设备出库",
            menu_name: "设备出库",
            file: "views/device/delivery/ExportDevice.vue",
        },
    },
    {
        path: '/device/nameManage',
        name: 'deviceNameManage',
        component: () => import(/* webpackChunkName: "deviceNameManage" */  '../views/device/nameManage/List.vue'),
        meta: {
            group_name:"名称管理",
            menu_name: "名称管理",
            file: "views/device/nameManage/List.vue",
        },
    },
    {
        path: '/device/addName',
        name: 'deviceAddName',
        component: () => import(/* webpackChunkName: "deviceAddName" */  '../views/device/nameManage/AddName.vue'),
        meta: {
            group_name:"添加设备名称",
            menu_name: "添加设备名称",
            file: "views/device/nameManage/AddName.vue",
        },
    },
    {
        path: '/device/classifyManage',
        name: 'deviceClassifyManage',
        component: () => import(/* webpackChunkName: "deviceClassifyManage" */  '../views/device/classifyManage/List.vue'),
        meta: {
            group_name:"分类管理",
            menu_name: "分类管理",
            file: "views/device/classifyManage/List.vue",
        },
    },
    {
        path: '/device/recycle',
        name: 'deviceRecycle',
        component: () => import(/* webpackChunkName: "deviceRecycle" */  '../views/device/recycle/List.vue'),
        meta: {
            group_name:"回收记录",
            menu_name: "回收记录",
            file: "views/device/recycle/List.vue",
        },
    },
    {
        path: '/device/recycle/detail',
        name: 'deviceRecycleDetail',
        component: () => import(/* webpackChunkName: "deviceRecycleDetail" */  '../views/device/recycle/Detail.vue'),
        meta: {
            group_name:"回收详情",
            menu_name: "回收详情",
            file: "views/device/recycle/Detail.vue",
        },
    }
]
