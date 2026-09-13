# history-ebook — 제품·기술 명세 (SITE_SPEC)

> 대상 저장소: `https://github.com/tone7718-droid/history-ebook`  
> 배포: Vercel (GitHub 연동)  
> UI·시드 콘텐츠 언어: **한국어**  
> 저작권: 교과서·참고서 원문 **금지**. 교육용 **원작 요약**만 사용.

이 문서만으로 Cursor Cloud Agent가 Next.js(App Router) + MDX 기반 역사 공부 e-book 사이트를 스캐폴딩할 수 있어야 한다.

---

## 1. 제품 개요

한국사·세계사 학습용 **정적 콘텐츠 중심 e-book 웹앱**.  
커리큘럼 트리(시대 → 단원 → 차시)로 이동하고, MDX 본문을 읽고, 진도·검색·간단 퀴즈로 복습한다.

### 1.1 핵심 사용자 흐름

1. 홈에서 트랙(한국사 / 세계사) 선택  
2. 사이드(또는 드로어) 커리큘럼 트리에서 시대 → 단원 → 차시 선택  
3. 차시 MDX 본문 읽기 (섹션 앵커 네비)  
4. 차시 끝 퀴즈 풀기 → 결과 표시  
5. 진도(읽음/퀴즈 완료)가 localStorage에 저장되어 트리·홈에 반영  
6. 검색창으로 전체 차시 전문 검색 → 결과 클릭으로 해당 차시 이동

### 1.2 Non-goals (v1)

- 회원/서버 인증, DB, CMS 관리자 UI  
- 결제·구독  
- PDF/EPUB export  
- AI 튜터·채팅  
- 다국어(i18n) — UI는 한국어 고정

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | **Next.js 15** (App Router) | `app/` 디렉터리 |
| 언어 | TypeScript | strict |
| 콘텐츠 | **MDX** (`@next/mdx` 또는 `next-mdx-remote` + `gray-matter`) | `content/` 아래 `.mdx` |
| 스타일 | Tailwind CSS v4 (또는 v3) + CSS variables | 다크모드 `class` 전략 |
| 타이포 | `next/font` — 본문: Pretendard 또는 Noto Sans KR, 제목 동일 계열 | 가독성 우선 |
| 검색 | **FlexSearch** (클라이언트) *또는* **Pagefind** (빌드 시 인덱스) | v1은 Flexsearch 권장(의존성 단순) |
| 진도 | `localStorage` | 키 스키마는 §6 |
| 배포 | Vercel | `output` 기본(Node) 또는 static export 불필요(SSR/SSG 혼용 OK) |
| 패키지 매니저 | pnpm (또는 npm) | README에 명시 |

### 2.1 권장 의존성 (예시)

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "gray-matter": "^4",
    "next-mdx-remote": "^5",
    "flexsearch": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/typography": "^0.5",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

실제 버전은 스캐폴딩 시점의 최신 안정판을 사용한다.

---

## 3. 정보 구조 · 라우팅

### 3.1 URL

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 트랙 카드, 최근 학습, 검색 진입 |
| `/korean` | 한국사 트랙 개요 + 시대 목록 |
| `/world` | 세계사 트랙 개요 + 시대 목록 |
| `/korean/[era]/[unit]/[lesson]` | 한국사 차시 |
| `/world/[era]/[unit]/[lesson]` | 세계사 차시 |
| `/search` | 검색 결과 페이지 (`?q=`) |
| `/progress` | 진도 요약 (선택, v1에 포함 권장) |

슬래그(`era`, `unit`, `lesson`)는 **케밥케이스 ASCII** (예: `joseon-early`, `imjin-war`).  
표시 제목은 frontmatter `title` / 커리큘럼 메타의 한글명.

### 3.2 콘텐츠 루트

```
content/
  korean/     # track: korean
  world/      # track: world
  curriculum/ # 선택: 트리 메타 JSON (권장)
```

상세 스키마·네이밍은 `CONTENT_SCHEMA.md` 참고. **반드시 그 문서를 따른다.**

### 3.3 커리큘럼 트리

권장: `content/curriculum/korean.json`, `content/curriculum/world.json`

```ts
type Curriculum = {
  track: "korean" | "world";
  trackLabel: string; // "한국사" | "세계사"
  eras: {
    id: string;       // URL slug
    title: string;    // 한글 표시명
    units: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        mdxPath: string; // content 기준 상대경로, 예: "korean/joseon-early/politics/central-gov.mdx"
      }[];
    }[];
  }[];
};
```

트리 UI는 이 JSON(+ frontmatter)으로 생성. MDX만으로 트리를 추론해도 되나, **시드 예시는 curriculum JSON을 포함한다.**

---

## 4. 차시(Lesson) UX

