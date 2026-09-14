import Link from "next/link";
import type { RelatedLessonLink } from "@/lib/related";

export function RelatedLessons({ items }: { items: RelatedLessonLink[] }) {
  if (!items.length) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/40"
      aria-labelledby="related-lessons-heading"
    >
      <h2
        id="related-lessons-heading"
        className="text-base font-semibold text-slate-900 dark:text-slate-50"
      >
        관련 차시
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        같은 시기·주제를 한국사와 세계사에서 이어서 보세요.
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.lessonKey}>
            <Link
              href={item.href}
              className="block min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-3 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
            >
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.trackLabel} · {item.eraTitle}
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-slate-900 dark:text-slate-50">
                {item.title}
              </span>
              <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-400">
                {item.note}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
