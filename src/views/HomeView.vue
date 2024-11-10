<template>
  <div class="app-container">
    <!-- 헤더 섹션 -->
    <header class="app-header">
      <div class="logo">
        <a @click="navigateToHome">
          <font-awesome-icon icon="ticket-alt" class="icon" />
        </a>
      </div>
      <nav class="nav-links">
        <span>홈</span>
        <span>대세 콘텐츠</span>
        <span>찾아보기</span>
        <span>내가 찜한 리스트</span>
      </nav>
      <div class="user-icon">
        <font-awesome-icon icon="user" />
      </div>
    </header>

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

const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY

const bannerMovie = ref(null)
const popularMovies = ref([])
const latestMovies = ref([])
const actionMovies = ref([])

const movieSections = ref({})

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

/* 헤더 스타일 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  padding: 10px 20px;
  background-color: #1a1a1a;
  color: white;
  z-index: 1000;
}

.logo .icon {
  color: #E50914;
  font-size: 1.8rem;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links span {
  cursor: pointer;
  color: #e5e5e5;
  transition: color 0.3s;
}

.nav-links span:hover {
  color: #ffffff;
}

.user-icon {
  color: white;
  cursor: pointer;
}

.main-content {
  padding-top: 60px; /* 고정된 헤더의 높이만큼 여백 추가 */
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
}

.movie-list::-webkit-scrollbar {
  height: 8px; /* 스크롤바 높이를 조정 */
}

.movie-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 스크롤바 색상 */
  border-radius: 4px;
}

.movie-list::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 스크롤 트랙 색상 */
}

</style>