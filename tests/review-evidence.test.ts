import { expect, it } from "vitest";
import { validReview } from "@/lib/review-evidence.mjs";
const evidence = { status: "reviewed", reviewedAt: "2026-09-15", reviewer: "editor", scope: "연대 확인",
  sources: [{ title: "사료", url: "https://example.org/chapter", locator: "2장 3절" }] };
it("requires specific evidence for completed records and accepts honest pending records", () => {
  expect(validReview({ status: "pending" })).toBe(true);
  expect(validReview({ status: "reviewed" })).toBe(false);
  expect(validReview(evidence, "2026-09-16")).toBe(true);
  expect(validReview({ ...evidence, sources: [] })).toBe(false);
  expect(validReview({ ...evidence, scope: " " })).toBe(false);
});
it("rejects impossible dates, future dates, and unsafe source URLs", () => {
  expect(validReview({ ...evidence, reviewedAt: "2026-02-30" })).toBe(false);
  expect(validReview(evidence, "2026-09-14")).toBe(false);
  expect(validReview({ ...evidence, sources: [{ ...evidence.sources[0], url: "javascript:alert(1)" }] })).toBe(false);
});
