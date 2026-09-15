# history-ebook — 현재 제품 명세

- 사이트: https://history-ebook.vercel.app
- 저장소: https://github.com/tone7718-droid/History-Ebook
- UI·본문: 한국어
- 저작권: 교과서·참고서 원문 금지. 교육용 원작 요약만 사용.

## 1. 제품

한국사·세계사 학습용 정적 콘텐츠 e-book.
시대·지역 → 단원 → 차시로 읽고, 퀴즈로 복습하고, 이 브라우저에 진도를 남긴다.

공개 차시: 한국사 55, 세계사 70. 정식 경로는 `content/curriculum/*.json`이 원천이다.

### 하지 않는 것 (v1)

- 회원/서버 DB/CMS
- 결제·구독
- PDF/EPUB 내보내기
- AI 튜터
- 다국어 UI

## 2. 기술

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 15 App Router |
| 언어 | TypeScript |
| 콘텐츠 | MDX (`next-mdx-remote` + `gray-matter`) |
| 스타일 | Tailwind CSS v4 + `@tailwindcss/typography` |
| 폰트 | `next/font` Noto Sans KR |
| 검색 | FlexSearch, 런타임 MDX 파싱 |
| 진도 | `localStorage` 키 `history-ebook:progress:v1` |
| 배포 | Vercel |

## 3. 라우팅

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 트랙 카드, 이어서 학습, 시대 목차 |
| `/korean` | 한국사 시대·단원·차시 목차 (`#era-{id}` 앵커) |
| `/world` | 세계사 목차 |
| `/korean/[era]/[unit]/[lesson]` | 한국사 차시 |
| `/world/[era]/[unit]/[lesson]` | 세계사 차시 |
| `/search?q=` | 검색 |
| `/review` | 오답 노트 |
| `/glossary` | 용어 사전 |
| `/progress` | 진도 요약·기록 삭제 |
| `/korean/[era]/[unit]/review` | 한국사 단원 복습 퀴즈 |
| `/world/[era]/[unit]/review` | 세계사 단원 복습 퀴즈 |

올드 슬러그는 `next.config.ts`에서 공식 경로로 301 리다이렉트한다.

## 4. 차시 UX

본문 H2 고정 순서:

1. `## 학습목표`
2. `## 배경`
3. `## 핵심사건(연표)`
4. `## 인물`
5. `## 인과·영향`
6. `## 헷갈리기 쉬운 포인트`
7. `## 요약`

페이지 구성:

- 브레드크럼: 홈 > 트랙 > 시대 > 단원 > 차시
- 데스크톱 좌측 커리큘럼, 모바일 드로어
- 본문 상단 목차, 관련 차시(한국사↔세계사), 퀴즈, 이전/다음 차시
- 본문이 길 때 스크롤 80% 또는 「읽음으로 표시」

관련 차시는 `lib/related.ts`의 쌍 목록으로 연결한다. 커리큘럼 125편은 유지하고 교차 링크만 추가한다.

스키마·폴더 규칙은 `CONTENT_SCHEMA.md`.

## 5. 검색

빌드 시 만든 검색 인덱스와 FlexSearch + 문자열 매칭을 사용한다.
선택: `npm run build:search` → `public/search-index.json`.
API: `GET /api/search?q=`.

## 6. 진도

```ts
type ProgressStore = {
  version: 1;
  lessons: Record<string, {
    read: boolean;
    readAt?: string;
    quizBestScore?: number;
    quizAttempts?: number;
    lastQuizAt?: string;
  }>;
  lastVisited?: string;
};
```

- 트리: 읽음/퀴즈 배지
- 홈: 이어서 학습
- `/progress`: 트랙별 완료율, 기록 삭제
- 서버 동기화 없음

## 7. 퀴즈

- 차시당 3–6문항 MCQ, sibling `*.quiz.json`
- 제출 후 점수·해설, 오답만 다시 풀기
- 화면에서 선택지 순서를 섞어 보여, JSON의 정답 문자가 항상 첫 번째가 되지 않게 한다
- 정답 위치를 분산하고, 개정하는 선택지는 같은 시대·인접 개념을 우선한다
- 틀린 문항은 `localStorage` 오답 노트(`/review`)에 모인다
- 단원 페이지에서 해당 단원 차시 문항을 모아 복습한다
- 차시 본문 아래 핵심 용어 상자, 전체 목록은 `/glossary`

## 8. 품질 검사

```bash
npm run validate:content
```

커리큘럼 경로, 7개 H2, 퀴즈 정합을 확인한다. GitHub Actions `ci` 워크플로에서 콘텐츠 검사, ESLint, 회귀 테스트, 프로덕션 빌드를 모두 실행한다.
