# history-ebook — 콘텐츠 스키마 (CONTENT_SCHEMA)

이 문서는 MDX frontmatter, 폴더 레이아웃, 파일 네이밍, 퀴즈 JSON 스키마의 **유일한 기준**이다.  
구현·시드 작성 시 이 스키마를 벗어나지 않는다. UI 카피·시드 본문은 **한국어**.

관련 문서: `SITE_SPEC.md`

---

## 1. 폴더 레이아웃

```
content/
├── curriculum/
│   ├── korean.json          # 한국사 트리 메타 (필수)
│   └── world.json           # 세계사 트리 메타 (필수)
├── korean/
│   └── <era>/
│       └── <unit>/
│           ├── <lesson>.mdx
│           └── <lesson>.quiz.json    # 권장 (sibling)
└── world/
    └── <era>/
        └── <unit>/
            ├── <lesson>.mdx
            └── <lesson>.quiz.json
```

### 규칙

| 항목 | 규칙 |
|------|------|
| 트랙 폴더 | `korean` \| `world` 만 허용 (영문 소문자) |
| `<era>`, `<unit>`, `<lesson>` | **케밥케이스 ASCII** `[a-z0-9]+(-[a-z0-9]+)*` |
| MDX 확장자 | `.mdx` 만 |
| 퀴즈 파일 | 같은 stem: `foo.mdx` ↔ `foo.quiz.json` |
| 깊이 | 항상 `content/<track>/<era>/<unit>/<lesson>.mdx` (3단계 고정) |
| 한글 경로 | **금지** (표시명은 frontmatter / curriculum JSON) |

### URL 매핑

```
content/korean/<era>/<unit>/<lesson>.mdx
  → /korean/<era>/<unit>/<lesson>

content/world/<era>/<unit>/<lesson>.mdx
  → /world/<era>/<unit>/<lesson>
```

`lessonKey` (진도·검색 ID):

```
<track>/<era>/<unit>/<lesson>
예: korean/joseon-early/foundation/joseon-founding
```

---

## 2. Curriculum JSON 스키마

파일: `content/curriculum/korean.json`, `content/curriculum/world.json`

### TypeScript

```ts
export type TrackId = "korean" | "world";

export interface CurriculumLessonRef {
  /** URL·파일 stem과 동일 */
  id: string;
  /** 사이드바·목록용 한글 제목 */
  title: string;
  /**
   * content/ 기준 상대 경로 (.mdx 포함)
   * 예: "korean/joseon-early/foundation/joseon-founding.mdx"
   */
  mdxPath: string;
  /** 선택: 사이드바 정렬용 0-based; 없으면 배열 순서 */
  order?: number;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  lessons: CurriculumLessonRef[];
}

export interface CurriculumEra {
  id: string;
  title: string;
  /** 짧은 한글 설명 (트랙 개요 페이지용) */
  description?: string;
  units: CurriculumUnit[];
}

export interface CurriculumFile {
  track: TrackId;
  trackLabel: string; // "한국사" | "세계사"
  eras: CurriculumEra[];
}
```

### 제약

- `track` 값과 파일명·`mdxPath` 첫 세그먼트가 일치해야 한다.  
- `eras[].id` / `units[].id` / `lessons[].id`는 해당 경로 세그먼트와 **완전 일치**.  
- `mdxPath`가 가리키는 파일이 반드시 존재.  
- `lessons[].title`과 MDX `title`은 가능하면 동일(불일치 시 MDX `title`을 차시 페이지 H1에 사용, 트리는 curriculum `title`).

### 최소 예시 (`korean.json` 발췌)

```json
{
  "track": "korean",
  "trackLabel": "한국사",
  "eras": [
    {
      "id": "joseon-early",
      "title": "조선 전기",
      "description": "조선 건국부터 사림 정치 이전까지의 개요",
      "units": [
        {
          "id": "foundation",
          "title": "건국과 통치 체제",
          "lessons": [
            {
              "id": "joseon-founding",
              "title": "조선 건국과 한양 천도",
              "mdxPath": "korean/joseon-early/foundation/joseon-founding.mdx"
            }
          ]
        }
      ]
    }
  ]
}
```

### 최소 예시 (`world.json` 발췌)

