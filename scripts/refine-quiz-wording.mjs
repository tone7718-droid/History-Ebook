import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");

function walk(dir, result = []) {
  for (const name of fs.readdirSync(dir)) {
    const absolute = path.join(dir, name);
    if (fs.statSync(absolute).isDirectory()) walk(absolute, result);
    else if (name.endsWith(".quiz.json")) result.push(absolute);
  }
  return result;
}

const overrides = new Map(Object.entries({
  "korean/contemporary/authoritarianism-democratization/gwangju-june-uprising::q1::a": "5·16 군사정변",
  "korean/contemporary/authoritarianism-democratization/gwangju-june-uprising::q1::b": "12·12 군사반란",
  "korean/contemporary/authoritarianism-democratization/gwangju-june-uprising::q1::c": "10·26 사건",
  "korean/contemporary/authoritarianism-democratization/gwangju-june-uprising::q1::d": "부마민주항쟁",
  "korean/contemporary/authoritarianism-democratization/civilian-government-change::q5::a": "국회 청원",
  "korean/contemporary/authoritarianism-democratization/civilian-government-change::q5::b": "촛불 집회",
  "korean/contemporary/authoritarianism-democratization/civilian-government-change::q5::c": "군사정변",
  "korean/contemporary/authoritarianism-democratization/civilian-government-change::q5::d": "계엄 선포",
  "korean/contemporary/authoritarianism-democratization/park-industrialization::q2::a": "한미 상호 방위 조약",
  "korean/contemporary/contemporary-challenges/inter-korean-world::q3::b": "10·4 남북정상선언",
  "korean/contemporary/contemporary-challenges/inter-korean-world::q3::c": "남북기본합의서",
  "korean/contemporary/korean-war-aftermath/korean-war::q2::d": "흥남 철수 작전",
  "korean/contemporary/korean-war-aftermath/korean-war::q4::b": "한미 상호 방위 조약",
  "korean/contemporary/korean-war-aftermath/korean-war::q4::c": "남북기본합의서",
  "korean/contemporary/korean-war-aftermath/korean-war::q4::d": "6·15 남북공동선언",
}));

let filesChanged = 0;
let choicesChanged = 0;

for (const quizPath of walk(contentRoot)) {
  const quiz = JSON.parse(fs.readFileSync(quizPath, "utf8"));
  let changed = false;
  for (const question of quiz.questions ?? []) {
    for (const choice of question.choices ?? []) {
      const key = `${quiz.lessonId}::${question.id}::${choice.id}`;
      const cleaned = (overrides.get(key) ?? choice.text)
        .replace(/만으로 동일시/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned !== choice.text) {
        choice.text = cleaned;
        choicesChanged += 1;
        changed = true;
      }
    }
  }
  if (changed) {
    quiz.version = Math.max(quiz.version ?? 1, 3);
    fs.writeFileSync(quizPath, `${JSON.stringify(quiz, null, 2)}\n`);
    filesChanged += 1;
  }
}

console.log(`refined ${choicesChanged} choices in ${filesChanged} quiz files`);
