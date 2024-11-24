# 프로젝트 이름: Vue Movie Finder
영화 검색 및 찜 기능을 제공하는 Vue 기반 웹 애플리케이션입니다. 사용자는 TMDb API를 활용하여 인기 영화 및 검색 결과를 확인할 수 있으며, 찜한 영화 리스트를 관리할 수 있습니다.

---
## 프로젝트 기본 정보

- **프로젝트 이름**: Vue Movie Finder
- **주요 기능**:
    - TMDb API를 활용한 영화 목록 조회 및 검색
    - 찜한 영화 리스트 관리 (로컬 스토리지 기반)
    - 사용자별 찜 목록 저장
    - 무한 스크롤 및 테이블 뷰 선택 가능
- **배포 상태**: 배포된 URL 또는 `로컬 환경에서 실행`

---
## 기술 스택

- **프론트엔드**: Vue.js 3
- **스타일링**: CSS, SCSS
- **아이콘**: FontAwesome
- **상태 관리**: Vue Composition API
- **HTTP 통신**: Axios
- **API**: TMDb API
- **로컬 데이터**: Local Storage

---
## 설치 및 실행 가이드

### 의존성 설치
```
npm install
```
### 환경 변수 설정
TMDb API 키를 활용하기 위해 .env 파일을 생성하고 아래 내용을 추가합니다:
```bash
VUE_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

### 개발 서버 실행
```
npm run serve
```
개발 서버는 기본적으로 http://localhost:8080에서 실행됩니다.

### 프로덕션 빌드
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---
## 프로젝트 구조
```bash
vue-movie-finder/
│
├── public/                      # 정적 파일
│   ├── favicon.ico              # 파비콘
│   └── index.html               # HTML 템플릿
│
├── src/
│   ├── assets/                  # 이미지 및 스타일
│   ├── components/              # Vue 컴포넌트
│   │   ├── HeaderComponent.vue  # 헤더 컴포넌트
│   │   ├── MovieCard.vue        # 영화 카드 컴포넌트
│   │   └── HelloWorld.vue       # 기존 HelloWorld.vue 컴포넌트
│   │
│   ├── views/                   # 뷰 컴포넌트
│   │   ├── HomeView.vue         # 홈 페이지
│   │   ├── PopularView.vue      # 인기 영화 페이지
│   │   ├── WishlistView.vue     # 찜한 영화 리스트
│   │   ├── SignIn.vue           # 로그인 페이지 
│   │   └── SearchView.vue       # 탐색 페이지
│   │
│   ├── router/                  # Vue Router 설정
│   │   └── index.ts             # 라우터 정의

│   ├── store/                   
│   │   └── index.ts             
│   │
│   ├── types/                   
│   │   └── movie.ts             # 영화 클래스
│   │
│   ├── utils/                   # 유틸리티 함수
│   │   └── WishlistManager.ts   # 찜 리스트 관리 클래스
│   │
│   ├── App.vue                  # 루트 Vue 컴포넌트
│   └── main.ts                  # 진입점 파일
│
├── .env                         # 환경 변수
├── package.json                 # 프로젝트 의존성 및 스크립트
└── README.md                    # 프로젝트 설명 문서

```

---

## 주요 기능 설명

### 영화 목록 보기:

TMDb API를 통해 인기 영화 정보를 가져와 홈 화면에 표시합니다.

### 찜 기능:

각 영화 카드를 클릭하여 찜 리스트에 추가/제거할 수 있습니다.
찜 리스트는 사용자별로 로컬 스토리지에 저장됩니다.

### 뷰 전환:

무한 스크롤(Infinite Scroll) 및 테이블 뷰(Table View) 중 원하는 방식으로 영화 목록을 탐색할 수 있습니다.

---

## 문의
문의사항: 이메일 주소(choijihye295@jbnu.ac.kr) 또는 GitHub Issues를 통해 문의해 주세요.

---
## 추가사항) Font Awesome 설치 및 `Top` 버튼 아이콘 설정

### 1. Font Awesome 설치
프로젝트에 Font Awesome을 설치하여 아이콘을 사용할 수 있습니다. 아래 명령어를 사용하여 Font Awesome을 설치하세요.

```bash
npm install @fortawesome/fontawesome-free
```
설치 후, main.js 파일에서 Font Awesome CSS를 추가합니다:
```bash
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
```

### 2. Top 버튼 아이콘 설정
Top 버튼에 Chevron-Up 아이콘을 적용하려면, 다음 단계를 따라 설정하세요.

(1) Top 버튼에 Font Awesome 아이콘 적용:
Top 버튼 컴포넌트 코드에서 Font Awesome 아이콘을 추가합니다:
```bash
<button @click="scrollToTop" class="top-button">
  <i class="fas fa-chevron-up"></i>
</button>
```

(2) 스타일링 설정:
CSS에서 버튼 스타일을 설정하여 페이지 상단으로 부드럽게 이동할 수 있도록 합니다.
```bash
.top-button {
  position: fixed;
  bottom: 100px;
  right: 60px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 1000;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  transition: transform 0.3s;
}

.top-button:hover {
  transform: scale(1.1);
}
```

(3) 버튼 기능 구현:
버튼을 클릭하면 페이지 상단으로 스크롤됩니다. 아래와 같이 JavaScript 이벤트 핸들러를 작성하세요.
```bash
const scrollToTop = () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
};
```
### Font Awesome 활용 예시
적용 가능한 주요 아이콘
Font Awesome에서 사용할 수 있는 여러 아이콘이 있습니다. 아래는 프로젝트에서 사용한 아이콘의 예시입니다:

fas fa-chevron-up: 상단 이동 아이콘 (Top 버튼)
fas fa-search: 검색 아이콘
fas fa-user: 사용자 아이콘
더 많은 아이콘은 Font Awesome 아이콘 라이브러리에서 확인할 수 있습니다.

---

즐거운 영화 탐색 되세요! 🎥