```json
{
  "track": "world",
  "trackLabel": "세계사",
  "eras": [
    {
      "id": "ancient",
      "title": "고대",
      "description": "고대 문명과 지중해 세계 개요",
      "units": [
        {
          "id": "greece",
          "title": "고대 그리스",
          "lessons": [
            {
              "id": "athenian-democracy",
              "title": "폴리스와 아테네 민주정",
              "mdxPath": "world/ancient/greece/athenian-democracy.mdx"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 3. MDX Frontmatter 스키마

YAML frontmatter. 모든 필드는 아래를 따른다.

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | `string` | ✅ | 차시 한글 제목 (페이지 H1) |
| `track` | `"korean" \| "world"` | ✅ | 트랙; 폴더와 일치 |
| `era` | `string` | ✅ | 시대 slug; 경로 `<era>`와 일치 |
| `unit` | `string` | ✅ | 단원 slug; 경로 `<unit>`와 일치 |
| `keywords` | `string[]` | ✅ | 검색·태그용 한글/고유명사, 3–12개 권장 |
| `difficulty` | `1 \| 2 \| 3` | ✅ | 1=기초, 2=표준, 3=심화 |
| `description` | `string` | 권장 | SEO·카드용 1–2문장 한글 요약 |
| `order` | `number` | 선택 | 단원 내 정렬 (curriculum과 중복 시 curriculum 우선) |
| `draft` | `boolean` | 선택 | `true`면 프로덕션 목록·SSG에서 제외 (기본 `false`) |
| `quiz` | `Quiz` | 선택 | sibling JSON 없을 때만 사용 (아래 §5와 동일 shape) |

### TypeScript

```ts
export type Difficulty = 1 | 2 | 3;

export interface LessonFrontmatter {
  title: string;
  track: "korean" | "world";
  era: string;
  unit: string;
  keywords: string[];
  difficulty: Difficulty;
  description?: string;
  order?: number;
  draft?: boolean;
  quiz?: Quiz; // CONTENT_SCHEMA §5
}
```

### 검증 규칙 (로더에서 강제)

1. `track` ∈ {`korean`, `world`}  
2. `difficulty` ∈ {1, 2, 3}  
3. `keywords.length` ≥ 1  
4. 파일 경로의 track/era/unit/lesson stem과 frontmatter `track`/`era`/`unit` 일치  
5. `title`·`keywords`·`description`은 비어 있지 않은 문자열  
6. 알 수 없는 top-level 키는 경고만 (빌드 실패시키지 않아도 됨)

### 예시 frontmatter (한국사 시드)

```yaml
---
title: 조선 건국과 한양 천도
track: korean
era: joseon-early
unit: foundation
keywords:
  - 조선
  - 이성계
  - 한양
  - 정도전
  - 위화도 회군
difficulty: 1
description: 고려 말 정치 변동 속에서 조선이 건국되고 한양으로 도읍을 옮긴 과정을 정리한다.
---
```

### 예시 frontmatter (세계사 시드)

```yaml
---
title: 폴리스와 아테네 민주정
track: world
era: ancient
unit: greece
keywords:
  - 폴리스
  - 아테네
  - 민주정
  - 솔론
  - 클레이스테네스
difficulty: 1
description: 고대 그리스 폴리스의 특징과 아테네에서 민주정이 형성되는 흐름을 개관한다.
---
```

---

## 4. MDX 본문 섹션 규약

Frontmatter 다음 본문은 **아래 H2를 이 순서·이 문자열 그대로** 포함해야 한다.

```md
## 학습목표
## 배경
## 핵심사건(연표)
## 인물
## 인과·영향
## 헷갈리기 쉬운 포인트
## 요약
```

### 작성 가이드

| 섹션 | 내용 |
|------|------|
| 학습목표 | 불릿 3–5개, 동사로 시작 (`설명하다`, `구분하다` 등) |
| 배경 | 시대·지역 맥락 1–3 짧은 문단 |
| 핵심사건(연표) | 연표는 리스트 또는 표: `- **YYYY** — 사건` 형식 권장 |
| 인물 | 인물명 + 역할 2–4명 |
| 인과·영향 | 원인 → 결과 → 이후 영향 |
| 헷갈리기 쉬운 포인트 | 오개념 교정 2–4개 |
| 요약 | 3–6문장 또는 불릿 |

추가 H2는 가능하나, 목차·앵커는 위 7개를 우선한다.  
H1은 MDX에 쓰지 않는다 — 페이지가 `title`로 H1을 렌더한다.

### 시드 본문 골격 예시 (내용만 채우면 됨)

```mdx
---
title: 조선 건국과 한양 천도
track: korean
era: joseon-early
unit: foundation
keywords: [조선, 이성계, 한양, 정도전, 위화도 회군]
difficulty: 1
description: 고려 말 정치 변동 속에서 조선이 건국되고 한양으로 도읍을 옮긴 과정을 정리한다.
---

