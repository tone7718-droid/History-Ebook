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

export function useProgressStore() {
  // lightweight subscribe helper for client components
  return { readProgress, writeProgress, PROGRESS_KEY };
}
