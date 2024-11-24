<template>
  <div class="wishlist-container">
    <HeaderComponent />
    <h2>내가 찜한 리스트</h2>

    <!-- 영화 리스트 -->
    <div class="movie-list" @scroll="handleScroll">
      <div v-for="movie in paginatedMovies" :key="movie.id" class="movie-card">
        <MovieCard :movie="movie" />
      </div>
      <div v-if="isLoading" class="loading">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import MovieCard from '@/components/MovieCard.vue';

// 상태 변수
const wishlist = ref([]); // 로컬 스토리지에서 불러온 영화 데이터
const paginatedMovies = ref([]); // 현재 페이지에서 보여줄 영화 데이터
const page = ref(1); // 현재 페이지 번호
const itemsPerPage = 20; // 한 번에 로드할 영화 개수
const isLoading = ref(false); // 로딩 상태

// 로컬 스토리지에서 영화 불러오기
const loadWishlist = () => {
  const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist.value = storedWishlist;
  paginateMovies(); // 첫 페이지 데이터 로드
};

// 현재 페이지의 영화 데이터 추가
const paginateMovies = () => {
  const startIndex = (page.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const moviesToAdd = wishlist.value.slice(startIndex, endIndex);

  if (moviesToAdd.length) {
    paginatedMovies.value.push(...moviesToAdd);
  }
  isLoading.value = false;
};

// 무한 스크롤 이벤트 핸들러
const handleScroll = (event) => {
  const {scrollTop, clientHeight, scrollHeight} = event.target;

  // 스크롤이 끝에 도달하면 추가 데이터 로드
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading.value) {
    if (page.value * itemsPerPage < wishlist.value.length) {
      isLoading.value = true;
      page.value += 1;
      paginateMovies();
    }
  }
};

// 컴포넌트가 마운트될 때 로컬 스토리지에서 데이터 로드
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
  margin-top: 40px; /* 헤더와 간격 추가 */
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

/* Webkit 기반 브라우저에서 스크롤바 숨기기 */
.movie-list::-webkit-scrollbar {
  display: none;
}

.loading {
  text-align: center;
  padding: 10px;
  font-size: 1.2rem;
  color: #bbb;
}
</style>
