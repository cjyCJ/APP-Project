import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home' // 是App的子组件
import Welcome from '@/components/Welcome' // 具体是home的子组件
import User from '@/components/User' // 具体是home的子组件
import Rights from '@/components/Rights' // 具体是home的子组件
import Role from '@/components/Role' // 具体是home的子组件
import Cat from '@/components/Cat' // 具体是home的子组件
import Param from '@/components/Param' // 具体是home的子组件
import Goods from '@/components/Goods' // 具体是home的子组件
import GoodsAdd from '@/components/GoodsAdd' // 具体是home的子组件
import Report from '@/components/Report' // 具体是home的子组件

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Role },
        { path: '/categories', component: Cat },
        { path: '/params', component: Param },
        { path: '/goods', component: Goods },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 路由导航守卫，检测token如果不存在，就跳转到login登录组件去
router.beforeEach((to, from, next) => {
  // 访问/login 就直接pass
  if (to.path === '/login') {
    return next()
  }

  // 访问非login，判断token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next() // token存在，继续....
})

export default router
