import type { LessonReference } from "@/lib/types";

export function LessonReferences({
  items,
  review,
}: {
  items: LessonReference[];
  review: { reviewedAt: string; questions: number; choices: number } | null;
}) {
  return (
    <section className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800" aria-labelledby="references-heading">
      <h2 id="references-heading" className="text-xl font-bold">참고자료</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {review
          ? `핵심 연대·인물·제도·인과관계와 퀴즈 ${review.questions}문항·선택지 ${review.choices}개를 ${review.reviewedAt}에 검토했습니다. 아래 자료는 교차 확인과 추가 읽기에 사용한 공공·교육 자료입니다.`
          : "본문을 더 살펴볼 수 있는 공공·교육 자료입니다."}
      </p>
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
