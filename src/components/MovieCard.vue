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
      <p class="movie-overview">{{ movie.overview }}</p>
      <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
      <p><strong>평점:</strong> {{ movie.vote_average }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

// props 정의
const props = defineProps({
  movie: Object, // 부모 컴포넌트에서 전달받은 영화 데이터
});

// 선택 여부 상태 관리
const isSelected = ref(false);

// 로컬 저장소에서 초기 상태 확인
onMounted(() => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  isSelected.value = wishlist.some((item) => item.id === props.movie.id);
});

// 찜 리스트에 추가/제거 토글
const toggleWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (isSelected.value) {
    // 이미 선택된 경우, 찜 리스트에서 제거
    const updatedWishlist = wishlist.filter((item) => item.id !== props.movie.id);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  } else {
    // 선택되지 않은 경우, 찜 리스트에 추가
    wishlist.push(props.movie);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  // 상태 업데이트
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
  scroll-snap-align: start; /* 스크롤 스냅 */
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card.selected {
  border: 3px solid white; /* 선택된 카드에 흰색 테두리 추가 */
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
  font-size: 1.1rem; /* 제목 크기 증가 */
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
