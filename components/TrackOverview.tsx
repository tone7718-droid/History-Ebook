import Link from "next/link";
import type { CurriculumFile } from "@/lib/types";
import { lessonHref } from "@/lib/utils";

export function TrackOverview({
  curriculum,
}: {
  curriculum: CurriculumFile;
}) {
  const total = curriculum.eras.reduce(
    (n, era) => n + era.units.reduce((u, unit) => u + unit.lessons.length, 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
        {curriculum.trackLabel}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        시대·지역 → 단원 → 차시 순으로 읽습니다. 공개 차시 {total}개.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="시대 바로가기">
        {curriculum.eras.map((era) => (
          <a
            key={era.id}
            href={`#era-${era.id}`}
            className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {era.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {curriculum.eras.map((era) => {
          const count = era.units.reduce((n, u) => n + u.lessons.length, 0);
          return (
            <section
              key={era.id}
              id={`era-${era.id}`}
              className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {era.title}
                </h2>
                <p className="text-sm text-slate-500">{count}차시</p>
              </div>
              {era.description && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {era.description}
                </p>
              )}
              <div className="mt-4 space-y-4">
                {era.units.map((unit) => (
                  <div key={unit.id}>
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">
                      {unit.title}
                    </h3>
                    <Link href={`/${curriculum.track}/${era.id}/${unit.id}/review`} className="mt-1 inline-flex min-h-10 items-center text-sm font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300">
                      단원 종합 퀴즈
                    </Link>
                    <ul className="mt-2 space-y-1">
                      {unit.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={lessonHref(
                              curriculum.track,
                              era.id,
                              unit.id,
                              lesson.id
                            )}
                            className="inline-flex min-h-11 items-center py-1 text-slate-800 underline-offset-2 hover:underline dark:text-slate-100"
                          >
                            {lesson.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
