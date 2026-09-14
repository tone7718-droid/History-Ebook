import Link from "next/link";
import type { GlossaryTerm } from "@/lib/glossary";

export function GlossaryBoxes({ terms }: { terms: GlossaryTerm[] }) {
  if (!terms.length) return null;
  return (
    <section className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          핵심 용어
        </h2>
        <Link
          href="/glossary"
          className="text-sm text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
        >
          용어 사전
        </Link>
      </div>
      <dl className="space-y-3">
        {terms.map((t) => (
          <div key={t.id}>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              {t.term}
            </dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
