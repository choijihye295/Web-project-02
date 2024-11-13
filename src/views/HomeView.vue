<template>
  <div class="app-container">
    <!-- 헤더 섹션 -->
    <HeaderComponent />

    <!-- 메인 콘텐츠 섹션 -->
    <main class="main-content">
      <!-- 영화 배너와 섹션 콘텐츠 -->
      <section v-if="bannerMovie" class="banner" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path})` }">
        <div class="banner-content">
          <h1>{{ bannerMovie.title }}</h1>
          <p>{{ bannerMovie.overview.slice(0, 100) }}...</p>
          <button>재생</button>
          <button>상세 정보</button>
        </div>
      </section>

      <section v-for="(movies, title) in movieSections" :key="title" class="movie-section">
        <h2>{{ title }}</h2>
        <div class="movie-list">
          <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>
      </section>
    </main>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MovieCard from '@/components/MovieCard.vue'
import HeaderComponent from "@/components/HeaderComponent.vue";

// TMDB API KEY
const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY

// 상태 관리
const bannerMovie = ref(null)
const popularMovies = ref([])
const latestMovies = ref([])
const actionMovies = ref([])
const movieSections = ref({})

// 로컬 저장소에서 userId 가져오기
const userId = ref(localStorage.getItem("registeredEmail") || "Guest")

// 로그아웃 함수
const logout = () => {
  localStorage.removeItem("registeredEmail")
  userId.value = "Guest" // userId 값을 초기 상태로 설정
  isDropdownOpen.value = false
}

// 드롭다운 메뉴 상태 관리
const isDropdownOpen = ref(false)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 영화 데이터 가져오기 함수
const fetchMovies = async () => {
  try {
    const bannerResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`)
    bannerMovie.value = bannerResponse.data.results[0]

    const popularResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`)
    popularMovies.value = popularResponse.data.results

    const latestResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=2`)
    latestMovies.value = latestResponse.data.results

    const actionResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=ko-KR&page=1`)
    actionMovies.value = actionResponse.data.results

    movieSections.value = {
      '인기 영화': popularMovies.value,
      '최신 영화': latestMovies.value,
      '액션 영화': actionMovies.value,
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

onMounted(fetchMovies)
</script>


<style scoped>
/* 전체 페이지 배경과 마진을 없앰 */
* {
  margin: 1px;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #333;
  overflow-x: hidden;
}

.app-container {
  margin: 0 50px; /* 좌우 마진 추가 */
}

/* 헤더 스타일 */
.app-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw; /* 뷰포트 너비에 맞추어 고정 */
  padding: 10px 0;
  background-color: rgba(26, 26, 26, 0.85); /* 기본 투명도 설정 */
  color: white;
  z-index: 1000;
  transition: background-color 0.3s ease; /* 투명도 애니메이션 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 약간의 그림자 추가 */
}
.scrolled .app-header {
  background-color: rgba(26, 26, 26, 0.5); /* 스크롤 시 투명도 낮춤 */
}

/* 헤더 안쪽의 컨텐츠를 중앙에 배치 */
.header-content {
  width: 100%;
  max-width: 1200px; /* 최대 너비 설정 */
  margin: 0 auto; /* 양쪽 여백 자동으로 설정 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px; /* 좌우 여백 */
  box-sizing: border-box;
}

.nav-links a {
  text-decoration: none; /* 밑줄 제거 */
  color: white; /* 링크 색상을 항상 흰색으로 유지 */
  padding: 0 10px;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #e50914; /* 호버 시 빨간색으로 변경 */
}


.logo .icon {
  color: #E50914;
  font-size: 1.8rem;
}


.user-icon {
  color: white;
  cursor: pointer;
}

.main-content {
  padding-top: 60px; /* 고정된 헤더의 높이만큼 여백 추가 */
  padding-bottom: 60px; /* 아래쪽 여백 추가 */
}

.user-icon {
  color: white;
  cursor: pointer;
  position: relative; /* 드롭다운 메뉴 위치를 설정하기 위해 상대 위치 */
}

.dropdown-menu {
  position: absolute;
  top: 100%; /* 사용자 아이콘 바로 아래에 위치 */
  right: 0; /* 사용자 아이콘에 맞춰 정렬 */
  background-color: #333; /* 드롭다운 배경색 */
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
  border-radius: 5px;
  z-index: 1000;
  color: white;
  margin-top: 5px; /* 사용자 아이콘과의 간격 */
  min-width: 100px; /* 최소 너비 설정 */
  text-align: center;
}

.dropdown-menu p {
  margin: 0;
  font-weight: bold;
}

.dropdown-menu button {
  background-color: #e50914;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  text-align: center;
  border-radius: 3px;
}

.dropdown-menu button:hover {
  background-color: #d40813;
}
/* 배너 스타일 */
.banner {
  height: 400px;
  display: flex;
  align-items: center;
  color: white;
  background-size: cover;
  background-position: center;
}

.banner-content {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  width: 50%;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.banner-content p {
  margin-bottom: 20px;
  font-size: 1rem;
}

.banner-content button {
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 1rem;
  background-color: #e50914;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px; /* 둥근 모서리를 위한 속성 추가 */
}

/* 영화 섹션 스타일 */
.movie-section {
  margin-top: 20px;
}

.movie-section h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #e50914;
}

.movie-list {
  display: flex;
  gap: 20px;
  overflow-x: scroll; /* 가로 스크롤을 강제로 설정 */

  padding-bottom: 10px;
  scroll-snap-type: x mandatory; /* 스크롤 스냅 기능 추가 */
  overscroll-behavior-x: contain; /* 가로 스크롤 중 세로 스크롤 간섭 방지 */
  touch-action: pan-x pan-y; /* 터치스크린 환경에서의 스크롤 개선 */

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer and Edge */

  /* Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}

.movie-card {
  min-width: 180px; /* 카드의 최소 너비를 고정 */
  max-width: 180px; /* 카드의 최대 너비를 고정 */
  height: 400px;
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
  -ms-overflow-style: none; /* Internet Explorer에서 스크롤바 숨기기 */
}

.movie-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera에서 스크롤바 숨기기 */
}

.movie-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0); /* 스크롤바 핸들 투명 */
}

.movie-list::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0); /* 스크롤 트랙 투명 */
}

</style>
