import { afterEach, expect, it, vi } from "vitest";
import { createBackup, mergeProgress, parseBackup, validateProgress, MAX_BACKUP_BYTES } from "@/lib/progress-backup";
import { readProgress, restoreProgress, writeProgress, recordQuizAttempt, PROGRESS_KEY } from "@/lib/progress";
import type { ProgressStore, QuizMistake } from "@/lib/types";
const key = "korean/a/b/c";
const wrong: QuizMistake = { id: `${key}::q1`, lessonKey: key, questionId: "q1", prompt: "문제", choices: [{ id: "a", text: "정답" }, { id: "b", text: "오답" }], answer: "a", chosen: "b", answerText: "정답", chosenText: "오답", explanation: "해설", href: `/${key}`, at: "2026-09-15T12:00:00.000Z" };
const progress: ProgressStore = { version: 1, lessons: { [key]: { read: true, readAt: wrong.at, quizBestScore: 60, quizAttempts: 2, lastQuizAt: wrong.at } }, lastVisited: key, mistakes: [wrong] };
afterEach(() => { vi.restoreAllMocks(); writeProgress({ version: 1, lessons: {} }); });
it("round-trips all supported records including an empty backup", () => {
  expect(parseBackup(createBackup(progress)).progress).toEqual(progress);
  expect(parseBackup(createBackup({ version: 1, lessons: {} })).progress.lessons).toEqual({});
});
it("rejects invalid JSON, versions, unsafe links, malformed data and oversized files", () => {
  expect(() => parseBackup("{")).toThrow();
  const backup = JSON.parse(createBackup(progress));
  expect(() => parseBackup(JSON.stringify({ ...backup, version: 2 }))).toThrow();
  expect(() => parseBackup(" ".repeat(MAX_BACKUP_BYTES + 1))).toThrow();
  expect(() => validateProgress({ ...progress, lessons: { [key]: { read: true, quizBestScore: 101 } } })).toThrow();
  expect(() => validateProgress({ ...progress, lessons: { [key]: { read: true, quizAttempts: -1 } } })).toThrow();
  expect(() => validateProgress({ ...progress, mistakes: [{ ...wrong, href: "javascript:alert(1)" }] })).toThrow();
  expect(() => validateProgress({ ...progress, mistakes: [{ ...wrong, choices: [] }] })).toThrow();
  expect(() => validateProgress({ ...progress, mistakes: [{ ...wrong, at: "2026-02-30" }] })).toThrow();
  expect(() => validateProgress({ version: 1, lessons: JSON.parse('{"__proto__":{"read":true}}') })).toThrow();
});
it("merges idempotently without inflating attempts or losing distinct lessons and mistakes", () => {
  const incoming: ProgressStore = { version: 1, lessons: { [key]: { read: false, quizBestScore: 100, quizAttempts: 1 }, "world/a/b/c": { read: true } }, mistakes: [{ ...wrong, questionId: "q2", id: `${key}::q2` }] };
  const merged = mergeProgress(progress, incoming);
  expect(merged.lessons[key]).toMatchObject({ read: true, quizBestScore: 100, quizAttempts: 2 });
  expect(merged.mistakes).toHaveLength(2);
  expect(mergeProgress(merged, incoming)).toEqual(merged);
  expect(progress.lessons[key].quizBestScore).toBe(60);
});
it("commits replacements and preserves persistent and temporary records on storage failure", () => {
  writeProgress(progress);
  const stored = localStorage.getItem(PROGRESS_KEY);
  const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Full", "QuotaExceededError"); });
  expect(restoreProgress({ version: 1, lessons: {} }, "replace")).toBe(false);
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(stored);
  expect(readProgress()).toEqual(progress);
  const temporary = { ...progress, lastVisited: "world/a/b/c" };
  expect(writeProgress(temporary)).toBe(false);
  expect(restoreProgress({ version: 1, lessons: {} }, "replace")).toBe(false);
  expect(readProgress()).toEqual(temporary);
  spy.mockRestore();
  expect(restoreProgress({ version: 1, lessons: {} }, "replace")).toBe(true);
  expect(readProgress().lessons).toEqual({});
});
it("keeps restored mistakes beyond the former 80-item limit after another answer", () => {
  const many = Array.from({ length: 90 }, (_, i) => ({ ...wrong, id: `${key}::q${i}`, questionId: `q${i}` }));
  restoreProgress({ ...progress, mistakes: many }, "replace");
  recordQuizAttempt(key, 100, [{ ...wrong, questionId: "q0", chosen: "a" }]);
  expect(readProgress().mistakes).toHaveLength(89);
});
