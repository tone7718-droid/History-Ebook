import Link from "next/link";
import { ContinueLearning } from "@/components/ContinueLearning";
import { SearchBox } from "@/components/SearchBox";
import { getCurriculum, getFlatLessons, getLessonCount } from "@/lib/content";

export default function HomePage() {
  const lessons = getFlatLessons();
  const hrefByKey = Object.fromEntries(
    lessons.map((l) => [
      l.lessonKey,
      { href: l.href, title: l.title, trackLabel: l.trackLabel },
    ])
  );
  const korean = getCurriculum("korean");
  const world = getCurriculum("world");
  const firstKorean = korean.eras[0]?.units[0]?.lessons[0];
  const firstWorld = world.eras[0]?.units[0]?.lessons[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          역사 e-book
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          한국사와 세계사를 시대 → 단원 → 차시로 읽고, 퀴즈로 복습하고, 이
          브라우저에 진도를 저장하는 학습용 e-book입니다.
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            한국사
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            선사부터 현대까지 정치·사회·문화의 흐름을 차시로 학습합니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            공개 차시 {getLessonCount("korean")}개 · 시대 {korean.eras.length}개
          </p>
          {firstKorean && (
            <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              첫 차시: {firstKorean.title}
            </p>
          )}
        </Link>
        <Link
          href="/world"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            세계사
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            문명의 성립부터 현대 지구촌 과제까지 세계사 핵심 주제를 정리합니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            공개 차시 {getLessonCount("world")}개 · 시대 {world.eras.length}개
          </p>
          {firstWorld && (
            <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              첫 차시: {firstWorld.title}
            </p>
          )}
        </Link>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <EraList track="korean" title="한국사 시대" curriculum={korean} />
        <EraList track="world" title="세계사 시대" curriculum={world} />
      </section>
    </div>
  );
}

function EraList({
  track,
  title,
  curriculum,
}: {
  track: "korean" | "world";
  title: string;
  curriculum: ReturnType<typeof getCurriculum>;
}) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <ul className="space-y-1">
        {curriculum.eras.map((era) => (
          <li key={era.id}>
            <Link
              href={`/${track}#era-${era.id}`}
              className="inline-flex min-h-10 items-center text-slate-800 underline-offset-2 hover:underline dark:text-slate-100"
            >
              {era.title}
              <span className="ml-2 text-sm text-slate-500">
                {era.units.reduce((n, u) => n + u.lessons.length, 0)}차시
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
