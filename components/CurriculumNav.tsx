"use client";

import Link from "next/link";
import { useState } from "react";
import type { CurriculumFile } from "@/lib/types";
import { lessonHref, lessonKey, cn } from "@/lib/utils";
import { ProgressBadge } from "./ProgressBadge";

export function CurriculumNav({
  curriculum,
  current,
}: {
  curriculum: CurriculumFile;
  current?: { era: string; unit: string; lesson: string };
}) {
  const [open, setOpen] = useState(false);

  const tree = (
    <nav aria-label="커리큘럼" className="space-y-4 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {curriculum.trackLabel}
      </p>
      {curriculum.eras.map((era) => (
        <div key={era.id}>
          <p className="mb-1 font-semibold text-slate-800 dark:text-slate-100">
            {era.title}
          </p>
          <ul className="space-y-2 border-l border-slate-200 pl-3 dark:border-slate-700">
            {era.units.map((unit) => (
              <li key={unit.id}>
                <p className="mb-1 text-slate-600 dark:text-slate-400">{unit.title}</p>
                <ul className="space-y-1">
                  {unit.lessons.map((lesson) => {
                    const href = lessonHref(
                      curriculum.track,
                      era.id,
                      unit.id,
                      lesson.id
                    );
                    const key = lessonKey(
                      curriculum.track,
                      era.id,
                      unit.id,
                      lesson.id
                    );
                    const active =
                      current?.era === era.id &&
                      current?.unit === unit.id &&
                      current?.lesson === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "block rounded-md px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800",
                            active &&
                              "bg-slate-200 font-medium text-slate-900 dark:bg-slate-700 dark:text-white"
                          )}
                        >
                          {lesson.title}
                          <ProgressBadge lessonKey={key} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          className="min-h-11 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-600"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          커리큘럼 열기
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="닫기"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] overflow-y-auto bg-white p-4 shadow-xl dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">커리큘럼</h2>
              <button
                type="button"
                className="min-h-11 rounded-lg px-3"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
            {tree}
          </div>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          {tree}
        </div>
      </aside>
    </>
  );
}
