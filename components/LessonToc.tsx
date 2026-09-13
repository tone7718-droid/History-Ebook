import { TOC_HEADINGS, headingToId } from "@/lib/utils";

export function LessonToc() {
  return (
    <nav
      aria-label="이 페이지 목차"
      className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        이 페이지 목차
      </p>
      <ol className="space-y-1 text-sm">
        {TOC_HEADINGS.map((h) => (
          <li key={h}>
            <a
              href={`#${headingToId(h)}`}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {h}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
