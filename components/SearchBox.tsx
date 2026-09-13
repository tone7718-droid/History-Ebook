"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

export function SearchBox({
  compact = false,
  initialQuery = "",
}: {
  compact?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} className="w-full" role="search">
      <label className="sr-only" htmlFor={compact ? "header-search" : "search-q"}>
        차시·키워드 검색
      </label>
      <div className="flex gap-2">
        <input
          id={compact ? "header-search" : "search-q"}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="차시·키워드 검색"
          className={cn(
            "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-slate-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
            compact && "min-h-10"
          )}
        />
        {!compact && (
          <button
            type="submit"
            className="min-h-11 shrink-0 rounded-lg bg-slate-800 px-4 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
          >
            검색
          </button>
        )}
      </div>
    </form>
  );
}
