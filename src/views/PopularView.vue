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
      <button v-if="showTopButton" @click="scrollToTop" class="top-button">Top</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const calculateItemsPerPage = () => {
  const containerWidth = document.body.clientWidth;
  return Math.floor(containerWidth / 200) * 3;
};

const itemsPerPage = ref(calculateItemsPerPage());

const loadMoviesForPage = async (page) => {
  isLoading.value = true;
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'ko-KR',
      page,
    },
  });
  paginatedMovies.value = response.data.results.slice(0, itemsPerPage.value);
  totalPages.value = Math.ceil(response.data.total_results / itemsPerPage.value);
  currentPage.value = page;
  isLoading.value = false;
};

const loadMoreMovies = async () => {
  if (isLoading.value) return; // 이미 로딩 중인 경우 중복 호출 방지
  isLoading.value = true;
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'ko-KR',
      page: currentPage.value + 1,
    },
  });
  movies.value.push(...response.data.results); // 기존 영화 목록에 추가
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
  if (currentView.value === 'table') {
    loadMoviesForPage(1);
  } else {
    loadMoreMovies(); // 무한 스크롤 뷰 초기 로드
  }
  window.addEventListener('resize', () => {
    itemsPerPage.value = calculateItemsPerPage();
  });
});

const prevPage = () => {
  if (currentPage.value > 1) loadMoviesForPage(currentPage.value - 1);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) loadMoviesForPage(currentPage.value + 1);
};

const scrollToTop = () => {
  const container = document.querySelector('.infinite-view');
  container.scrollTo({ top: 0, behavior: 'smooth' });
};

const setView = (view) => {
  currentView.value = view;
  if (view === 'table') {
    loadMoviesForPage(1);
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = 'auto';
    loadMoreMovies(); // 무한 스크롤 뷰 선택 시 초기 데이터 로드
  }
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
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
}

.table-view {
  overflow: hidden;
}

.infinite-view {
  overflow-y: auto;
}
</style>