## 학습목표

- 고려 말 정치·군사 상황이 조선 건국으로 이어진 흐름을 설명할 수 있다.
- 한양 천도의 이유와 의미를 말할 수 있다.
- 건국 초기 제도 정비의 방향을 개관할 수 있다.

## 배경

(원작 교육용 요약 — 교과서 문장 복제 금지)

## 핵심사건(연표)

- **1388** — 위화도 회군을 계기로 정치 주도권이 재편된다.
- **1392** — 새 왕조가 들어서고 국호·왕실이 정리된다.
- **1394** — 도읍을 한양으로 옮기는 결정이 실행된다.

## 인물

- **이성계** — 군사·정치 실력을 바탕으로 새 왕조의 중심이 된다.
- **정도전** — 유교적 통치 이념과 제도 구상에 관여한다.

## 인과·영향

(원인 → 건국 → 천도·제도화의 영향)

## 헷갈리기 쉬운 포인트

- 천도 이유와 건국 시점을 혼동하지 않는다.
- 국호·도읍·제도 정비는 단계적으로 이루어졌음을 구분한다.

## 요약

(핵심만 짧게)
```

세계사 시드도 동일 7개 H2 구조를 사용한다.

---

## 5. 퀴즈 JSON 스키마

### 파일 위치

```
content/<track>/<era>/<unit>/<lesson>.quiz.json
```

로더 우선순위:

1. sibling `.quiz.json` 존재 → 사용  
2. 없으면 frontmatter `quiz`  
3. 둘 다 없으면 해당 차시는 퀴즈 UI 숨김

### TypeScript

```ts
export interface QuizChoice {
  /** 안정적 ID: "a" | "b" | "c" | "d" 권장 */
  id: string;
  /** 보기 텍스트 (한국어) */
  text: string;
}

export interface QuizQuestion {
  id: string; // 예: "q1"
  prompt: string; // 문항 (한국어)
  choices: QuizChoice[]; // 3–5개
  /** choices[].id 중 하나 */
  answer: string;
  explanation?: string; // 제출 후 해설 (한국어)
}

export interface Quiz {
  /** lessonKey와 맞추면 좋음; 선택 */
  lessonId?: string;
  version?: number; // 기본 1
  questions: QuizQuestion[]; // 3–5문항 권장
}
```

### JSON Schema (참고용)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["questions"],
  "properties": {
    "lessonId": { "type": "string" },
    "version": { "type": "integer", "minimum": 1 },
    "questions": {
      "type": "array",
      "minItems": 1,
      "maxItems": 10,
      "items": {
        "type": "object",
        "required": ["id", "prompt", "choices", "answer"],
        "properties": {
          "id": { "type": "string", "minLength": 1 },
          "prompt": { "type": "string", "minLength": 1 },
          "choices": {
            "type": "array",
            "minItems": 2,
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["id", "text"],
              "properties": {
                "id": { "type": "string" },
                "text": { "type": "string" }
              }
            }
          },
          "answer": { "type": "string" },
          "explanation": { "type": "string" }
        }
      }
    }
  }
}
```

### 예시: `joseon-founding.quiz.json`

