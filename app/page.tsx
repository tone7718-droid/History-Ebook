import Link from "next/link";
import { ContinueLearning } from "@/components/ContinueLearning";
import { SearchBox } from "@/components/SearchBox";
import { getFlatLessons, getLessonCount } from "@/lib/content";

export default function HomePage() {
  const lessons = getFlatLessons();
  const hrefByKey = Object.fromEntries(
    lessons.map((l) => [
      l.lessonKey,
      { href: l.href, title: l.title, trackLabel: l.trackLabel },
    ])
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          역사 e-book
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          한국사와 세계사를 시대 → 단원 → 차시로 읽고, 퀴즈로 복습하고, 브라우저에
          진도를 저장하는 학습용 e-book입니다.
        </p>
        <div className="mt-6 w-full max-w-xl">
          <SearchBox />
        </div>
      </section>

      <section className="mb-8">
        <ContinueLearning hrefByKey={hrefByKey} />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/korean"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">한국사</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            고려부터 이어지는 정치·제도의 흐름을 차시로 학습합니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            공개 차시 {getLessonCount("korean")}개
          </p>
        </Link>
        <Link
          href="/world"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">세계사</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            이슬람 세계의 형성 등 세계사 핵심 주제를 정리합니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            공개 차시 {getLessonCount("world")}개
          </p>
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">시드 차시</h2>
        <ul className="space-y-2">
          {lessons.map((l) => (
            <li key={l.lessonKey}>
              <Link
                href={l.href}
                className="text-indigo-700 hover:underline dark:text-indigo-300"
              >
                [{l.trackLabel}] {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
