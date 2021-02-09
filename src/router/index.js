import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress' // Progress 进度条
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/hemamm',
    component: () => import('@/components/LayOut/LayOut')
  }
]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject) }
  return originalPush.call(this, location).catch((err) => err)
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login') {
    next()
    NProgress.done()
  } else {
    if (store.getters.token) { // ? 有token
      if (!store.getters.userProfile) { // ? 刷新页面有token 没有用户信息,重新获取
        store.dispatch('loginModule/userProfile')
      }
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

export default router
