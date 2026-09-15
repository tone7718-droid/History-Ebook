"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatYear, type TimelineEvent } from "@/lib/timeline";

type Filter = "all" | "korean" | "world";

export function TimelineView({ events }: { events: TimelineEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = useMemo(
    () =>
      events.filter((ev) => {
        if (filter === "all") return true;
        return ev.track === filter || ev.track === "both";
      }),
    [events, filter]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="연표 필터">
        {(
          [
            ["all", "전체"],
            ["korean", "한국사"],
            ["world", "세계사"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`inline-flex min-h-10 items-center rounded-full border px-3 text-sm ${
              filter === id
                ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="self-center text-sm text-slate-500">{shown.length}건</span>
      </div>
      <ol className="relative border-l border-slate-300 pl-6 dark:border-slate-700">
        {shown.map((ev, i) => {
          const tone =
            ev.track === "korean"
              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
              : ev.track === "world"
                ? "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200"
                : "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200";
          const tag =
            ev.track === "korean" ? "한국사" : ev.track === "world" ? "세계사" : "공통";
          return (
            <li key={`${ev.year}-${ev.label}-${i}`} className="mb-6 last:mb-0">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-500" />
              <p className="text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                {formatYear(ev.year)}
              </p>
              <Link
                href={ev.href}
                className="mt-1 block rounded-xl border border-slate-200 p-3 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
              >
                <span
                  className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}
                >
                  {tag}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {ev.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
