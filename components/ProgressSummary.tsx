"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearProgress, readProgress } from "@/lib/progress";
import type { LessonMeta } from "@/lib/types";

export function ProgressSummary({ lessons }: { lessons: LessonMeta[] }) {
  const [store, setStore] = useState(readProgress());

  useEffect(() => {
    const sync = () => setStore(readProgress());
    sync();
    window.addEventListener("history-ebook:progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("history-ebook:progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const byTrack = (track: "korean" | "world") => {
    const list = lessons.filter((l) => l.track === track);
    const read = list.filter((l) => store.lessons[l.lessonKey]?.read).length;
    const quiz = list.filter(
      (l) => (store.lessons[l.lessonKey]?.quizAttempts ?? 0) > 0
    ).length;
    return { total: list.length, read, quiz };
  };

  const korean = byTrack("korean");
  const world = byTrack("world");
  const hasAny = Object.keys(store.lessons).length > 0;

  const onReset = () => {
    if (!window.confirm("이 브라우저의 읽음·퀴즈 기록을 모두 지울까요?")) return;
    clearProgress();
    setStore(readProgress());
  };

  if (!hasAny) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
        <p>아직 읽은 차시가 없습니다.</p>
        <p className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/korean" className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900">
            한국사부터
          </Link>
          <Link href="/world" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium dark:border-slate-600">
            세계사부터
          </Link>
        </p>
      </div>
    );
  }

  const Card = ({
    title,
    data,
  }: {
    title: string;
    data: { total: number; read: number; quiz: number };
  }) => {
    const pct = data.total ? Math.round((data.read / data.total) * 100) : 0;
    return (
      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h2 className="mb-3 text-lg font-semibold">{title}</h2>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{pct}%</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          읽음 {data.read}/{data.total} · 퀴즈 시도 {data.quiz}/{data.total}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="한국사" data={korean} />
        <Card title="세계사" data={world} />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          기록 삭제
        </button>
      </div>
    </div>
  );
}
