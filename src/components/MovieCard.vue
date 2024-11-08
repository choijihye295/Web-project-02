<template>
  <div class="movie-card">
    <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Movie Poster" class="movie-poster" />
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.overview.slice(0, 100) }}...</p>
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
.movie-card {
  min-width: 150px; /* 카드의 최소 너비를 설정 */
  max-width: 180px; /* 카드의 최대 너비를 설정 */
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  scroll-snap-align: start; /* 카드가 스크롤 스냅에 맞춰지도록 설정 */
}

.movie-card:hover {
  transform: scale(1.05);
}


.movie-poster {
  width: 100%;
  height: 300px; /* 포스터 높이를 고정하여 일정하게 보이도록 */
  object-fit: cover;
}

.movie-info {
  padding: 15px;
  color: #eee;
  text-align: center;
}

.movie-info h3 {
  font-size: 1.2rem;
  margin: 10px 0;
  color: #e50914;
}

.movie-info p {
  font-size: 0.9rem;
  color: #bbb;
}
</style>
