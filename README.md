# 역사 e-book

한국사·세계사 학습용 **정적 콘텐츠 중심 e-book** 웹앱입니다.  
커리큘럼 트리(시대 → 단원 → 차시)로 이동하고, MDX 본문을 읽으며, localStorage 진도·검색·퀴즈로 복습합니다.

UI와 본문은 **한국어**입니다. 교과서·참고서 원문 복제는 하지 않으며, 교육용 **원작 요약**만 포함합니다.

- 사이트: https://history-ebook.vercel.app
- 저장소: https://github.com/tone7718-droid/History-Ebook

## 요구 환경

- Node.js 20+
- npm (또는 pnpm)

## 설치 · 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

pnpm을 쓰는 경우:

```bash
pnpm install
pnpm dev
```

## 주요 경로

| 경로 | 설명 |
|------|------|
| `/` | 홈 |
| `/korean` | 한국사 트랙 |
| `/world` | 세계사 트랙 |
| `/korean/[era]/[unit]/[lesson]` | 한국사 차시 |
| `/world/[era]/[unit]/[lesson]` | 세계사 차시 |
| `/search?q=` | 검색 |
| `/progress` | 내 진도 |

예시:

- `/korean/goryeo/politics/goryeo-politics-overview`
- `/world/west-asia/islam/islam-formation`

## 콘텐츠 추가 방법

1. `CONTENT_SCHEMA.md`의 frontmatter·폴더·퀴즈 규칙을 따릅니다.
2. `content/<track>/<era>/<unit>/<lesson>.mdx`와 sibling `.quiz.json`을 추가합니다.
3. `content/curriculum/korean.json` 또는 `world.json`에 노드를 등록합니다.
4. `draft: false`로 두면 목록·SSG에 포함됩니다.
5. `npm run validate:content`로 경로·H2·퀴즈 정합을 확인합니다.

자세한 스키마: [`CONTENT_SCHEMA.md`](./CONTENT_SCHEMA.md)  
제품·기술 명세: [`SITE_SPEC.md`](./SITE_SPEC.md)

## 검색 인덱스

검색은 런타임에 MDX를 파싱하는 FlexSearch(+ 단순 문자열 매칭)를 사용합니다.  
선택적으로 정적 인덱스를 만들 수 있습니다.

```bash
npm run build:search
# → public/search-index.json
```

API: `GET /api/search?q=`

## 진도 저장

- 키: `history-ebook:progress:v1`
- 본문이 충분히 길 때 스크롤 80%, 또는 「읽음으로 표시」로 읽음 처리
- 퀴즈 제출 시 최고 점수·시도 횟수 반영
- 서버 동기화 없음 (브라우저별 독립)

## 다크 모드

헤더의 테마 버튼으로 `라이트` / `다크` / `시스템`을 순환합니다 (`next-themes`, `class` 전략).

## Vercel 배포

1. GitHub 저장소 연결 (`tone7718-droid/History-Ebook`)
2. Framework Preset: **Next.js**
3. Build Command: `npm run build`
4. Output: 기본
5. 환경변수: v1 없음

## 저작권 고지

- 본문·퀴즈는 교육용 **원작 요약**입니다.
- 시중 교과서·참고서의 **문장 단위 복제를 금지**합니다.

## 라이선스

- 코드: [MIT](./LICENSE)
- 콘텐츠: 교육용 원작 요약 (별도 표기 가능)

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |
| `npm run validate:content` | 커리큘럼·MDX·퀴즈 정합 검사 |
| `npm run build:search` | 검색 인덱스 JSON 생성 |
