import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentRoot = path.join(root, "content");
const BODY_LIMIT = 400;

function loadCurriculum(track) {
  return JSON.parse(
    fs.readFileSync(path.join(contentRoot, "curriculum", `${track}.json`), "utf8")
  );
}

function cleanBody(content) {
  const text = content
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/[*_`>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > BODY_LIMIT ? text.slice(0, BODY_LIMIT) : text;
}

const docs = [];
for (const track of ["korean", "world"]) {
  const curriculum = loadCurriculum(track);
  for (const era of curriculum.eras) {
    for (const unit of era.units) {
      for (const lesson of unit.lessons) {
        const abs = path.join(contentRoot, lesson.mdxPath);
        if (!fs.existsSync(abs)) continue;
        const raw = fs.readFileSync(abs, "utf8");
        const { data, content } = matter(raw);
        if (data.draft === true) continue;
        docs.push({
          id: `${track}/${era.id}/${unit.id}/${lesson.id}`,
          track,
          title: data.title || lesson.title,
          era: era.id,
          eraTitle: era.title,
          unit: unit.id,
          unitTitle: unit.title,
          keywords: data.keywords || [],
          bodyText: cleanBody(content),
          href: `/${track}/${era.id}/${unit.id}/${lesson.id}`,
          description: data.description ?? null,
        });
      }
    }
  }
}

const payload = JSON.stringify(docs);
const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "search-index.json"), payload);
fs.writeFileSync(path.join(contentRoot, "search-index.json"), payload);
console.log(`Wrote ${docs.length} docs (${Buffer.byteLength(payload)} bytes)`);
