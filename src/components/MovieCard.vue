<template>
  <div class="movie-card">
    <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Movie Poster" class="movie-poster" />
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.overview.slice(0, 50) }}...</p>
      <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
      <p><strong>평점:</strong> {{ movie.vote_average }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  movie: Object
})
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
  overflow-x: auto; /* 가로 스크롤 추가 */
  padding-bottom: 10px;
}

.movie-list::-webkit-scrollbar {
  display: none; /* 스크롤바 숨기기 (필요시 추가) */
}
</style>
