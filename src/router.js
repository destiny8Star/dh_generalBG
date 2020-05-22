import Vue from 'vue'
import Router from 'vue-router'
import homeRouter from "./router/homeRouter";
import accountRouter from "./router/accountRouter";//我的账户模块
import agentRouter from "./router/agentRouter"; //代理商模块
import merchantRouter from "./router/merchantRouter"; //商户模块
import withdrawRouter from "./router/withdrawRouter"; //提现模块
import deviceRouter from "./router/deviceRouter"; //提现模块
import posterRouter from "./router/posterRouter"; // 广告图模块
import adRouter from "./router/adRouter"; // 广告模块
import transactionRouter from "./router/transactionRouter"; // 交易数据模块

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*', name: '404', component: () => import(/* webpackChunkName: "404" */ "./views/NotFound.vue")
    },
    {
      path: '/whiteList', name: 'whiteList', component: () => import(/* webpackChunkName: "whiteList" */ "./views/WhiteList.vue")
    },
    {
      path: '/', name: 'logon', component: () => import(/* webpackChunkName: "logon" */ "./views/Logon.vue")
    },
    {
      path: '/admin', name: 'admin', component: () => import(/* webpackChunkName: "admin" */ "./views/Admin.vue"),
      children: [...homeRouter, ...accountRouter, ...agentRouter, ...merchantRouter, ...withdrawRouter, ...deviceRouter, ...posterRouter, ...adRouter, ...transactionRouter]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = Vue.ls.get(Vue.webConfig.authTokenName);
  if (!user) {
    if (to.name == 'logon' || to.name=='whiteList') {
      next()
    } else {
      next({name: 'logon'})
    }
  }else {
    next();
  }
});

export default router