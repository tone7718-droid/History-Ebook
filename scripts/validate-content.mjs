import { validReview } from "../lib/review-evidence.mjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");
const REQUIRED_H2 = [
  "\uD559\uC2B5\uBAA9\uD45C",
  "\uBC30\uACBD",
  "\uD575\uC2EC\uC0AC\uAC74(\uC5F0\uD45C)",
  "\uC778\uBB3C",
  "\uC778\uACFC\u00B7\uC601\uD5A5",
  "\uD5F7\uAC08\uB9AC\uAE30 \uC26C\uC6B4 \uD3EC\uC778\uD2B8",
  "\uC694\uC57D",
];
const FORBIDDEN_TEXT = [
  "만으로 동일시",
  "가깝은",
  "옮은 것은",
  "봉당",
  "베르늵",
  "엕게스",
  "미륬",
  "어귳",
  "볼슈비키",
  "햇벽정책",
  "겹치다.",
];

function loadCurriculum(track) {
  return JSON.parse(fs.readFileSync(path.join(contentRoot, "curriculum", `${track}.json`), "utf8"));
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, content: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { data: {}, content: raw };
  const yaml = raw.slice(4, end);
  const content = raw.slice(end + 4);
  const data = {};
  let key = null;
  for (const line of yaml.split("\n")) {
    if (/^\s+-\s+/.test(line) && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(line.replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, ""));
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    key = m[1];
    const val = m[2];
    if (val === "") data[key] = [];
    else if (val === "true") data[key] = true;
    else if (val === "false") data[key] = false;
    else if (/^-?\d+$/.test(val)) data[key] = Number(val);
    else data[key] = val.replace(/^["']|["']$/g, "");
  }
  return { data, content };
}

function walkMdx(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (fs.statSync(abs).isDirectory()) walkMdx(abs, acc);
    else if (name.endsWith(".mdx")) acc.push(abs);
  }
  return acc;
}

const errors = [];
const warnings = [];
const canon = new Set();
const reviewTargets = new Map();

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

for (const track of ["korean", "world"]) {
  const curriculum = loadCurriculum(track);
  for (const era of curriculum.eras) {
    for (const unit of era.units) {
      for (const lesson of unit.lessons) {
        const rel = lesson.mdxPath.replace(/\\/g, "/");
        canon.add(rel);
        const abs = path.join(contentRoot, rel);
        if (!fs.existsSync(abs)) {
          errors.push(`missing MDX: ${rel}`);
          continue;
        }
        const expected = `${track}/${era.id}/${unit.id}/${lesson.id}.mdx`;
        if (rel !== expected) errors.push(`path mismatch: ${rel}`);
        const { data, content } = parseFrontmatter(fs.readFileSync(abs, "utf8"));
        if (data.track !== track || data.era !== era.id || data.unit !== unit.id) {
          errors.push(`frontmatter path mismatch: ${rel}`);
        }
        if (!data.title || !Array.isArray(data.keywords) || data.keywords.length < 1) {
          errors.push(`bad title/keywords: ${rel}`);
        }
        if (![1, 2, 3].includes(data.difficulty)) errors.push(`difficulty: ${rel}`);
        for (const h of REQUIRED_H2) {
          if (!content.includes(`## ${h}`)) errors.push(`${rel}: missing ${h}`);
        }
        const quizPath = abs.replace(/\.mdx$/, ".quiz.json");
        if (!fs.existsSync(quizPath)) {
          errors.push(`missing quiz: ${rel}`);
          continue;
        }
        const quiz = JSON.parse(fs.readFileSync(quizPath, "utf8"));
        const expectedLessonId = `${track}/${era.id}/${unit.id}/${lesson.id}`;
        if (quiz.lessonId !== expectedLessonId) errors.push(`quiz lessonId mismatch: ${rel}`);
        const questions = quiz.questions || [];
        if (questions.length < 3 || questions.length > 6) {
          errors.push(`quiz count ${questions.length}: ${rel}`);
        }
        const answers = [];
        const questionIds = questions.map((question) => question.id);
        if (new Set(questionIds).size !== questionIds.length) errors.push(`duplicate question id: ${rel}`);
        for (const q of questions) {
          const choices = q.choices || [];
          const ids = choices.map((c) => c.id);
          if (choices.length < 3 || choices.length > 5) {
            errors.push(`choice count ${rel} ${q.id}`);
          }
          if (new Set(ids).size !== ids.length) {
            errors.push(`duplicate choices ${rel} ${q.id}`);
          }
          const normalizedChoices = choices.map((choice) => String(choice.text ?? "").replace(/\s+/g, " ").trim());
          if (normalizedChoices.some((text) => !text)) errors.push(`empty choice ${rel} ${q.id}`);
          if (new Set(normalizedChoices).size !== normalizedChoices.length) {
            errors.push(`duplicate choice text ${rel} ${q.id}`);
          }
          if (!ids.includes(q.answer)) errors.push(`bad answer ${rel} ${q.id}`);
          if (!q.prompt || String(q.prompt).trim().length < 8) {
            errors.push(`short prompt ${rel} ${q.id}`);
          }
          if (!q.explanation || String(q.explanation).trim().length < 8) {
            errors.push(`short explanation ${rel} ${q.id}`);
          }
          answers.push(q.answer);
        }
        reviewTargets.set(`${track}/${era.id}/${unit.id}/${lesson.id}`, {
          contentSha256: hashFile(abs),
          quizSha256: hashFile(quizPath),
          questions: questions.length,
          choices: questions.reduce((sum, question) => sum + (question.choices?.length ?? 0), 0),
        });
        if (answers.length >= 3 && new Set(answers).size === 1) {
          warnings.push(`all answers ${answers[0]}: ${rel}`);
        }
      }
    }
  }
}

for (const abs of walkMdx(contentRoot)) {
  const quizPath = abs.replace(/\.mdx$/, ".quiz.json");
  const combined = `${fs.readFileSync(abs, "utf8")}\n${fs.existsSync(quizPath) ? fs.readFileSync(quizPath, "utf8") : ""}`;
  for (const phrase of FORBIDDEN_TEXT) {
    if (combined.includes(phrase)) errors.push(`forbidden generated/typo phrase "${phrase}": ${path.relative(contentRoot, abs)}`);
  }
}

const reviewPath = path.join(contentRoot, "review-status.json");
if (!fs.existsSync(reviewPath)) {
  errors.push("missing review-status.json");
} else {
  const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  const entries = new Map((review.lessons ?? []).map((entry) => [entry.lessonId, entry]));
  if (review.version !== 2) errors.push("review status: unsupported version");
  if (entries.size !== review.lessons.length) errors.push("duplicate review lesson ID");
  for (const [lessonId, expected] of reviewTargets) {
    const actual = entries.get(lessonId);
    if (!actual) {
      errors.push(`missing review status: ${lessonId}`);
      continue;
    }
    for (const field of ["contentSha256", "quizSha256", "questions", "choices"]) {
      if (actual[field] !== expected[field]) errors.push(`stale review status: ${lessonId} ${field}`);
    }
    for (const field of ["coreFacts", "quiz"]) {
      if (!validReview(actual[field])) errors.push(`invalid review evidence: ${lessonId} ${field}`);
    }
  }
  for (const lessonId of entries.keys()) {
    if (!reviewTargets.has(lessonId)) errors.push(`orphan review status: ${lessonId}`);
  }
  const expectedTotals = [...reviewTargets.values()].reduce(
    (totals, item) => ({ lessons: totals.lessons + 1, questions: totals.questions + item.questions, choices: totals.choices + item.choices }),
    { lessons: 0, questions: 0, choices: 0 }
  );
  for (const field of ["lessons", "questions", "choices"]) {
    if (review.totals?.[field] !== expectedTotals[field]) errors.push(`review totals mismatch: ${field}`);
  }
}

for (const abs of walkMdx(contentRoot)) {
  const rel = path.relative(contentRoot, abs).replace(/\\/g, "/");
  if (!canon.has(rel)) errors.push(`orphan MDX: ${rel}`);
}

const lessonHrefs = new Set([...canon].map((rel) => `/${rel.replace(/\.mdx$/, "")}`));
const timeline = JSON.parse(fs.readFileSync(path.join(contentRoot, "timeline.json"), "utf8"));
for (const event of timeline.events ?? []) {
  if (!Number.isFinite(event.year) || !event.label || !lessonHrefs.has(event.href)) {
    errors.push(`bad timeline event: ${JSON.stringify(event)}`);
  }
}

const imageCredits = JSON.parse(fs.readFileSync(path.join(contentRoot, "image-credits.json"), "utf8"));
if (!/^\d{4}-\d{2}-\d{2}$/.test(imageCredits.checkedAt ?? "")) {
  errors.push("image credits: missing checkedAt");
}
const imageSources = fs.readdirSync(path.join(root, "lib")).filter((name) => /^lesson-images.*\.ts$/.test(name));
for (const filename of imageSources) {
  const source = fs.readFileSync(path.join(root, "lib", filename), "utf8");
  for (const match of source.matchAll(/(?:u\("https:\/\/upload\.wikimedia\.org\/[^"]+\/([^/"?]+)|c\("([^"]+)"\s*,)/g)) {
    const raw = decodeURIComponent(match[1] || match[2]);
    const normalized = raw.replace(/_/g, " ");
    if (!imageCredits.files?.[raw] && !imageCredits.files?.[normalized]) {
      errors.push(`missing image credit: ${raw}`);
    }
  }
}

if (warnings.length) {
  console.warn(`warnings (${warnings.length}):`);
  for (const w of warnings) console.warn(" -", w);
}

if (errors.length) {
  console.error(`errors (${errors.length}):`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log(`ok: ${canon.size} curriculum lessons validated`);
