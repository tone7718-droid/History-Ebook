import Link from "next/link";
import { getCurriculum, getFlatLessons } from "@/lib/content";
import { lessonHref } from "@/lib/utils";

export const metadata = { title: "한국사" };

export default function KoreanTrackPage() {
  const curriculum = getCurriculum("korean");
  const lessons = getFlatLessons("korean");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        {curriculum.trackLabel}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        시대를 고른 뒤 단원·차시로 이동합니다. 공개 차시 {lessons.length}개.
      </p>

      <div className="mt-8 space-y-8">
        {curriculum.eras.map((era) => (
          <section
            key={era.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
          >
            <h2 className="text-xl font-semibold">{era.title}</h2>
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
                  <ul className="mt-2 space-y-1">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={lessonHref("korean", era.id, unit.id, lesson.id)}
                          className="text-indigo-700 hover:underline dark:text-indigo-300"
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
        ))}
      </div>
    </div>
  );
}