```json
{
  "lessonId": "korean/joseon-early/foundation/joseon-founding",
  "version": 1,
  "questions": [
    {
      "id": "q1",
      "prompt": "위화도 회군이 일어난 시기로 가장 알맞은 것은?",
      "choices": [
        { "id": "a", "text": "고려 말" },
        { "id": "b", "text": "조선 후기" },
        { "id": "c", "text": "삼국시대" },
        { "id": "d", "text": "일제강점기" }
      ],
      "answer": "a",
      "explanation": "위화도 회군은 고려 말 정치·군사 재편의 전환점으로 이해한다."
    },
    {
      "id": "q2",
      "prompt": "조선 초기 도읍으로 선택된 곳은?",
      "choices": [
        { "id": "a", "text": "경주" },
        { "id": "b", "text": "한양" },
        { "id": "c", "text": "평양" },
        { "id": "d", "text": "개경만 유지" }
      ],
      "answer": "b",
      "explanation": "새 왕조는 한양으로 천도하여 정치·공간의 중심을 재설정했다."
    },
    {
      "id": "q3",
      "prompt": "건국 초기 제도·이념 구상에 깊이 관여한 인물로 알맞은 것은?",
      "choices": [
        { "id": "a", "text": "정도전" },
        { "id": "b", "text": "이순신" },
        { "id": "c", "text": "김구" },
        { "id": "d", "text": "세종 대의 모든 대신을 동일시" }
      ],
      "answer": "a",
      "explanation": "정도전은 유교적 통치 구상과 초기 제도 논의에 중요한 역할을 했다."
    }
  ]
}
```

### 채점 규칙 (앱)

- 점수 = `정답 수 / 문항 수 * 100` (정수 반올림)  
- `answer`는 반드시 해당 문항 `choices[].id` 중 하나  
- 클라이언트는 정답을 UI에 미리 노출하지 않음 (제출 후 표시)

---

## 6. 네이밍 컨벤션 요약

| 대상 | 규칙 | 예 |
|------|------|-----|
| track 폴더 | `korean` \| `world` | `korean` |
| era / unit / lesson slug | 케밥케이스 ASCII | `joseon-early`, `athenian-democracy` |
| MDX 파일 | `<lesson>.mdx` | `joseon-founding.mdx` |
| 퀴즈 파일 | `<lesson>.quiz.json` | `joseon-founding.quiz.json` |
| curriculum 파일 | `content/curriculum/<track>.json` | `korean.json` |
| lessonKey | `track/era/unit/lesson` | `world/ancient/greece/athenian-democracy` |
| 표시 제목 | 한글, frontmatter·curriculum | `폴리스와 아테네 민주정` |

예약·금지 slug: `api`, `search`, `progress`, `_app`, `admin` (era/unit/lesson에 사용 금지)

---

## 7. 시드 파일 체크리스트

스캐폴딩 완료 시 아래가 **실제로 존재**해야 한다.

```
content/curriculum/korean.json
content/curriculum/world.json
content/korean/joseon-early/foundation/joseon-founding.mdx
content/korean/joseon-early/foundation/joseon-founding.quiz.json
content/world/ancient/greece/athenian-democracy.mdx
content/world/ancient/greece/athenian-democracy.quiz.json
```

각 MDX: §3 frontmatter + §4의 7개 H2  
각 quiz: §5 schema, 문항 ≥ 3  
본문: **원작 교육 요약만** (저작권 교과서 텍스트 금지)

---

## 8. 로더 의사코드 (구현 힌트)

```ts
// lib/content.ts (개념)
async function getLesson(track, era, unit, lesson) {
  const mdxPath = `content/${track}/${era}/${unit}/${lesson}.mdx`;
  const raw = await readFile(mdxPath);
  const { data, content } = matter(raw);
  assertFrontmatter(data, { track, era, unit });
  const quiz =
    (await readJsonIfExists(mdxPath.replace(/\.mdx$/, ".quiz.json")))
    ?? data.quiz
    ?? null;
  return { frontmatter: data, content, quiz, lessonKey: `${track}/${era}/${unit}/${lesson}` };
}
```

`generateStaticParams`: curriculum JSON의 모든 `lessons`에서 `{ era, unit, lesson }` 생성 (트랙별 라우트).

---

## 9. 변경 정책

- 필드 추가·삭제·이름 변경은 이 문서를 **먼저** 수정한 뒤 코드·시드를 맞춘다.  
- breaking change 시 `Quiz.version` / ProgressStore `version`을 올린다.  
- Cloud Agent는 이 스키마를 추측으로 대체하지 않는다.
