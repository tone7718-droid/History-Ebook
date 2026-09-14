"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearMistakes, readProgress, removeMistake } from "@/lib/progress";
import type { Quiz, QuizMistake } from "@/lib/types";
import { QuizPanel } from "./QuizPanel";

export function ReviewClient() {
  const [mistakes, setMistakes] = useState<QuizMistake[]>([]);

  const sync = () => setMistakes(readProgress().mistakes ?? []);

  useEffect(() => {
    sync();
    window.addEventListener("history-ebook:progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("history-ebook:progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const quiz: Quiz | null = useMemo(() => {
    if (!mistakes.length) return null;
    return {
      lessonId: "review",
      version: 2,
      questions: mistakes.slice(0, 10).map((m) => ({
        id: m.id,
        prompt: m.prompt,
        choices: m.choices,
        answer: m.answer,
        explanation: m.explanation,
      })),
    };
  }, [mistakes]);

  if (!mistakes.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
        <p>저장된 오답이 없습니다. 차시 퀴즈를 풀면 틀린 문항이 여기에 모입니다.</p>
        <p className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/korean"
            className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
          >
            한국사
          </Link>
          <Link
            href="/world"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium dark:border-slate-600"
          >
            세계사
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          저장된 오답 {mistakes.length}문항 (최근 80개까지)
        </p>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm("오답 노트를 모두 지울까요?")) return;
            clearMistakes();
            sync();
          }}
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm dark:border-slate-600"
        >
          오답 모두 삭제
        </button>
      </div>
      {quiz && (
        <QuizPanel
          quiz={quiz}
          lessonKey="review/mistakes"
          href="/review"
          title="오답 다시 풀기"
        />
      )}
      <ul className="space-y-3">
        {mistakes.map((m) => (
          <li
            key={m.id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <p className="font-medium text-slate-900 dark:text-slate-100">{m.prompt}</p>
            <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
              내 답: {m.chosenText}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              정답: {m.answerText}
            </p>
            {m.explanation && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {m.explanation}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href={m.href} className="underline-offset-2 hover:underline">
                해당 차시
              </Link>
              <button
                type="button"
                onClick={() => {
                  removeMistake(m.id);
                  sync();
                }}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                목록에서 빼기
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
