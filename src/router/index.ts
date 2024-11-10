import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignIn.vue'
import PopularView from "@/views/PopularView.vue"; // SignIn.vue 파일을 불러옵니다

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/signin', // 이 부분을 /sign-in에서 /signin으로 수정
    name: 'Signin',
    component: SignIn
  },
  {
    path: '/popular', // 이 부분을 /sign-in에서 /signin으로 수정
    name: 'popular',
    component: PopularView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
