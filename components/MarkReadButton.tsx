"use client";

import { useEffect, useState } from "react";
import { getLessonProgress, markLessonRead, setLastVisited } from "@/lib/progress";

export function MarkReadButton({ lessonKey }: { lessonKey: string }) {
  const [read, setRead] = useState(false);

  useEffect(() => {
    setLastVisited(lessonKey);
    const p = getLessonProgress(lessonKey);
    setRead(!!p?.read);

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < window.innerHeight * 0.4) return;
      const ratio = window.scrollY / Math.max(scrollable, 1);
      if (ratio >= 0.8) {
        markLessonRead(lessonKey);
        setRead(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lessonKey]);

  return (
    <button
      type="button"
      onClick={() => {
        markLessonRead(lessonKey);
        setRead(true);
      }}
      className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
    >
      {read ? "읽음 완료 ✓" : "읽음으로 표시"}
    </button>
  );
}
