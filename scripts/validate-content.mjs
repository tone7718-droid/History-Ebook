import fs from "fs";
import path from "path";
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
        const questions = quiz.questions || [];
        if (questions.length < 3 || questions.length > 6) {
          errors.push(`quiz count ${questions.length}: ${rel}`);
        }
        const answers = [];
        for (const q of questions) {
          const choices = q.choices || [];
          const ids = choices.map((c) => c.id);
          if (choices.length < 3 || choices.length > 5) {
            errors.push(`choice count ${rel} ${q.id}`);
          }
          if (new Set(ids).size !== ids.length) {
            errors.push(`duplicate choices ${rel} ${q.id}`);
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
        if (answers.length >= 3 && new Set(answers).size === 1) {
          warnings.push(`all answers ${answers[0]}: ${rel}`);
        }
      }
    }
  }
}

for (const abs of walkMdx(contentRoot)) {
  const rel = path.relative(contentRoot, abs).replace(/\\/g, "/");
  if (!canon.has(rel)) errors.push(`orphan MDX: ${rel}`);
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
