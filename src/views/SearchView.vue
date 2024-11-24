<template>
  <div class="search-container">
    <HeaderComponent />
    <!-- 필터 UI -->
    <div class="filter-container">
      <div class="filter-bar">
        <select v-model="selectedGenre" @change="applyFilters">
          <option value="">장르 (전체)</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
        <select v-model="selectedRating" @change="applyFilters">
          <option value="">평점 (전체)</option>
          <option value="9-10">9-10</option>
          <option value="8-9">8-9</option>
          <option value="7-8">7-8</option>
          <option value="6-7">6-7</option>
          <option value="5-6">5-6</option>
          <option value="4-5">4-5</option>
          <option value="0-4">4점 이하</option>
        </select>
        <select v-model="selectedSort" @change="applyFilters">
          <option value="">정렬 (기본)</option>
          <option value="popularity.desc">인기순</option>
          <option value="release_date.desc">최신순</option>
          <option value="vote_average.desc">평점순</option>
        </select>
        <button @click="resetFilters" class="reset-button">초기화</button>
      </div>
    </div>


    <!-- 영화 리스트 -->
    <div class="movie-list" @scroll="handleScroll">
      <div v-for="movie in filteredMovies" :key="movie.id" class="movie-card">
        <MovieCard :movie="movie" />
      </div>
      <div v-if="isLoading" class="loading">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import HeaderComponent from '@/components/HeaderComponent.vue';
import MovieCard from '@/components/MovieCard.vue';

const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY;
const movies = ref([]);
const filteredMovies = ref([]);
const genres = ref([]);
const isLoading = ref(false);
const page = ref(1);

// 필터 옵션
const selectedGenre = ref('');
const selectedRating = ref('');
const selectedSort = ref('');

const ratings = ['9-10', '8-9', '7-8', '6-7', '5-6', '4-5', '4점 이하'];

const fetchGenres = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
    params: { api_key: TMDB_API_KEY, language: 'ko-KR' },
  });
  genres.value = response.data.genres;
};

const fetchMovies = async () => {
  isLoading.value = true;
  const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'ko-KR',
      page: page.value,
      sort_by: selectedSort.value || 'popularity.desc',
      with_genres: selectedGenre.value || '',
    },
  });
  movies.value.push(...response.data.results);
  filteredMovies.value = movies.value;
  isLoading.value = false;
};

const applyFilters = () => {
  filteredMovies.value = movies.value.filter((movie) => {
    const meetsGenre =
        !selectedGenre.value || movie.genre_ids.includes(Number(selectedGenre.value));
    const meetsRating =
        !selectedRating.value ||
        (selectedRating.value === '9-10' && movie.vote_average >= 9) ||
        (selectedRating.value === '8-9' && movie.vote_average >= 8 && movie.vote_average < 9) ||
        (selectedRating.value === '7-8' && movie.vote_average >= 7 && movie.vote_average < 8) ||
        (selectedRating.value === '6-7' && movie.vote_average >= 6 && movie.vote_average < 7) ||
        (selectedRating.value === '5-6' && movie.vote_average >= 5 && movie.vote_average < 6) ||
        (selectedRating.value === '4-5' && movie.vote_average >= 4 && movie.vote_average < 5) ||
        (selectedRating.value === '4점 이하' && movie.vote_average < 4);

    return meetsGenre && meetsRating;
  });
};

const resetFilters = () => {
  selectedGenre.value = '';
  selectedRating.value = '';
  selectedSort.value = '';
  filteredMovies.value = movies.value;
};

const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading.value) {
    page.value += 1;
    fetchMovies();
  }
};

onMounted(async () => {
  await fetchGenres();
  await fetchMovies();
});
</script>

<style scoped>
.search-container {
  padding: 20px;
  color: white;
}

/* 드롭다운 메뉴 스타일 조정 */
.filter-bar {
  position: relative;
  z-index: 1010; /* 헤더보다 높은 z-index 설정 */
  margin-top: 20px; /* 헤더와 약간의 간격 추가 */
}

.filter-bar select {
  position: relative;
  z-index: 1020; /* 드롭다운 선택 요소를 헤더보다 위에 배치 */
  background-color: #444;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  appearance: none; /* 기본 드롭다운 화살표 제거 */
}

.filter-bar select:focus {
  outline: none;
  border: 1px solid #e50914; /* 선택된 상태 강조 */
}

.filter-bar button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  overflow-y: auto;
  height: calc(100vh - 200px); /* 필터와 컨텐츠의 여백 고려 */
}

.loading {
  text-align: center;
  margin-top: 20px;
}

/* 헤더의 z-index 값 설정 */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 헤더의 z-index를 드롭다운보다 낮게 설정 */
  background-color: rgba(0, 0, 0, 0.8);
}

</style>
