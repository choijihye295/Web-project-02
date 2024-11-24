<template>
  <div class="wishlist-container">
    <HeaderComponent />
    <h2>내가 찜한 리스트</h2>
    <!-- 무한 스크롤 -->
    <div class="movie-list" @scroll="handleScroll">
      <div v-for="movie in paginatedMovies" :key="movie.id" class="movie-card">
        <MovieCard :movie="movie" />
      </div>
      <div v-if="isLoading" class="loading">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import MovieCard from '@/components/MovieCard.vue';

const wishlistMovies = ref([]);
const paginatedMovies = ref([]);
const isLoading = ref(false);
const itemsPerPage = 10; // 페이지당 영화 개수
const currentPage = ref(1);

// Local Storage에서 찜한 영화 불러오기
const loadWishlistMovies = () => {
  const storedMovies = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlistMovies.value = storedMovies;
  paginatedMovies.value = wishlistMovies.value.slice(0, itemsPerPage);
};

// 무한 스크롤 핸들러
const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading.value) {
    loadMoreMovies();
  }
};

// 추가 영화 로드
const loadMoreMovies = () => {
  const startIndex = currentPage.value * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  if (startIndex < wishlistMovies.value.length) {
    isLoading.value = true;
    setTimeout(() => {
      paginatedMovies.value.push(...wishlistMovies.value.slice(startIndex, endIndex));
      currentPage.value += 1;
      isLoading.value = false;
    }, 500); // 로딩 애니메이션을 위한 딜레이
  }
};

onMounted(() => {
  loadWishlistMovies();
});
</script>

<style scoped>
.wishlist-container {
  padding: 20px;
  color: white;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  overflow-y: auto;
  height: calc(100vh - 100px);
  scrollbar-width: none;
}

/* Webkit 기반 브라우저에서 스크롤바 숨기기 */
.movie-list::-webkit-scrollbar {
  display: none;
}

.loading {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  color: white;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
