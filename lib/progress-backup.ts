import type { LessonProgress, ProgressStore, QuizMistake } from "./types";

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export type RestoreMode = "merge" | "replace";
export interface ProgressBackup {
  format: "history-ebook-progress";
  version: 1;
  exportedAt: string;
  progress: ProgressStore;
}
const lessonKey = /^(korean|world)\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/;
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("백업의 데이터 형식이 올바르지 않습니다.");
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim() || value.length > 100_000) throw new Error(`${label} 값이 올바르지 않습니다.`);
  return value;
}
function date(value: unknown): string {
  const result = text(value, "날짜");
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z)?$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result.slice(0, 10)) throw new Error("날짜 형식이 올바르지 않습니다.");
  return result;
}
function key(value: unknown): string {
  const result = text(value, "차시");
  if (!lessonKey.test(result)) throw new Error("차시 주소가 올바르지 않습니다.");
  return result;
}
function lesson(value: unknown): LessonProgress {
  const source = object(value);
  if (typeof source.read !== "boolean") throw new Error("읽음 상태가 올바르지 않습니다.");
  const result: LessonProgress = { read: source.read };
  if (source.readAt !== undefined) result.readAt = date(source.readAt);
  if (source.lastQuizAt !== undefined) result.lastQuizAt = date(source.lastQuizAt);
  if (source.quizBestScore !== undefined) {
    if (typeof source.quizBestScore !== "number" || !Number.isFinite(source.quizBestScore) || source.quizBestScore < 0 || source.quizBestScore > 100) throw new Error("퀴즈 점수가 올바르지 않습니다.");
    result.quizBestScore = source.quizBestScore;
  }
  if (source.quizAttempts !== undefined) {
    if (typeof source.quizAttempts !== "number" || !Number.isSafeInteger(source.quizAttempts) || source.quizAttempts < 0) throw new Error("퀴즈 시도 횟수가 올바르지 않습니다.");
    result.quizAttempts = source.quizAttempts;
  }
  return result;
}
function mistake(value: unknown): QuizMistake {
  const source = object(value);
  const lesson = key(source.lessonKey);
  const questionId = text(source.questionId, "문항 ID");
  if (source.id !== `${lesson}::${questionId}` || source.href !== `/${lesson}`) throw new Error("오답의 원본 차시 정보가 일치하지 않습니다.");
  if (!Array.isArray(source.choices) || source.choices.length < 2 || source.choices.length > 20) throw new Error("오답 선택지가 올바르지 않습니다.");
  const choices = source.choices.map((value) => { const c = object(value); return { id: text(c.id, "선택지 ID"), text: text(c.text, "선택지") }; });
  const ids = new Set(choices.map((c) => c.id));
  const answer = text(source.answer, "정답");
  const chosen = text(source.chosen, "선택한 답");
  if (ids.size !== choices.length || !ids.has(answer) || !ids.has(chosen) || answer === chosen) throw new Error("오답과 선택지가 일치하지 않습니다.");
  const result: QuizMistake = {
    id: `${lesson}::${questionId}`, lessonKey: lesson, questionId,
    href: `/${lesson}`, prompt: text(source.prompt, "문제"), choices, answer, chosen,
    chosenText: text(source.chosenText, "선택한 답 설명"), answerText: text(source.answerText, "정답 설명"), at: date(source.at),
  };
  if (source.explanation !== undefined) {
    if (typeof source.explanation !== "string") throw new Error("해설이 올바르지 않습니다.");
    result.explanation = source.explanation;
  }
  return result;
}
export function validateProgress(value: unknown): ProgressStore {
  const source = object(value);
  if (source.version !== 1) throw new Error("지원하지 않는 학습 기록 버전입니다.");
  const lessons = Object.fromEntries(Object.entries(object(source.lessons)).map(([id, value]) => [key(id), lesson(value)]));
  if (source.mistakes !== undefined && !Array.isArray(source.mistakes)) throw new Error("오답 목록이 올바르지 않습니다.");
  const mistakes = ((source.mistakes ?? []) as unknown[]).map(mistake);
  if (mistakes.length > 1000) throw new Error("오답 기록은 최대 1,000개까지 복원할 수 있습니다.");
  if (new Set(mistakes.map((m) => m.id)).size !== mistakes.length) throw new Error("중복된 오답 기록이 있습니다.");
  return { version: 1, lessons, mistakes, ...(source.lastVisited === undefined ? {} : { lastVisited: key(source.lastVisited) }) };
}
export function parseBackup(raw: string): ProgressBackup {
  if (new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES) throw new Error("백업 파일은 5MB 이하여야 합니다.");
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("읽을 수 없는 JSON 파일입니다."); }
  const source = object(value);
  if (source.format !== "history-ebook-progress" || source.version !== 1) throw new Error("지원하는 History E-book 백업 파일이 아닙니다.");
  return { format: "history-ebook-progress", version: 1, exportedAt: date(source.exportedAt), progress: validateProgress(source.progress) };
}
export function createBackup(progress: ProgressStore): string {
  const raw = JSON.stringify({ format: "history-ebook-progress", version: 1, exportedAt: new Date().toISOString(), progress: validateProgress(progress) }, null, 2);
  if (new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES) throw new Error("학습 기록이 백업 파일 크기 제한(5MB)을 초과했습니다.");
  return raw;
}
const earliest = (a?: string, b?: string) => !a ? b : !b ? a : Date.parse(a) <= Date.parse(b) ? a : b;
const latest = (a?: string, b?: string) => !a ? b : !b ? a : Date.parse(a) >= Date.parse(b) ? a : b;
export function mergeProgress(current: ProgressStore, incoming: ProgressStore): ProgressStore {
  const a = validateProgress(current), b = validateProgress(incoming);
  const lessons = { ...a.lessons };
  for (const [id, next] of Object.entries(b.lessons)) {
    const prev = lessons[id];
    lessons[id] = prev ? {
      read: prev.read || next.read,
      readAt: earliest(prev.readAt, next.readAt),
      quizBestScore: prev.quizBestScore === undefined && next.quizBestScore === undefined ? undefined : Math.max(prev.quizBestScore ?? 0, next.quizBestScore ?? 0),
      quizAttempts: prev.quizAttempts === undefined && next.quizAttempts === undefined ? undefined : Math.max(prev.quizAttempts ?? 0, next.quizAttempts ?? 0),
      lastQuizAt: latest(prev.lastQuizAt, next.lastQuizAt),
    } : next;
  }
  const mistakes = new Map((a.mistakes ?? []).map((m) => [m.id, m]));
  for (const next of b.mistakes ?? []) {
    const prev = mistakes.get(next.id);
    if (!prev || Date.parse(next.at) > Date.parse(prev.at)) mistakes.set(next.id, next);
  }
  if (mistakes.size > 1000) throw new Error("병합 후 오답이 1,000개를 초과합니다. 현재 기록을 백업한 뒤 교체 방식을 선택하세요.");
  return { version: 1, lessons, lastVisited: a.lastVisited ?? b.lastVisited,
    mistakes: [...mistakes.values()].sort((x, y) => Date.parse(y.at) - Date.parse(x.at) || x.id.localeCompare(y.id)) };
}
