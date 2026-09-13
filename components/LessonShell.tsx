import Link from "next/link";
import type { CurriculumFile, Quiz } from "@/lib/types";
import type { AdjacentLesson } from "@/lib/types";
import { Breadcrumb } from "./Breadcrumb";
import { CurriculumNav } from "./CurriculumNav";
import { LessonToc } from "./LessonToc";
import { MarkReadButton } from "./MarkReadButton";
import { MdxContent } from "./MdxContent";
import { QuizPanel } from "./QuizPanel";

export function LessonShell({
  curriculum,
  current,
  trackLabel,
  eraTitle,
  unitTitle,
  lessonTitle,
  description,
  content,
  quiz,
  lessonKey,
  adjacent,
  trackHref,
}: {
  curriculum: CurriculumFile;
  current: { era: string; unit: string; lesson: string };
  trackLabel: string;
  eraTitle: string;
  unitTitle: string;
  lessonTitle: string;
  description?: string;
  content: string;
  quiz: Quiz | null;
  lessonKey: string;
  adjacent: AdjacentLesson;
  trackHref: string;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <CurriculumNav curriculum={curriculum} current={current} />
      <article className="min-w-0 flex-1">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: trackLabel, href: trackHref },
            { label: eraTitle },
            { label: unitTitle },
            { label: lessonTitle },
          ]}
        />
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {lessonTitle}
          </h1>
          {description && (
            <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
          )}
          <div className="mt-4">
            <MarkReadButton lessonKey={lessonKey} />
          </div>
        </header>
        <LessonToc />
        <div className="prose prose-neutral max-w-none prose-headings:scroll-mt-28 dark:prose-invert">
          <MdxContent source={content} />
        </div>
        {quiz && <QuizPanel quiz={quiz} lessonKey={lessonKey} />}
        <nav
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800"
          aria-label="이전 다음 차시"
        >
          {adjacent.prev ? (
            <Link
              href={adjacent.prev.href}
              className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-900"
            >
              ← {adjacent.prev.title}
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link
              href={adjacent.next.href}
              className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-900"
            >
              {adjacent.next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
