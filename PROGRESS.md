# History Ebook Progress

**Updated:** 2026-09-15 08:30 KST

## Status: related links + Korean quiz v2 + lesson figures on main

- Live: https://history-ebook.vercel.app
- Official curriculum still 125 lessons; no lesson deleted
- 2026-09-15
  - Related lessons: Korean ↔ world cross-links (`lib/related.ts`)
  - SITE_SPEC H2 typo `헬갈리기` → `헷갈리기`
  - Korean quiz v2: all 55 lessons (rotated answers, same-era distractors)
  - Lesson figures: each of 125 lessons gets 1–2 Wikimedia Commons images after `배경` / `인물` / `핵심사건(연표)`
    - Catalog: `lib/lesson-images-korean.ts`, `lib/lesson-images-world.ts`
    - Missing files hide themselves (`onError`) so a bad Commons filename does not break the page
