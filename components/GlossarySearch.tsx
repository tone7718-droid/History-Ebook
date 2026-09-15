"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/lib/glossary";

type TrackFilter = "all" | "korean" | "world" | "both";

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<TrackFilter>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return terms.filter((t) => {
      if (track !== "all") {
        const tt = t.track ?? "both";
        if (track === "both") {
          if (tt !== "both") return false;
        } else if (tt !== track && tt !== "both") {
          return false;
        }
      }
      if (!needle) return true;
      const hay = [t.term, t.definition, ...(t.aliases ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, terms, track]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="block flex-1">
          <span className="sr-only">용어 검색</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="용어·설명 검색"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="과정 필터">
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
              onClick={() => setTrack(id)}
              className={`inline-flex min-h-10 items-center rounded-full border px-3 text-sm ${
                track === id
                  ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 text-sm text-slate-500">{filtered.length}개 용어</p>
      <dl className="space-y-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            id={t.id}
            className="scroll-mt-28 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <dt className="font-semibold text-slate-900 dark:text-slate-50">
              {t.term}
            </dt>
            {t.aliases?.length ? (
              <p className="mt-0.5 text-xs text-slate-500">
                다른 이름: {t.aliases.join(", ")}
              </p>
            ) : null}
            <dd className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
