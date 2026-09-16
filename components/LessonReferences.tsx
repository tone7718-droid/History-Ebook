import type { LessonReference, ReviewEvidence } from "@/lib/types";

export function LessonReferences({
  items,
  review,
}: {
  items: LessonReference[];
  review: { coreFacts: ReviewEvidence | null; quiz: ReviewEvidence | null } | null;
}) {
  return (
    <section className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800" aria-labelledby="references-heading">
      <h2 id="references-heading" className="text-xl font-bold">참고자료</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        참고자료는 추가 읽기를 위한 자료입니다. 출처 대조 기록이 확인된 범위만 아래에 표시합니다.
      </p>
      {(["coreFacts", "quiz"] as const).map((field) => {
        const evidence = review?.[field];
        const label = field === "coreFacts" ? "본문 사실" : "퀴즈";
        return <div key={field} className="mt-3 text-sm">
          <p>{label}: {evidence ? `${evidence.reviewedAt} 검토 · ${evidence.scope}` : "출처 대조 재검토 대기"}</p>
          {evidence?.sources?.map((source) => <p key={`${source.url}:${source.locator}`}>
            <a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.title}</a> — {source.locator}
          </p>)}
        </div>;
      })}
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.url}>
            <a href={item.url} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2">{item.title}</a>
            <span className="text-slate-600 dark:text-slate-400"> — {item.publisher}{item.note ? ` · ${item.note}` : ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
