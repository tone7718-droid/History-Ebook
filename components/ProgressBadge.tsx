"use client";

import { useEffect, useState } from "react";
import { getLessonProgress } from "@/lib/progress";

export function ProgressBadge({ lessonKey }: { lessonKey: string }) {
  const [read, setRead] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const sync = () => {
      const p = getLessonProgress(lessonKey);
      setRead(!!p?.read);
      setQuizDone((p?.quizBestScore ?? 0) >= 100 || (p?.quizAttempts ?? 0) > 0);
    };
    sync();
    window.addEventListener("history-ebook:progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("history-ebook:progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, [lessonKey]);

  if (!read && !quizDone) return null;

  return (
    <span className="ml-1 inline-flex items-center gap-1 text-xs">
      {read && (
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
          ✓
        </span>
      )}
      {quizDone && (
        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
          퀴즈
        </span>
      )}
    </span>
  );
}
