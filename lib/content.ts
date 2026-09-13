import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  AdjacentLesson,
  CurriculumFile,
  LessonFrontmatter,
  LessonMeta,
  Quiz,
  SearchDocument,
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

function loadQuiz(mdxAbsPath: string, fm: LessonFrontmatter): Quiz | null {
  const quizPath = mdxAbsPath.replace(/\.mdx$/, ".quiz.json");
  if (fs.existsSync(quizPath)) {
    return readJson<Quiz>(quizPath);
  }
  return fm.quiz ?? null;
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
