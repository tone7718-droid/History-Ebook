"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { selectUnitQuestions } from "@/lib/unit-quiz";
import { QuizPanel } from "./QuizPanel";

export function UnitQuiz({ quiz, lessonKey }: { quiz: Quiz; lessonKey: string }) {
  const [session, setSession] = useState(() => ({
    attempt: 0,
    seen: {} as Record<string, number>,
    questions: selectUnitQuestions(quiz.questions),
  }));
  const nextAttempt = () => setSession((current) => {
    const seen = { ...current.seen };
    for (const question of current.questions) seen[question.id] = (seen[question.id] ?? 0) + 1;
    const attempt = current.attempt + 1;
    return { attempt, seen, questions: selectUnitQuestions(quiz.questions, seen, attempt) };
  });
  return <QuizPanel key={`${lessonKey}:${session.attempt}`} quiz={{ ...quiz, questions: session.questions }}
    lessonKey={lessonKey} title="단원 종합 퀴즈" onNewAttempt={nextAttempt} />;
}
