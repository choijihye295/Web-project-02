<template>
  <div
      class="movie-card"
      :class="{ selected: isSelected }"
      @click="toggleWishlist"
  >
    <img
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        alt="Movie Poster"
        class="movie-poster"
    />
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
      <p><strong>평점:</strong> {{ movie.vote_average }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import { WishlistManager } from '@/utils/WishlistManager';
import { Movie } from '@/types/movie';

// 로컬 스토리지에서 사용자 ID 가져오기
const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
if (!user.id) {
  console.error('로그인 정보가 없습니다.');
}
const userId = user.id;

// WishlistManager 초기화
const wishlistManager = new WishlistManager(userId);

// props 정의
const props = defineProps<{ movie: Movie }>();

// 상태 관리
const isSelected = ref(false);

// 초기 상태 설정
onMounted(() => {
  const wishlist = wishlistManager.getWishlist();
  isSelected.value = wishlist.some((item) => item.id === props.movie.id);
});

// 찜 상태 토글
const toggleWishlist = () => {
  wishlistManager.toggleWishlist(props.movie);
  isSelected.value = !isSelected.value;
};
</script>


<style scoped>
.movie-card {
  width: 220px;
  height: 450px;
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, border 0.3s;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card.selected {
  border: 3px solid white;
}

.movie-poster {
  width: 100%;
  height: 65%;
  object-fit: cover;
}

.movie-info {
  padding: 10px;
  color: #eee;
}

.movie-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