### 4.1 본문 섹션 (고정 순서)

MDX 본문은 아래 **H2 제목을 그대로** 사용한다 (앵커·목차 생성용):

1. `## 학습목표`  
2. `## 배경`  
3. `## 핵심사건(연표)`  
4. `## 인물`  
5. `## 인과·영향`  
6. `## 헷갈리기 쉬운 포인트`  
7. `## 요약`

프론트매터·폴더 규칙은 `CONTENT_SCHEMA.md`.

### 4.2 차시 페이지 UI 구성

- 상단: 브레드크럼 `트랙 > 시대 > 단원 > 차시`
- 좌측(데스크톱): 커리큘럼 트리, 현재 차시 하이라이트; 모바일: 햄버거 → 드로어
- 우측 또는 본문 상단: **이 페이지 목차**(H2 앵커)
- 본문: `@tailwindcss/typography` (`prose prose-neutral dark:prose-invert`) + 넉넉한 line-height
- 하단: 이전/다음 차시 링크 (curriculum 순서)
- 퀴즈 패널: 본문 아래 또는 탭 — MCQ, 제출 후 정답/해설 표시
- 「읽음으로 표시」 또는 스크롤 80% 시 자동 읽음 처리 (둘 중 하나, README에 명시)

### 4.3 시드 콘텐츠 (필수)

스캐폴딩 시 **원작 요약**으로 아래 2개 차시를 반드시 포함:

| 트랙 | 예시 주제 (권장) | 경로 예시 |
|------|------------------|-----------|
| 한국사 | 조선 건국과 한양 천도 (개요) | `content/korean/joseon-early/foundation/joseon-founding.mdx` |
| 세계사 | 고대 그리스 폴리스와 아테네 민주정 (개요) | `content/world/ancient/greece/athenian-democracy.mdx` |

- 각 차시: frontmatter + 7개 H2 섹션을 **한국어**로 채움 (짧게, 교육용 원작)  
- 각 차시 퀴즈: 동일 stem의 `.quiz.json` 또는 frontmatter `quiz` (스키마는 CONTENT_SCHEMA)  
- curriculum JSON에 해당 노드 등록  
- **저작권 있는 교과서 문장 복사 금지**

---

## 5. 검색

### 5.1 FlexSearch (권장 v1)

- 빌드/런타임에 `content/**/*.mdx`를 파싱해 `{ id, track, title, era, unit, keywords, bodyText, href }` 인덱스 생성  
- API Route `GET /api/search?q=` **또는** 클라이언트에 `public/search-index.json` 로드  
- 결과: 제목·키워드·스니펫, 클릭 시 차시 URL  
- UI 카피: 플레이스홀더 `차시·키워드 검색`, 결과 없음 `검색 결과가 없습니다`

### 5.2 Pagefind 대안

정적 export/빌드 후 Pagefind 인덱스를 쓰려면 README에 빌드 스크립트만 추가하고, SITE_SPEC의 URL·UX는 동일하게 유지.

---

## 6. 진도 추적 (localStorage)

### 6.1 키

```
history-ebook:progress:v1
```

### 6.2 값 스키마

```ts
type ProgressStore = {
  version: 1;
  lessons: Record<
    string, // lessonKey = `${track}/${era}/${unit}/${lesson}`
    {
      read: boolean;
      readAt?: string; // ISO
      quizBestScore?: number; // 0–100
      quizAttempts?: number;
      lastQuizAt?: string;
    }
  >;
  lastVisited?: string; // lessonKey
};
```

### 6.3 UI 반영

- 트리: 읽음 ✓ / 퀴즈 완료 배지  
- 홈: 「이어서 학습」 → `lastVisited`  
- `/progress`: 트랙별 완료율 간단 표시

서버 동기화 없음. 브라우저별 독립.

---

## 7. 퀴즈

- 형식: 객관식(MCQ) 3–5문항 / 차시  
- 저장: **sibling** `*.quiz.json` 권장 (CONTENT_SCHEMA)  
- UI: 한 문항씩 또는 일괄 → 제출 → 점수·문항별 해설  
- 최고 점수·시도 횟수를 ProgressStore에 반영  
- 오답만 다시 풀기(선택)

---

## 8. 디자인 시스템 (간단)

- **라이트/다크**: `next-themes` 또는 자체 `class="dark"` 토글, 헤더에 버튼 (`라이트`/`다크`/`시스템`)  
- **모바일**: 375px 이상 사용 가능, 트리 드로어, 본문 16px+, 터치 타깃 44px  
- **색**: primary = 차분한 남색/먹색 계열; 강조는 과하지 않게  
- **컴포넌트**: `Header`, `CurriculumNav`, `LessonToc`, `LessonBody`, `QuizPanel`, `SearchBox`, `ThemeToggle`, `Breadcrumb`, `ProgressBadge`  
- 접근성: 시맨틱 랜드마크, 포커스 링, `prefers-reduced-motion` 존중

