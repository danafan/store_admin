import Vue from 'vue'
import Router from 'vue-router'

const login = resolve=>require(['@/pages/login'],resolve)
const home = resolve=>require(['@/pages/home'],resolve)
const index = resolve=>require(['@/pages/Index/index'],resolve)
const task = resolve=>require(['@/pages/Task/task'],resolve)
const push_task = resolve=>require(['@/pages/Task/push_task'],resolve)
const task_list = resolve=>require(['@/pages/Task/task_list'],resolve)
const task_order = resolve=>require(['@/pages/Task/task_order'],resolve)
const rebates_order = resolve=>require(['@/pages/Task/rebates_order'],resolve)
const financial = resolve=>require(['@/pages/Financial/financial'],resolve)
const top_up = resolve=>require(['@/pages/Financial/top_up'],resolve)
const money_detail = resolve=>require(['@/pages/Financial/money_detail'],resolve)

Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/login',
    component: login,
  },
  {
    path: '/home',
    component: home,
    children:[
    { path: '/index',name:"首页", component: index},
    { path: '/task',name:"任务管理", component: task,
    children:[
    { path: '/task/push_task',name:"发布任务", component: push_task},
    { path: '/task/task_list',name:"任务列表", component: task_list},
    { path: '/task/task_order',name:"任务订单", component: task_order},
    { path: '/task/rebates_order',name:"返款订单", component: rebates_order}
    ]},
    { path: '/financial',name:"财务管理", component: financial,
    children:[
    { path: '/financial/top_up',name:"账户充值", component: top_up},
    { path: '/financial/money_detail',name:"资金明细", component: money_detail}
    ]},
    ]
  }
  ]
})
// 路由跳转前的钩子
router.beforeEach(function (to, from, next) {
  let path = to.fullPath;
  if(path == '/task'){
    router.push('/task/task_list')
  }
  if(path == '/financial'){
    router.push('/financial/top_up')
  }
  // sessionStorage.setItem("tab",path);
  next()
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router;