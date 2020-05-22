export default [
  {
    path: '/home',
    name: 'adminHome',
    component: () => import(/* webpackChunkName: "adminHome" */  '../views/home/Index.vue'),
  },
  {
    path: '/home/Index',
    name: 'adminHomeIndex',
    component: () => import(/* webpackChunkName: "adminHomeIndex" */  '../views/home/Index.vue'),
  }
]
