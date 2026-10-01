# History Ebook Progress

**Updated:** 2026-10-01

## Status: full content review done, progress backup added

- Live: https://history-ebook.vercel.app
- 125 lessons; glossary boxes match every lesson (extra terms in content/glossary-extra.json)
- 2026-09-16: full content and quiz review; review status now requires evidence; unit quiz retries balanced
- 2026-09-21: progress backup/restore (validated JSON export/import, merge or confirmed replace,
  existing records kept when storage fails) with 14 unit tests and Chromium/mobile WebKit e2e scenarios
- 2026-10-01: cleanup — removed the unused search-index build step (search builds its index from MDX
  at runtime), a one-off quiz wording script and dead helpers; next 15.5.27, postcss pinned to a patched
  version (production npm audit: 0)
