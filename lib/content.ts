import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  AdjacentLesson,
  CurriculumFile,
  LessonFrontmatter,
  LessonMeta,
  Quiz,
  QuizQuestion,
  SearchDocument,
  LessonReference,
  TrackId,
} from "./types";
import { lessonHref, lessonKey } from "./utils";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getCurriculum(track: TrackId): CurriculumFile {
  return readJson<CurriculumFile>(
    path.join(CONTENT_ROOT, "curriculum", `${track}.json`)
  );
}

export function getAllCurricula(): CurriculumFile[] {
  return [getCurriculum("korean"), getCurriculum("world")];
}

function assertFrontmatter(
  data: LessonFrontmatter,
  expected: { track: TrackId; era: string; unit: string }
) {
  if (data.track !== expected.track) {
    throw new Error(`frontmatter track mismatch: ${data.track}`);
  }
  if (data.era !== expected.era) {
    throw new Error(`frontmatter era mismatch: ${data.era}`);
  }
  if (data.unit !== expected.unit) {
    throw new Error(`frontmatter unit mismatch: ${data.unit}`);
  }
  if (![1, 2, 3].includes(data.difficulty)) {
    throw new Error(`invalid difficulty: ${data.difficulty}`);
  }
  if (!data.title || !Array.isArray(data.keywords) || data.keywords.length < 1) {
    throw new Error("invalid frontmatter title/keywords");
  }
}

const ANSWER_CYCLE = ["b", "c", "d", "a"] as const;

export function mixQuizAnswers(quiz: Quiz): Quiz {
  const questions = quiz.questions ?? [];
  const letters = questions.map((q) => q.answer);
  if (questions.length < 2 || new Set(letters).size > 1) {
    return quiz;
  }
  return {
    ...quiz,
    questions: questions.map((q, index) => rotateQuestionAnswer(q, index)),
  };
}

function rotateQuestionAnswer(question: QuizQuestion, index: number): QuizQuestion {
  const choices = question.choices ?? [];
  const correct = choices.find((choice) => choice.id === question.answer);
  if (!correct || choices.length < 2) {
    return question;
  }
  const others = choices.filter((choice) => choice.id !== question.answer);
  const ids = choices.map((_, i) => ["a", "b", "c", "d", "e"][i]);
  const wanted = ANSWER_CYCLE[index % ANSWER_CYCLE.length];
  const target = ids.includes(wanted) ? wanted : ids[index % ids.length];
  let nextOther = 0;
  const rebuilt = ids.map((id) => {
    if (id === target) {
      return { id, text: correct.text };
    }
    const text = others[nextOther]?.text ?? "";
    nextOther += 1;
    return { id, text };
  });
  return { ...question, choices: rebuilt, answer: target };
}

function loadQuiz(mdxAbsPath: string, fm: LessonFrontmatter): Quiz | null {
  const quizPath = mdxAbsPath.replace(/\.mdx$/, ".quiz.json");
  if (fs.existsSync(quizPath)) {
    return mixQuizAnswers(readJson<Quiz>(quizPath));
  }
  return fm.quiz ? mixQuizAnswers(fm.quiz) : null;
}

export function getAllLessonParams(track: TrackId) {
  const curriculum = getCurriculum(track);
  const params: { era: string; unit: string; lesson: string }[] = [];
  for (const era of curriculum.eras) {
    for (const unit of era.units) {
      for (const lesson of unit.lessons) {
        const abs = path.join(CONTENT_ROOT, lesson.mdxPath);
        if (!fs.existsSync(abs)) continue;
        const raw = fs.readFileSync(abs, "utf8");
        const { data } = matter(raw);
        const fm = data as LessonFrontmatter;
        if (fm.draft === true) continue;
        params.push({ era: era.id, unit: unit.id, lesson: lesson.id });
      }
    }
  }
  return params;
}

