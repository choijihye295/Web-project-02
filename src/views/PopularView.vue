<template>
  <div class="popular-container">
    <HeaderComponent />
    <!-- View 선택 버튼 -->
    <div class="view-toggle">
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
      <button v-if="showTopButton" @click="scrollToTop" class="top-button">
        <i class="fas fa-chevron-up"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import MovieCard from '@/components/MovieCard.vue';
import HeaderComponent from "@/components/HeaderComponent.vue";

const currentView = ref('table');
const movies = ref([]);
const paginatedMovies = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);
const showTopButton = ref(false);
const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY;

const itemsPerPage = ref(20); // 페이지당 영화 개수 설정 (화면 크기 기준으로 조정 가능)

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
  if (isLoading.value) return;
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
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5 && !isLoading.value) {
    loadMoreMovies();
  }
  showTopButton.value = container.scrollTop > 300;
};

// 페이지 초기화 시 첫 데이터 로드
onMounted(() => {
  loadMoviesForPage(1);
});

// 화면이 Table 뷰로 바뀌면 페이지 로드
const setView = (view) => {
  currentView.value = view;
  if (view === 'table') {
    loadMoviesForPage(1);
    document.body.style.overflowY = 'hidden'; // 스크롤 비활성화
  } else {
    movies.value = []; // Infinite Scroll 뷰를 위한 초기화
    currentPage.value = 1;
    loadMoreMovies();
    document.body.style.overflowY = 'auto';
  }
};

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
.popular-container {
  padding: 20px;
}

.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
}

.view-toggle button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.view-toggle button.active {
  background-color: #e50914;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
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
  bottom: 100px; /* 하늘색 네모 박스에 맞춰 조정 */
  right: 60px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 1px;
  cursor: pointer;
  border-radius: 10%;
  z-index: 1000;
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 20px; /* 아이콘 크기 조정 */
}

.infinite-view {
  overflow-y: auto;
  height: calc(100vh - 150px);
}
</style>
