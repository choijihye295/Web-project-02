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
    path: '/signin', // 이 부분을 /sign-in에서 /signin으로 수정
    name: 'Signin',
    component: SignIn
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
