import fs from "fs";
import { afterEach, expect, it, vi } from "vitest";
import { getLessonReviewStatus } from "@/lib/content";
import manifest from "@/content/review-status.json";
const original = fs.readFileSync.bind(fs);
afterEach(() => vi.restoreAllMocks());
it("withholds completion for pending, incomplete evidence, and changed files", () => {
  const lesson = manifest.lessons[0];
  expect(getLessonReviewStatus(lesson.lessonId)?.coreFacts).toBeNull();
  const data = structuredClone(manifest);
  const evidence = { status: "reviewed", reviewedAt: "2026-09-15", reviewer: "test", scope: "test scope",
    sources: [{ title: "test source", url: "https://example.org/chapter", locator: "chapter 1" }] };
  Object.assign(data.lessons[0].coreFacts, evidence);
  vi.spyOn(fs, "readFileSync").mockImplementation(((file: Parameters<typeof fs.readFileSync>[0], ...args: unknown[]) => {
    if (String(file).endsWith("review-status.json")) return JSON.stringify(data);
    return Reflect.apply(original, fs, [file, ...args]);
  }) as typeof fs.readFileSync);
  expect(getLessonReviewStatus(lesson.lessonId)?.coreFacts?.scope).toBe("test scope");
  data.lessons[0].contentSha256 = "changed";
  expect(getLessonReviewStatus(lesson.lessonId)?.coreFacts).toBeNull();
});
