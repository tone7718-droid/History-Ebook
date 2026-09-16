import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");
const outputPath = path.join(contentRoot, "review-status.json");
const previous = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const existing = new Map(previous.lessons.map((entry) => [entry.lessonId, entry]));

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

const lessons = [];
let questionCount = 0;
let choiceCount = 0;

for (const track of ["korean", "world"]) {
  const curriculum = JSON.parse(
    fs.readFileSync(path.join(contentRoot, "curriculum", `${track}.json`), "utf8")
  );
  for (const era of curriculum.eras) {
    for (const unit of era.units) {
      for (const lesson of unit.lessons) {
        const mdxPath = path.join(contentRoot, lesson.mdxPath);
        const quizPath = mdxPath.replace(/\.mdx$/, ".quiz.json");
        const quiz = JSON.parse(fs.readFileSync(quizPath, "utf8"));
        const questions = quiz.questions ?? [];
        const choices = questions.reduce((sum, question) => sum + (question.choices?.length ?? 0), 0);
        questionCount += questions.length;
        choiceCount += choices;
        const lessonId = `${track}/${era.id}/${unit.id}/${lesson.id}`;
        const old = existing.get(lessonId);
        const contentSha256 = hashFile(mdxPath);
        const quizSha256 = hashFile(quizPath);
        lessons.push({
          lessonId: `${track}/${era.id}/${unit.id}/${lesson.id}`,
          contentSha256: hashFile(mdxPath),
          quizSha256: hashFile(quizPath),
          questions: questions.length,
          choices,
          coreFacts: old?.contentSha256 === contentSha256 ? old.coreFacts : { status: "pending" },
          quiz: old?.quizSha256 === quizSha256 ? old.quiz : { status: "pending" },
        });
      }
    }
  }
}

const manifest = {
  version: 2,
  note: previous.note,
  totals: { lessons: lessons.length, questions: questionCount, choices: choiceCount },
  lessons,
};

if (!process.argv.includes("--write")) {
  console.error("--write 옵션으로 파일 상태를 갱신하세요. 변경된 항목은 재검토 대기로 전환됩니다.");
  process.exit(1);
}

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote ${lessons.length} lessons, ${questionCount} questions, ${choiceCount} choices`);
