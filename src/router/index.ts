import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/sign-in/SignIn.vue' // SignIn.vue 파일을 불러옵니다

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/sign-in', // 로그인 페이지 경로 추가
    name: 'sign-in',
    component: SignIn
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
