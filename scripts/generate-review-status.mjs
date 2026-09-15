import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");
const outputPath = path.join(contentRoot, "review-status.json");
const reviewedAt = "2026-09-15";

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
        lessons.push({
          lessonId: `${track}/${era.id}/${unit.id}/${lesson.id}`,
          contentSha256: hashFile(mdxPath),
          quizSha256: hashFile(quizPath),
          questions: questions.length,
          choices,
          coreFacts: "reviewed",
          quiz: "reviewed",
        });
      }
    }
  }
}

const manifest = {
  version: 1,
  reviewedAt,
  scope: "125개 차시의 핵심 연대·인물·제도·인과관계와 모든 퀴즈의 정답·해설·선택지",
  methodology: [
    "국사편찬위원회 우리역사넷 및 OpenStax 세계사 개설서와 대조",
    "정답 유일성, 선택지 중복, 시대·개념 적합성, 해설 일치 여부 검토",
    "본문 또는 퀴즈 파일이 바뀌면 SHA-256 검증이 실패하도록 기록",
  ],
  totals: { lessons: lessons.length, questions: questionCount, choices: choiceCount },
  lessons,
};

if (!process.argv.includes("--write")) {
  console.error("검수 완료 후에만 --write 옵션으로 review-status.json을 갱신하세요.");
  process.exit(1);
}

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote ${lessons.length} lessons, ${questionCount} questions, ${choiceCount} choices`);
