<template>
  <div class="popular-view">
    <HeaderComponent />
    <!-- 상단 버튼 -->
    <div class="view-options">
      <button @click="setView('table')" :class="{ active: currentView === 'table' }">Table View</button>
      <button @click="setView('infinite')" :class="{ active: currentView === 'infinite' }">Infinite Scroll</button>
    </div>

    <!-- Table View -->
    <div v-if="currentView === 'table'" class="table-view">
      <div class="movie-grid">
        <MovieCard v-for="movie in paginatedMovies" :key="movie.id" :movie="movie" />
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>

    <!-- Infinite Scroll View -->
    <div v-else class="infinite-view" @scroll="handleScroll">
      <div class="movie-grid">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>
      <div v-if="isLoading" class="loading">Loading...</div>
      <button v-if="showTopButton" @click="scrollToTop" class="top-button">Top</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MovieCard from '@/components/MovieCard.vue';
import HeaderComponent from "@/components/HeaderComponent.vue";

const currentView = ref('table'); // 현재 View 상태
const movies = ref([]);
const paginatedMovies = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);
const showTopButton = ref(false);
const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY;

// View 변경 함수
const setView = (view) => {
  currentView.value = view;
  if (view === 'table') {
    loadMoviesForPage(1);
  }
};

// Table View: 페이지네이션에 맞춰 데이터 로드
const loadMoviesForPage = async (page) => {
  isLoading.value = true;
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'ko-KR',
      page,
    },
  });
  paginatedMovies.value = response.data.results;
  totalPages.value = response.data.total_pages;
  currentPage.value = page;
  isLoading.value = false;
};

// Infinite Scroll: 스크롤 시 데이터 추가 로드
const loadMoreMovies = async () => {
  isLoading.value = true;
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'ko-KR',
      page: currentPage.value + 1,
    },
  });
  movies.value.push(...response.data.results);
  currentPage.value += 1;
  isLoading.value = false;
};

// 스크롤 이벤트 핸들러 (무한 스크롤 시 로드 트리거)
const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target;
  showTopButton.value = scrollTop > 300;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading.value) {
    loadMoreMovies();
  }
};

// 페이지 초기화 시 첫 데이터 로드
onMounted(() => {
  loadMoviesForPage(1);
});

// 페이지네이션 함수
const prevPage = () => {
  if (currentPage.value > 1) loadMoviesForPage(currentPage.value - 1);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) loadMoviesForPage(currentPage.value + 1);
};

// Top 버튼 클릭 시 맨 위로 이동
const scrollToTop = () => {
  const container = document.querySelector('.infinite-view');
  container.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.popular-view {
  padding: 20px;
}

.view-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.view-options button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: #333;
  color: white;
}

.view-options button.active {
  background-color: #e50914;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 10px;
}

.top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
}
</style>
