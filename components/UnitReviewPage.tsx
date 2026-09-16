import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitReview } from "@/lib/content";
import type { TrackId } from "@/lib/types";
import { UnitQuiz } from "./UnitQuiz";

export function UnitReviewPage({ track, era, unit }: { track: TrackId; era: string; unit: string }) {
  const data = getUnitReview(track, era, unit);
  if (!data) notFound();
  return <main className="mx-auto max-w-4xl px-4 py-8">
    <Link href={`/${track}#era-${era}`} className="text-sm underline">← {data.trackLabel} 목차</Link>
    <h1 className="mt-4 text-3xl font-bold">{data.unitTitle} 단원 복습</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">{data.eraTitle} · 차시별로 고르게 출제하며, 재도전하면 아직 풀지 않은 문항을 우선 제공합니다.</p>
    <UnitQuiz quiz={data.quiz} lessonKey={`review/${track}/${era}/${unit}`} />
  </main>;
}