한국어 UI 카피 예시:

- 네비: `홈`, `한국사`, `세계사`, `검색`, `내 진도`  
- 버튼: `읽음으로 표시`, `퀴즈 시작`, `제출하기`, `다시 풀기`  
- 빈 상태: `아직 학습 기록이 없습니다`

---

## 9. 앱 디렉터리 구조 (목표)

```
history-ebook/
├── README.md
├── SITE_SPEC.md              # 본 문서 (레포에 포함)
├── CONTENT_SCHEMA.md         # 콘텐츠 스키마
├── package.json
├── next.config.ts            # MDX 설정 포함
├── tsconfig.json
├── tailwind.config.ts        # (v3일 경우) / CSS entry (v4)
├── app/
│   ├── layout.tsx            # 한글 lang="ko", 폰트, ThemeProvider
│   ├── page.tsx              # 홈
│   ├── globals.css
│   ├── korean/
│   │   ├── page.tsx
│   │   └── [era]/[unit]/[lesson]/page.tsx
│   ├── world/
│   │   ├── page.tsx
│   │   └── [era]/[unit]/[lesson]/page.tsx
│   ├── search/page.tsx
│   ├── progress/page.tsx
│   └── api/search/route.ts   # FlexSearch 사용 시
├── components/               # 위 §8 컴포넌트
├── lib/
│   ├── content.ts            # MDX 로드, curriculum, getLesson, getAdjacent
│   ├── search.ts
│   ├── progress.ts           # localStorage helpers (client)
│   └── types.ts
├── content/
│   ├── curriculum/
│   │   ├── korean.json
│   │   └── world.json
│   ├── korean/...
│   └── world/...
└── public/
    └── search-index.json     # 생성 스크립트 사용 시
```

---

## 10. MDX 로딩 규칙

1. `gray-matter`로 frontmatter 파싱 → Zod 또는 수동 검증 (`CONTENT_SCHEMA.md` 필드)  
2. 본문은 `next-mdx-remote/rsc`로 렌더 (서버 컴포넌트 권장)  
3. `generateStaticParams`로 알려진 모든 차시 SSG  
4. 존재하지 않는 슬래그 → `notFound()`  
5. 퀴즈: 같은 stem의 `.quiz.json`을 우선 로드; 없으면 frontmatter `quiz` fallback

---

## 11. README에 반드시 적을 내용

한국어로 작성:

1. **프로젝트 소개** (한 문단)  
2. **요구 환경**: Node 20+, pnpm/npm  
3. **설치·로컬 실행**
   ```bash
   pnpm install
   pnpm dev
   # http://localhost:3000
   ```
4. **콘텐츠 추가 방법**: `CONTENT_SCHEMA.md` 링크, curriculum JSON 갱신 필수  
5. **검색 인덱스**: 필요 시 `pnpm build:search` (스크립트 제공)  
6. **Vercel 배포**
   - GitHub `tone7718-droid/history-ebook` 연결  
   - Framework Preset: Next.js  
   - Build: `pnpm build` / Output: 기본  
   - 환경변수: v1 없음  
7. **저작권 고지**: 원작 교육 요약만 포함, 교과서 복제 금지  
8. **라이선스**: 코드 MIT(또는 저장소 정책), 콘텐츠는 별도 표기 가능

---

## 12. 구현 체크리스트 (Cloud Agent용)

- [ ] Next.js App Router + TS + Tailwind 프로젝트 생성  
- [ ] `lang="ko"` 루트 레이아웃, 한국어 UI  
- [ ] `content/` + curriculum JSON + 시드 한국사 1 + 세계사 1  
- [ ] 차시 페이지: 7섹션 MDX, 브레드크럼, 이전/다음  
- [ ] CurriculumNav (데스크톱 고정 / 모바일 드로어)  
- [ ] localStorage 진도  
- [ ] FlexSearch(또는 Pagefind) 검색  
- [ ] 퀴즈 UI + `.quiz.json`  
- [ ] 다크모드 + typography  
- [ ] README (설치 / 로컬 / Vercel / 저작권)  
- [ ] `SITE_SPEC.md`, `CONTENT_SCHEMA.md` 레포 루트에 유지  
- [ ] `pnpm build` 성공, 주요 경로 200

---

## 13. 품질·제약

- 시드·UI 문자열은 **한국어**  
- 교과서·시중 참고서 **문장 단위 복제 금지**  
- 추측으로 스키마를 바꾸지 말 것 — 변경 시 `CONTENT_SCHEMA.md`를 먼저 수정  
- v1에서 서버 DB/인증 추가하지 말 것
