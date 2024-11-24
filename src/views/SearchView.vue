<template>
  <div class="search-container">
    <HeaderComponent />
    <!-- 필터 UI -->
    <div class="filter-bar">
      <select v-model="selectedGenre" @change="applyFilters">
        <option value="">장르 (전체)</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>

      <select v-model="selectedRating" @change="applyFilters">
        <option value="">평점 (전체)</option>
        <option v-for="rating in ratings" :key="rating">{{ rating }}</option>
      </select>

      <select v-model="selectedSort" @change="applyFilters">
        <option value="">정렬 (기본)</option>
        <option value="popularity.desc">인기순</option>
        <option value="release_date.desc">최신순</option>
        <option value="vote_average.desc">평점순</option>
      </select>

      <button @click="resetFilters">초기화</button>
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

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-bar select,
.filter-bar button {
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #444;
  color: white;
  cursor: pointer;
}

.filter-bar button {
  background-color: #e50914;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  overflow-y: auto;
  height: calc(100vh - 150px);
}

.loading {
  text-align: center;
  margin-top: 20px;
}
</style>
