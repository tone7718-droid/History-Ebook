import type { LessonReference } from "@/lib/types";

export function LessonReferences({ items, checkedAt }: { items: LessonReference[]; checkedAt: string }) {
  return (
    <section className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800" aria-labelledby="references-heading">
      <h2 id="references-heading" className="text-xl font-bold">참고자료</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        본문을 더 살펴볼 수 있는 공공·교육 자료입니다. 링크 확인일 {checkedAt}. 자료 연결은 본문 전체의 문장별 검증 완료를 뜻하지 않습니다.
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