export function getFlatLessons(track?: TrackId): LessonMeta[] {
  const curricula = track ? [getCurriculum(track)] : getAllCurricula();
  const result: LessonMeta[] = [];

  for (const curriculum of curricula) {
    for (const era of curriculum.eras) {
      for (const unit of era.units) {
        for (const lesson of unit.lessons) {
          const abs = path.join(CONTENT_ROOT, lesson.mdxPath);
          if (!fs.existsSync(abs)) continue;
          const raw = fs.readFileSync(abs, "utf8");
          const { data } = matter(raw);
          const fm = data as LessonFrontmatter;
          if (fm.draft === true) continue;
          result.push({
            track: curriculum.track,
            era: era.id,
            unit: unit.id,
            lesson: lesson.id,
            title: fm.title || lesson.title,
            eraTitle: era.title,
            unitTitle: unit.title,
            trackLabel: curriculum.trackLabel,
            lessonKey: lessonKey(
              curriculum.track,
              era.id,
              unit.id,
              lesson.id
            ),
            href: lessonHref(
              curriculum.track,
              era.id,
              unit.id,
              lesson.id
            ),
            mdxPath: lesson.mdxPath,
            description: fm.description,
            keywords: fm.keywords ?? [],
            difficulty: fm.difficulty,
            draft: false,
          });
        }
      }
    }
  }
  return result;
}

