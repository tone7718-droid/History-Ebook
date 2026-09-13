"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  const currentTitle = (() => {
    if (!current) return null;
    for (const era of curriculum.eras) {
      for (const unit of era.units) {
        const lesson = unit.lessons.find((item) => item.id === current.lesson);
        if (era.id === current.era && unit.id === current.unit && lesson) {
          return lesson.title;
        }
      }
    }
    return null;
  })();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, [current?.era, current?.unit, current?.lesson, open]);

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
                <ul className="space-y-0.5">
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
                          ref={active ? activeRef : undefined}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "block rounded-md px-2 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800",
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
      <div className="w-full shrink-0 lg:hidden">
        <button
          type="button"
          className="min-h-11 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-left text-sm font-medium dark:border-slate-600"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          <span className="block text-xs font-normal text-slate-500">커리큘럼</span>
          <span className="block truncate">{currentTitle ?? "차시 목차 열기"}</span>
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
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl dark:bg-slate-950 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <h2 className="font-semibold">커리큘럼</h2>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{tree}</div>
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
