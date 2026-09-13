import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentRoot = path.join(root, "content");

function loadCurriculum(track) {
  return JSON.parse(
    fs.readFileSync(path.join(contentRoot, "curriculum", `${track}.json`), "utf8")
  );
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
        const bodyText = content
          .replace(/^#{1,6}\s+/gm, " ")
          .replace(/[*_`>~-]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        docs.push({
          id: `${track}/${era.id}/${unit.id}/${lesson.id}`,
          track,
          title: data.title || lesson.title,
          era: era.id,
          eraTitle: era.title,
          unit: unit.id,
          unitTitle: unit.title,
          keywords: data.keywords || [],
          bodyText,
          href: `/${track}/${era.id}/${unit.id}/${lesson.id}`,
          description: data.description,
        });
      }
    }
  }
}

const out = path.join(root, "public", "search-index.json");
fs.writeFileSync(out, JSON.stringify(docs, null, 2));
console.log(`Wrote ${docs.length} docs → ${out}`);
