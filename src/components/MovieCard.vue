<template>
  <div class="movie-card">
    <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Movie Poster" class="movie-poster" />
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-overview">{{ movie.overview }}</p>
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

<style scoped>.movie-card {
  width: 220px; /* 카드 폭을 더 크게 조정 */
  height: 450px; /* 카드 높이도 증가 */
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start; /* 스크롤 스냅이 카드별로 작동하도록 설정 */
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: 65%; /* 포스터 이미지 비율 조정 */
  object-fit: cover;
}

.movie-info {
  padding: 10px;
  color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 35%; /* 정보 영역 비율 조정 */
}

.movie-title {
  font-size: 1.1rem; /* 제목 크기 약간 증가 */
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-overview {
  font-size: 0.9rem;
  color: #bbb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.movie-info p {
  font-size: 0.9rem;
  color: #bbb;
  margin: 0;
}

</style>
