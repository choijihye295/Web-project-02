import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Font Awesome 라이브러리 가져오기
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
// main.js
import '@fortawesome/fontawesome-free/css/all.css';

// 라이브러리에 아이콘 추가
library.add(fas)

// 전역 스타일 불러오기
import './assets/main.css' // 여백 제거와 배경색 설정

// 앱 생성 및 Font Awesome 컴포넌트 등록
const app = createApp(App)
app.use(store)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon) // Font Awesome 컴포넌트를 전역 등록
app.mount('#app')
