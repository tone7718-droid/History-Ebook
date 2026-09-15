import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitReview } from "@/lib/content";
import type { TrackId } from "@/lib/types";
import { QuizPanel } from "./QuizPanel";

export function UnitReviewPage({ track, era, unit }: { track: TrackId; era: string; unit: string }) {
  const data = getUnitReview(track, era, unit);
  if (!data) notFound();
  return <main className="mx-auto max-w-4xl px-4 py-8">
    <Link href={`/${track}#era-${era}`} className="text-sm underline">← {data.trackLabel} 목차</Link>
    <h1 className="mt-4 text-3xl font-bold">{data.unitTitle} 단원 복습</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">{data.eraTitle} · 각 차시의 핵심 문항을 모은 종합 복습입니다.</p>
    <QuizPanel quiz={data.quiz} lessonKey={`review/${track}/${era}/${unit}`} title="단원 종합 퀴즈" />
  </main>;
}
