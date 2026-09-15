"use client";

export function PrintLessonButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-3 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-900"
    >
      이 차시 인쇄
    </button>
  );
}
