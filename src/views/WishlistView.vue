<template>
  <div class="wishlist-container">
    <HeaderComponent />
    <h2 class="wishlist-title">내가 찜한 리스트</h2>
    <div class="movie-list" @scroll="handleScroll">
      <div v-for="movie in visibleMovies" :key="movie.id" class="movie-card">
        <MovieCard :movie="movie" />
      </div>
      <div v-if="isLoading" class="loading">Loading...</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WishlistManager } from '@/utils/WishlistManager';
import { Movie } from '@/types/movie';
import HeaderComponent from '@/components/HeaderComponent.vue';
import MovieCard from '@/components/MovieCard.vue';

// 로컬 스토리지에서 사용자 ID 가져오기
const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
if (!user.id) {
  console.error('로그인 정보가 없습니다.');
}
const userId = user.id;

// WishlistManager 초기화
const wishlistManager = new WishlistManager(userId);

// 상태 변수
const wishlist = ref<Movie[]>([]);
const visibleMovies = ref<Movie[]>([]);
const isLoading = ref(false);
const page = ref(1);
const itemsPerPage = 20; // 한 번에 표시할 영화 개수

// 찜한 목록 로드 및 초기화
const loadWishlist = () => {
  wishlist.value = wishlistManager.getWishlist();
  updateVisibleMovies();
};

// 무한 스크롤로 표시할 영화 업데이트
const updateVisibleMovies = () => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  visibleMovies.value.push(...wishlist.value.slice(start, end));
};

// 스크롤 핸들러
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5 && !isLoading.value) {
    if (page.value * itemsPerPage < wishlist.value.length) {
      page.value++;
      updateVisibleMovies();
    }
  }
};

// 컴포넌트 초기화
onMounted(() => {
  loadWishlist();
});
</script>


<style scoped>
.wishlist-container {
  padding: 20px;
  color: white;
  text-align: center;
}

h2 {
  margin-top: 50px; /* 헤더와 간격 추가 */
  margin-bottom: 20px;
  font-size: 1.5rem;
}

/* 영화 리스트 */
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  height: calc(100vh - 150px); /* 헤더와 제목 여백 고려 */
  overflow-y: auto; /* 스크롤 활성화 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨김 */
}

.movie-list::-webkit-scrollbar {
  display: none;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: white;
}
</style>
