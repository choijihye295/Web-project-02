<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <font-awesome-icon icon="ticket-alt" class="icon" />
        </router-link>
      </div>
      <nav class="nav-links">
        <router-link to="/">홈</router-link>
        <router-link to="/popular">대세 콘텐츠</router-link>
        <router-link to="/search">찾아보기</router-link>
        <router-link to="/wishlist">내가 찜한 리스트</router-link>
      </nav>
      <div class="search-icon">
        <font-awesome-icon icon="search" @click="toggleSearch" />
      </div>
      <div v-if="isSearchOpen" class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="영화 제목 검색"
            @keyup.enter="performSearch"
        />
        <button @click="performSearch">검색</button>
      </div>
      <div class="user-icon" @click="toggleDropdown">
        <font-awesome-icon icon="user" />
      </div>
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <p>{{ userId }}</p>
        <button @click="logout">로그아웃</button>
      </div>
    </div>
  </header>
</template>



<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

// 로컬 스토리지에서 사용자 ID 가져오기

const router = useRouter();
const userId = ref(localStorage.getItem("registeredEmail") || "Guest");
const isDropdownOpen = ref(false);
const isScrolled = ref(false);
const isSearchOpen = ref(false); // 검색창 상태
const searchQuery = ref(""); // 검색어

// 로그아웃 기능
const logout = () => {
  localStorage.removeItem("registeredEmail");
  userId.value = "Guest";
  isDropdownOpen.value = false;
};

// 검색창 토글
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (!isSearchOpen.value) searchQuery.value = "";
};

// 드롭다운 메뉴 토글
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};


// 검색 수행
const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: "SearchView", query: { q: searchQuery.value.trim() } });
    searchQuery.value = "";
    isSearchOpen.value = false;
  }
};

// 검색어 저장
const saveSearch = () => {
  if (searchQuery.value.trim()) {
    const previousSearches = JSON.parse(localStorage.getItem("searchQueries") || "[]");
    previousSearches.push(searchQuery.value.trim());
    localStorage.setItem("searchQueries", JSON.stringify(previousSearches));
    alert(`"${searchQuery.value.trim()}" 검색어가 저장되었습니다.`);
    searchQuery.value = ""; // 검색창 초기화
  }
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 10px 0;
  background-color: rgba(26, 26, 26, 0.85);
  color: white;
  z-index: 1000;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.scrolled {
  background-color: rgba(26, 26, 26, 0.5);
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.nav-links a {
  text-decoration: none;
  color: white;
  padding: 0 10px;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #e50914;
}

.logo .icon {
  color: #E50914;
  font-size: 1.8rem;
}

.user-icon {
  color: white;
  cursor: pointer;
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #333;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  color: white;
  min-width: 100px;
  text-align: center;
}

.dropdown-menu p {
  margin: 0;
  font-weight: bold;
}

.dropdown-menu button {
  background-color: #e50914;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  width: 100%;
  border-radius: 3px;
}

.dropdown-menu button:hover {
  background-color: #d40813;
}

.search-icon {
  color: white;
  cursor: pointer;
  margin-right: 20px;
}

.search-bar {
  position: absolute;
  top: 100%;
  right: 50px;
  display: flex;
  align-items: center;
  background-color: #333;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.search-bar input {
  width: 200px;
  padding: 5px;
  border: none;
  border-radius: 3px;
  margin-right: 10px;
}

.search-bar button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}

.search-bar button:hover {
  background-color: #d40813;
}

</style>
