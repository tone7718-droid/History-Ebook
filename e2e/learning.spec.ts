import { expect, test, type Page } from "@playwright/test";
import quiz from "../content/korean/prehistoric-early/prehistoric-culture/paleolithic-life.quiz.json";

const key = "korean/prehistoric-early/prehistoric-culture/paleolithic-life";
const storageKey = "history-ebook:progress:v1";
const readStore = (page: Page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), storageKey);
const backupData = { format: "history-ebook-progress", version: 1, exportedAt: "2026-09-15T12:00:00.000Z",
  progress: { version: 1, lessons: { [key]: { read: true, quizBestScore: 80, quizAttempts: 2 } }, lastVisited: key, mistakes: [] } };
async function upload(page: Page, value: unknown) {
  await page.getByLabel("백업 파일 선택", { exact: false }).setInputFiles({ name: "progress.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(value)) });
}
test("search → lesson → quiz → review → reload preserves the correct records", async ({ page }) => {
  await page.goto("/search");
  await page.locator("#search-q").fill("구석기");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await page.locator(`a[href="/${key}"]`).last().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("구석기");
  await page.getByRole("button", { name: "읽음으로 표시", exact: true }).click();
  const panel = page.getByRole("region", { name: "퀴즈", exact: true });
  for (const question of quiz.questions) {
    const choice = question.choices.find((c) => c.id !== question.answer)!;
    await panel.getByRole("group").filter({ hasText: question.prompt }).getByLabel(choice.text, { exact: true }).check();
  }
  await panel.getByRole("button", { name: "제출하기" }).click();
  await expect(panel.getByRole("status")).toHaveText("점수: 0점");
  const apiResponse = page.waitForResponse((r) => r.url().endsWith("/api/review-questions") && r.request().method() === "POST");
  await page.goto("/review");
  expect((await apiResponse).ok()).toBeTruthy();
  const review = page.getByRole("region", { name: "오늘 복습" });
  for (const question of quiz.questions) {
    const choice = question.choices.find((c) => c.id === question.answer)!;
    await review.getByRole("group").filter({ hasText: question.prompt }).getByLabel(choice.text, { exact: true }).check();
  }
  await review.getByRole("button", { name: "제출하기" }).click();
  await expect(review.getByRole("status")).toHaveText("점수: 100점");
  await page.reload();
  await expect(page.getByText("저장된 오답이 없습니다.", { exact: false })).toBeVisible();
  const stored = await readStore(page);
  expect(stored.lessons[key]).toMatchObject({ read: true, quizBestScore: 0, quizAttempts: 1 });
  expect(stored.mistakes).toEqual([]);
  expect(Object.keys(stored.lessons)).toEqual([key]);
});
test("downloads a backup, restores in a new browser, and survives reload", async ({ page, browser }) => {
  await page.goto("/progress");
  await upload(page, backupData);
  await expect(page.getByRole("heading", { name: "복원 미리보기" })).toBeVisible();
  expect(await readStore(page)).toBeNull();
  await page.getByRole("button", { name: "복원 적용" }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 파일 저장" }).click();
  const download = await downloadEvent;
  const file = await download.path();
  expect(file).toBeTruthy();
  const context = await browser.newContext();
  const other = await context.newPage();
  try {
    await other.goto("http://127.0.0.1:3100/progress");
    await other.getByLabel("백업 파일 선택", { exact: false }).setInputFiles(file!);
    await other.getByRole("button", { name: "복원 적용" }).click();
    await expect(other.getByRole("status")).toContainText("저장했습니다");
    await other.reload();
    expect((await readStore(other)).lessons[key]).toMatchObject({ read: true, quizBestScore: 80, quizAttempts: 2 });
  } finally { await context.close(); }
});
test("invalid files, cancelled replacement and failed persistence keep existing data", async ({ page }) => {
  await page.goto("/progress");
  await upload(page, backupData);
  await page.getByRole("button", { name: "복원 적용" }).click();
  const before = await readStore(page);
  await upload(page, { ...backupData, version: 999 });
  await expect(page.getByRole("region", { name: "학습 기록 백업·복원" }).getByRole("alert")).toContainText("지원하는");
  expect(await readStore(page)).toEqual(before);
  await upload(page, { ...backupData, progress: { version: 1, lessons: {}, mistakes: [] } });
  await page.getByLabel("백업 내용으로 교체", { exact: true }).check();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "복원 적용" }).click();
  expect(await readStore(page)).toEqual(before);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError"); }; });
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "복원 적용" }).click();
  await expect(page.getByRole("region", { name: "학습 기록 백업·복원" }).getByRole("alert")).toContainText("복원을 적용하지 않았습니다");
  expect(await readStore(page)).toEqual(before);
  await page.reload();
  expect(await readStore(page)).toEqual(before);
});
test("learning continues with a visible warning when browser storage is blocked", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("Blocked", "SecurityError"); }; });
  await page.goto(`/${key}`);
  await page.getByRole("button", { name: "읽음으로 표시", exact: true }).click();
  await expect(page.getByRole("button", { name: "읽음 완료 ✓" })).toBeVisible();
  await expect(page.getByRole("alert").filter({ hasText: "브라우저 저장 공간" })).toContainText("이번 실행에서만");
  expect(await readStore(page)).toBeNull();
});
