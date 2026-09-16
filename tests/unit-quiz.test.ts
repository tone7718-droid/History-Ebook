import { expect, it } from "vitest";
import { selectUnitQuestions } from "@/lib/unit-quiz";
import type { QuizQuestion } from "@/lib/types";
const bank: QuizQuestion[] = Array.from({ length: 4 }, (_, lesson) =>
  Array.from({ length: 6 }, (_, question) => ({
    id: `${lesson}:${question}`, sourceLessonKey: `lesson-${lesson}`,
    prompt: "Q", choices: [], answer: "a",
  }))
).flat();
it("balances lesson coverage and prioritizes unused questions on retry", () => {
  const first = selectUnitQuestions(bank);
  expect(first).toHaveLength(10);
  const counts = [0, 1, 2, 3].map((l) => first.filter((q) => q.sourceLessonKey === `lesson-${l}`).length);
  expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  const seen = Object.fromEntries(first.map((q) => [q.id, 1]));
  const second = selectUnitQuestions(bank, seen, 1);
  expect(second.every((q) => !seen[q.id])).toBe(true);
  expect(new Set(second.map((q) => q.id)).size).toBe(10);
});
it("handles empty and exhausted banks and rotates lessons beyond the limit", () => {
  expect(selectUnitQuestions([])).toEqual([]);
  expect(selectUnitQuestions(bank.slice(0, 3))).toHaveLength(3);
  const many = bank.slice(0, 12).map((q, i) => ({ ...q, sourceLessonKey: `l${i}` }));
  const first = selectUnitQuestions(many);
  const next = selectUnitQuestions(many, {}, 2);
  expect(next.some((q) => !first.includes(q))).toBe(true);
});