export async function getLesson(
  track: TrackId,
  era: string,
  unit: string,
  lesson: string
) {
  const mdxRel = `${track}/${era}/${unit}/${lesson}.mdx`;
  const mdxAbs = path.join(CONTENT_ROOT, mdxRel);
  if (!fs.existsSync(mdxAbs)) {
    return null;
  }

  const raw = fs.readFileSync(mdxAbs, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as LessonFrontmatter;
  assertFrontmatter(frontmatter, { track, era, unit });
  if (frontmatter.draft === true) {
    return null;
  }

  const curriculum = getCurriculum(track);
  const eraMeta = curriculum.eras.find((e) => e.id === era);
  const unitMeta = eraMeta?.units.find((u) => u.id === unit);
  const lessonMeta = unitMeta?.lessons.find((l) => l.id === lesson);
  if (!eraMeta || !unitMeta || !lessonMeta) {
    return null;
  }

  const quiz = loadQuiz(mdxAbs, frontmatter);
  const key = lessonKey(track, era, unit, lesson);

  return {
    frontmatter,
    content,
    quiz,
    lessonKey: key,
    href: lessonHref(track, era, unit, lesson),
    trackLabel: curriculum.trackLabel,
    eraTitle: eraMeta.title,
    unitTitle: unitMeta.title,
    lessonTitle: frontmatter.title || lessonMeta.title || lesson,
  };
}

export function getAdjacentLessons(
  track: TrackId,
  era: string,
  unit: string,
  lesson: string
): AdjacentLesson {
  const flat = getFlatLessons(track);
  const idx = flat.findIndex(
    (l) => l.era === era && l.unit === unit && l.lesson === lesson
  );
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export function buildSearchDocuments(): SearchDocument[] {
  const lessons = getFlatLessons();
  return lessons.map((meta) => {
    const abs = path.join(CONTENT_ROOT, meta.mdxPath);
    const raw = fs.readFileSync(abs, "utf8");
    const { content } = matter(raw);
    const bodyText = content
      .replace(/^#{1,6}\s+/gm, " ")
      .replace(/[*_`>~-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return {
      id: meta.lessonKey,
      track: meta.track,
      title: meta.title,
      era: meta.era,
      eraTitle: meta.eraTitle,
      unit: meta.unit,
      unitTitle: meta.unitTitle,
      keywords: meta.keywords,
      bodyText,
      href: meta.href,
      description: meta.description,
    };
  });
}

export function getLessonCount(track?: TrackId) {
  return getFlatLessons(track).length;
}

export function getQuizQuestionBank(): Record<string, QuizQuestion> {
  const bank: Record<string, QuizQuestion> = {};
  for (const meta of getFlatLessons()) {
    const abs = path.join(CONTENT_ROOT, meta.mdxPath);
    const fm = matter(fs.readFileSync(abs, "utf8")).data as LessonFrontmatter;
    for (const q of loadQuiz(abs, fm)?.questions ?? []) {
      bank[`${meta.lessonKey}::${q.id}`] = q;
    }
  }
  return bank;
}

export function getLessonReferences(lessonKeyValue: string): LessonReference[] {
  const track: TrackId = lessonKeyValue.startsWith("world/") ? "world" : "korean";
  if (track === "korean") {
    const references: LessonReference[] = [
      { title: "신편 한국사", publisher: "국사편찬위원회 우리역사넷", url: "https://contents.history.go.kr/front/nh/main.do", note: "시대별 연구 개설과 사료 해설" },
      { title: "한국사 연대기", publisher: "국사편찬위원회 우리역사넷", url: "https://contents.history.go.kr/front/kc/main.do", note: "인물·사건별 추가 읽기" },
    ];
    if (lessonKeyValue.endsWith("/balhae-rise")) references.unshift(
      { title: "선왕: 발해의 최전성기를 이끈 군주", publisher: "국사편찬위원회 우리역사넷", url: "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_10&levelId=kc_n101175", note: "선왕·해동성국 교정 근거" }
    );
    if (lessonKeyValue.endsWith("/gojoseon-rise")) references.unshift(
      { title: "위만 조선", publisher: "국사편찬위원회 우리역사넷", url: "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m71_0020_0020_0010_0020", note: "위만의 집권 연대 참고" }
    );
    return references;
  }
  const references: LessonReference[] = [
    { title: "World History, Volume 1", publisher: "OpenStax, Rice University", url: "https://openstax.org/details/books/world-history-volume-1", note: "선사 시대부터 중세까지의 추가 읽기" },
    { title: "World History, Volume 2", publisher: "OpenStax, Rice University", url: "https://openstax.org/details/books/world-history-volume-2", note: "근세부터 현대까지의 추가 읽기" },
  ];
  if (lessonKeyValue.endsWith("/english-revolution")) references.unshift(
    { title: "The Rump dissolved", publisher: "UK Parliament", url: "https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/civilwar/overview/rump-dissolved/", note: "크롬웰의 호국경 지위 참고" }
  );
  if (lessonKeyValue.endsWith("/mesopotamia-civilization")) references.unshift(
    { title: "The Code of Hammurabi", publisher: "Musée du Louvre", url: "https://www.louvre.fr/en/the-code-of-hammurabi", note: "법전 편찬 시기 참고" }
  );
  return references;
}

export function getAllUnitParams(track: TrackId) {
  return getCurriculum(track).eras.flatMap((era) =>
    era.units.map((unit) => ({ era: era.id, unit: unit.id }))
  );
}

export function getUnitReview(track: TrackId, eraId: string, unitId: string) {
  const curriculum = getCurriculum(track);
  const era = curriculum.eras.find((item) => item.id === eraId);
  const unit = era?.units.find((item) => item.id === unitId);
  if (!era || !unit) return null;
  const questions: QuizQuestion[] = [];
  for (const lesson of unit.lessons) {
    const abs = path.join(CONTENT_ROOT, lesson.mdxPath);
    if (!fs.existsSync(abs)) continue;
    const fm = matter(fs.readFileSync(abs, "utf8")).data as LessonFrontmatter;
    const lessonKeyValue = lessonKey(track, eraId, unitId, lesson.id);
    for (const q of (loadQuiz(abs, fm)?.questions ?? []).slice(0, 2)) {
      questions.push({ ...q, id: `${lesson.id}::${q.id}`, sourceLessonKey: lessonKeyValue, sourceQuestionId: q.id, sourceHref: lessonHref(track, eraId, unitId, lesson.id) });
    }
  }
  return { trackLabel: curriculum.trackLabel, eraTitle: era.title, unitTitle: unit.title, quiz: { lessonId: `${track}/${eraId}/${unitId}/review`, version: 1, questions: questions.slice(0, 10) } as Quiz };
}
