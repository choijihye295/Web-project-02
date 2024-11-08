<template>
  <div class="movie-card" ref="card">
    <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Movie Poster" class="movie-poster" />
    <div class="movie-info">
      <h3 class="movie-title-wrapper">
        <span
            class="movie-title"
            ref="title"
            :class="{ 'scrollable': isTitleOverflow }"
        >
          {{ movie.title }}
        </span>
      </h3>
      <p>{{ movie.overview.slice(0, 50) }}...</p>
      <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
      <p><strong>평점:</strong> {{ movie.vote_average }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  movie: Object
})

const isTitleOverflow = ref(false)
const card = ref(null)
const title = ref(null)

// 약간의 여유를 추가하여 스크롤 조건을 설정
const checkTitleOverflow = () => {
  if (title.value && card.value) {
    const titleWidth = title.value.scrollWidth
    const cardWidth = card.value.clientWidth
    // 카드 너비보다 제목 너비가 10px 이상 클 경우에만 스크롤 애니메이션 적용
    isTitleOverflow.value = titleWidth > cardWidth + 10
  }
}

onMounted(async () => {
  await nextTick() // DOM 업데이트 후 너비를 계산할 수 있도록 nextTick 사용
  checkTitleOverflow()
  window.addEventListener('resize', checkTitleOverflow) // 창 크기 변경 시 다시 계산
})
</script>

<style scoped>
.movie-card {
  min-width: 200px;
  max-width: 220px;
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: auto;
}

.movie-info {
  padding: 10px;
  color: #eee;
}

.movie-title-wrapper {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.movie-title {
  display: inline-block;
  white-space: nowrap;
  transition: transform 5s linear;
}

.movie-title.scrollable:hover {
  animation: scrollTitle 5s linear infinite;
}

@keyframes scrollTitle {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% + 220px)); /* 카드 너비보다 긴 경우에 왼쪽으로 이동 */
  }
}

.movie-info p {
  font-size: 0.85rem;
  color: #bbb;
}
</style>
