"use client";

import type { ProgressStore, LessonProgress } from "./types";

export const PROGRESS_KEY = "history-ebook:progress:v1";

const emptyStore = (): ProgressStore => ({
  version: 1,
  lessons: {},
});

export function readProgress(): ProgressStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed.version !== 1 || !parsed.lessons) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

export function writeProgress(store: ProgressStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("history-ebook:progress"));
}

export function clearProgress() {
  if (typeof window === "undefined") return emptyStore();
  localStorage.removeItem(PROGRESS_KEY);
  const next = emptyStore();
  window.dispatchEvent(new Event("history-ebook:progress"));
  return next;
}

export function getLessonProgress(lessonKey: string): LessonProgress | undefined {
  return readProgress().lessons[lessonKey];
}

export function markLessonRead(lessonKey: string) {
  const store = readProgress();
  const prev = store.lessons[lessonKey] ?? { read: false };
  store.lessons[lessonKey] = {
    ...prev,
    read: true,
    readAt: new Date().toISOString(),
  };
  store.lastVisited = lessonKey;
  writeProgress(store);
  return store;
}

export function setLastVisited(lessonKey: string) {
  const store = readProgress();
  store.lastVisited = lessonKey;
  writeProgress(store);
  return store;
}

export function recordQuizScore(lessonKey: string, score: number) {
  const store = readProgress();
  const prev = store.lessons[lessonKey] ?? { read: false };
  const best = Math.max(prev.quizBestScore ?? 0, score);
  store.lessons[lessonKey] = {
    ...prev,
    quizBestScore: best,
    quizAttempts: (prev.quizAttempts ?? 0) + 1,
    lastQuizAt: new Date().toISOString(),
  };
  store.lastVisited = lessonKey;
  writeProgress(store);
  return store;
}

export function recordQuizAttempt(
  lessonKey: string,
  score: number,
  results: Array<{
    questionId: string;
    prompt: string;
    choices: { id: string; text: string }[];
    answer: string;
    chosen: string;
    explanation?: string;
    href: string;
  }>
) {
  const store = recordQuizScore(lessonKey, score);
  const now = new Date().toISOString();
  const mistakes = store.mistakes ?? [];
  const remaining = mistakes.filter((m) => {
    const hit = results.find(
      (r) =>
        r.questionId === m.id ||
        (lessonKey === m.lessonKey && r.questionId === m.questionId)
    );
    if (!hit) return true;
    return hit.chosen !== hit.answer;
  });
  store.mistakes = remaining.slice(0, 80);
  if (lessonKey.startsWith("review/")) {
    writeProgress(store);
    return store;
  }
  for (const r of results) {
    if (r.chosen === r.answer) continue;
    const id = `${lessonKey}::${r.questionId}`;
    const chosenText = r.choices.find((c) => c.id === r.chosen)?.text ?? r.chosen;
    const answerText = r.choices.find((c) => c.id === r.answer)?.text ?? r.answer;
    const next = {
      id,
      lessonKey,
      questionId: r.questionId,
      prompt: r.prompt,
      choices: r.choices,
      answer: r.answer,
      chosen: r.chosen,
      chosenText,
      answerText,
      explanation: r.explanation,
      href: r.href,
      at: now,
    };
    const idx = remaining.findIndex((m) => m.id === id);
    if (idx >= 0) remaining[idx] = next;
    else remaining.unshift(next);
  }
  store.mistakes = remaining.slice(0, 80);
  writeProgress(store);
  return store;
}

export function clearMistakes() {
  const store = readProgress();
  store.mistakes = [];
  writeProgress(store);
  return store;
}

export function removeMistake(id: string) {
  const store = readProgress();
  store.mistakes = (store.mistakes ?? []).filter((m) => m.id !== id);
  writeProgress(store);
  return store;
}

export function useProgressStore() {
  return { readProgress, writeProgress, clearProgress, PROGRESS_KEY };
}
