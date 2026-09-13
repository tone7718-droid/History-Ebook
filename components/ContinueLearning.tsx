"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readProgress } from "@/lib/progress";

export function ContinueLearning({
  hrefByKey,
}: {
  hrefByKey: Record<string, { href: string; title: string; trackLabel: string }>;
}) {
  const [item, setItem] = useState<{
    href: string;
    title: string;
    trackLabel: string;
  } | null>(null);

  useEffect(() => {
    const store = readProgress();
    if (store.lastVisited && hrefByKey[store.lastVisited]) {
      setItem(hrefByKey[store.lastVisited]);
    }
  }, [hrefByKey]);

  if (!item) return null;

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
      <p className="mb-1 text-sm font-medium text-indigo-800 dark:text-indigo-200">
        이어서 학습
      </p>
      <p className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {item.trackLabel} · {item.title}
      </p>
      <Link
        href={item.href}
        className="inline-flex min-h-11 items-center rounded-lg bg-indigo-700 px-4 text-sm font-medium text-white hover:bg-indigo-600"
      >
        이어하기
      </Link>
    </div>
  );
}
