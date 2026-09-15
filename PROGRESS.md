# History Ebook Progress

**Updated:** 2026-09-15 11:10 KST

## Status: glossary / review loop / timeline / print / search index on main

- Live: https://history-ebook.vercel.app
- Official curriculum still 125 lessons; no lesson deleted
- 2026-09-15 (this pass)
  - Glossary data (`content/glossary.json`, 96 terms) + search/filter on `/glossary`
  - Image helper `u()`/`c()` use Commons `Special:FilePath?width=960` + file-page credit
  - Daily review loop on `/review` (oldest-first + date-seeded 10)
  - Cross-era timeline at `/timeline` with track filter
  - Prebuilt search index (`scripts/build-search-index.mjs` creates `public/` then writes JSON)
  - Print stylesheet + per-lesson print button
  - Commons hotlink mitigation: width param, file-page href, `referrerPolicy=no-referrer`, onError hide
- Earlier: related lessons, quiz v2 on all 125, lesson figures on all 125
