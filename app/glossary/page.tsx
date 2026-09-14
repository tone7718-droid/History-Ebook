import { getGlossaryTerms } from "@/lib/glossary";

export const metadata = { title: "용어 사전" };

export default function GlossaryPage() {
  const terms = [...getGlossaryTerms()].sort((a, b) =>
    a.term.localeCompare(b.term, "ko")
  );
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">용어 사전</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        한국사·세계사 차시에서 자주 나오는 핵심 개념을 짦게 풀어 둡니다. 차시
        본문 아래에도 관련 용어 상자가 붙습니다.
      </p>
      <dl className="space-y-4">
        {terms.map((t) => (
          <div
            key={t.id}
            id={t.id}
            className="scroll-mt-28 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <dt className="font-semibold text-slate-900 dark:text-slate-50">
              {t.term}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
