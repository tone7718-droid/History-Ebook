import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { searchLessons } from "@/lib/search";

export const metadata = { title: "검색" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? searchLessons(q) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">검색</h1>
      <SearchBox initialQuery={q} />

      <div className="mt-8">
        {!q.trim() ? (
          <p className="text-slate-600 dark:text-slate-400">
            차시 제목·키워드·본문을 검색해 보세요.
          </p>
        ) : results.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">
            검색 결과가 없습니다
          </p>
        ) : (
          <ul className="space-y-4">
            {results.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <Link
                  href={r.href}
                  className="text-lg font-semibold text-slate-900 underline-offset-2 hover:underline dark:text-slate-50"
                >
                  {r.title}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  {r.track === "korean" ? "한국사" : "세계사"} · {r.eraTitle} ·{" "}
                  {r.unitTitle}
                </p>
                {r.snippet && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {r.snippet}
                  </p>
                )}
                {r.keywords.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    {r.keywords.slice(0, 6).join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
