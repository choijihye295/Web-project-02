<template>
  <div class="home">
    <!-- 네비게이션 바 -->
    <nav class="nav">
      <span>홈</span>
      <span>대세 콘텐츠</span>
      <span>찾아보기</span>
      <span>내가 찜한 리스트</span>
    </nav>

    <!-- 영화 배너 섹션 -->
    <section v-if="bannerMovie" class="banner" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path})` }">
      <div class="banner-content">
        <h1>{{ bannerMovie.title }}</h1>
        <p>{{ bannerMovie.overview.slice(0, 100) }}...</p>
        <button>재생</button>
        <button>상세 정보</button>
      </div>
    </section>

    <!-- 인기 영화 섹션 -->
    <section class="movie-section">
      <h2>인기 영화</h2>
      <div v-if="popularMovies.length" class="movie-list">
        <MovieCard v-for="movie in popularMovies" :key="movie.id" :movie="movie" />
      </div>
    </section>

    <!-- 최신 영화 섹션 -->
    <section class="movie-section">
      <h2>최신 영화</h2>
      <div v-if="latestMovies.length" class="movie-list">
        <MovieCard v-for="movie in latestMovies" :key="movie.id" :movie="movie" />
      </div>
    </section>

    <!-- 액션 영화 섹션 -->
    <section class="movie-section">
      <h2>액션 영화</h2>
      <div v-if="actionMovies.length" class="movie-list">
        <MovieCard v-for="movie in actionMovies" :key="movie.id" :movie="movie" />
      </div>
    </section>
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

const fetchMovies = async () => {
  try {
    const bannerResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`)
    bannerMovie.value = bannerResponse.data.results[0]

    const popularResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`)
    popularMovies.value = popularResponse.data.results

    const latestResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`)
    latestMovies.value = latestResponse.data.results

    const actionResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=ko-KR&page=1`)
    actionMovies.value = actionResponse.data.results
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

onMounted(fetchMovies)
</script>

<style scoped>
.home {
  padding: 20px;
  color: white;
  background-color: #333;
}

.nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: white;
}

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
  overflow-x: auto;
  padding-bottom: 10px;
}

.movie-list::-webkit-scrollbar {
  display: none;
}
</style>
