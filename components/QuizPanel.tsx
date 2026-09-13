"use client";

import { useMemo, useState } from "react";
import type { Quiz } from "@/lib/types";
import { recordQuizScore } from "@/lib/progress";
import { cn } from "@/lib/utils";

function hashSeed(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle<T>(items: T[], seed: number) {
  const next = [...items];
  let s = seed || 1;
  for (let i = next.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
  }
  return next;
}

export function QuizPanel({
  quiz,
  lessonKey,
}: {
  quiz: Quiz;
  lessonKey: string;
}) {
  const questions = quiz.questions;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [retryWrongOnly, setRetryWrongOnly] = useState(false);

  const visible = useMemo(() => {
    if (!retryWrongOnly || !submitted) return questions;
    return questions.filter((q) => answers[q.id] !== q.answer);
  }, [questions, retryWrongOnly, submitted, answers]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    return Math.round((correct / questions.length) * 100);
  }, [submitted, answers, questions]);

  const onSubmit = () => {
    setSubmitted(true);
    setRetryWrongOnly(false);
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    const s = Math.round((correct / questions.length) * 100);
    recordQuizScore(lessonKey, s);
  };

  const reset = (wrongOnly: boolean) => {
    if (wrongOnly) {
      const next: Record<string, string> = {};
      for (const q of questions) {
        if (answers[q.id] === q.answer) next[q.id] = answers[q.id];
      }
      setAnswers(next);
      setRetryWrongOnly(true);
    } else {
      setAnswers({});
      setRetryWrongOnly(false);
    }
    setSubmitted(false);
  };

  return (
    <section
      className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
      aria-labelledby="quiz-heading"
    >
      <h2 id="quiz-heading" className="mb-1 text-xl font-bold text-slate-900 dark:text-slate-50">
        퀴즈
      </h2>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        객관식 {questions.length}문항 · 제출 후 정답과 해설을 확인합니다.
      </p>

      <div className="space-y-6">
        {visible.map((q, idx) => {
          const chosen = answers[q.id];
          const isCorrect = chosen === q.answer;
          const choices = shuffle(q.choices, hashSeed(`${lessonKey}:${q.id}`));
          return (
            <fieldset key={q.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <legend className="mb-3 font-medium text-slate-900 dark:text-slate-100">
                {idx + 1}. {q.prompt}
              </legend>
              <div className="space-y-2">
                {choices.map((c) => {
                  const selected = chosen === c.id;
                  let style = "border-slate-200 dark:border-slate-700";
                  if (submitted) {
                    if (c.id === q.answer) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
                    else if (selected) style = "border-rose-400 bg-rose-50 dark:bg-rose-950/30";
                  } else if (selected) {
                    style = "border-slate-800 bg-slate-100 dark:border-slate-200 dark:bg-slate-800";
                  }
                  return (
                    <label
                      key={c.id}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                        style,
                        submitted && "cursor-default"
                      )}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={c.id}
                        checked={selected}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: c.id }))
                        }
                        className="h-4 w-4"
                      />
                      <span>{c.text}</span>
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p
                  className={cn(
                    "mt-3 text-sm",
                    isCorrect
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-rose-700 dark:text-rose-300"
                  )}
                >
                  {isCorrect ? "정답입니다." : "오답입니다."}
                  {q.explanation ? ` ${q.explanation}` : ""}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={visible.some((q) => !answers[q.id])}
            className="min-h-11 rounded-lg bg-indigo-700 px-5 text-sm font-medium text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            제출하기
          </button>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              점수: {score}점
            </p>
            <button
              type="button"
              onClick={() => reset(false)}
              className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm dark:border-slate-600"
            >
              다시 풀기
            </button>
            {score < 100 && (
              <button
                type="button"
                onClick={() => reset(true)}
                className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm dark:border-slate-600"
              >
                오답만 다시 풀기
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
