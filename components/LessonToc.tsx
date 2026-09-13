"use client";

import { useState } from "react";
import { TOC_HEADINGS, headingToId } from "@/lib/utils";

export function LessonToc() {
  const [open, setOpen] = useState(false);
  const long = TOC_HEADINGS.length > 4;

  return (
    <nav
      aria-label="이 페이지 목차"
      className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          이 페이지 목차
        </p>
        {long && (
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "접기" : "펼치기"}
          </button>
        )}
      </div>
      <ol
        className={`mt-2 space-y-1 text-sm ${long && !open ? "hidden sm:block" : "block"}`}
      >
        {TOC_HEADINGS.map((h) => (
          <li key={h}>
            <a
              href={`#${headingToId(h)}`}
              className="inline-flex min-h-10 items-center py-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              onClick={() => setOpen(false)}
            >
              {h}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
