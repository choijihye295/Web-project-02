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

    <!-- 영화 섹션 (인기 영화, 최신 영화, 액션 영화) -->
    <section v-for="(movies, title) in movieSections" :key="title" class="movie-section">
      <h2>{{ title }}</h2>
      <div class="movie-list">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
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
.home {
  padding: 0;
  margin: 0;
  color: white;
  background-color: #333;
  width: 100%;
}

.nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px 0;
  margin: 0 auto;
  z-index: 10;
  transition: background-color 0.3s;
  max-width: 100%;
}

.scrolled .nav {
  background-color: rgba(0, 0, 0, 0.6);
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
  overflow-x: scroll; /* 스크롤을 항상 보여줍니다 */
  overflow-y: hidden; /* 세로 스크롤 숨기기 */
  padding-bottom: 10px;
  white-space: nowrap;
  scroll-snap-type: x mandatory; /* 스크롤 스냅을 추가 */
}

.movie-list::-webkit-scrollbar {
  height: 8px; /* 스크롤바 높이를 조정 */
}

.movie-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 스크롤바 색상 조정 */
  border-radius: 4px;
}

.movie-list::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 스크롤 트랙 색상 조정 */
}

</style>
