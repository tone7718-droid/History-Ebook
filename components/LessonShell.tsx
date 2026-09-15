import Link from "next/link";
import type { CurriculumFile, Quiz } from "@/lib/types";
import type { AdjacentLesson } from "@/lib/types";
import { getLessonImages } from "@/lib/lesson-images";
import { Breadcrumb } from "./Breadcrumb";
import { CurriculumNav } from "./CurriculumNav";
import { LessonToc } from "./LessonToc";
import { MarkReadButton } from "./MarkReadButton";
import { PrintLessonButton } from "./PrintLessonButton";
import { MdxContent } from "./MdxContent";
import { QuizPanel } from "./QuizPanel";
import { RelatedLessons } from "./RelatedLessons";
import { GlossaryBoxes } from "./GlossaryBoxes";
import { getGlossaryForKeywords } from "@/lib/glossary";
import { getLessonReferences, getLessonReviewStatus } from "@/lib/content";
import { LessonReferences } from "./LessonReferences";
import type { RelatedLessonLink } from "@/lib/related";

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
  related,
  keywords,
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
  related?: RelatedLessonLink[];
  keywords?: string[];
}) {
  const images = getLessonImages(lessonKey);
  const review = getLessonReviewStatus(lessonKey);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:py-8 lg:flex-row lg:gap-8">
      <CurriculumNav curriculum={curriculum} current={current} />
      <article className="min-w-0 flex-1">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: trackLabel, href: trackHref },
            { label: eraTitle, href: `${trackHref}#era-${current.era}` },
            { label: unitTitle, href: `${trackHref}#era-${current.era}` },
            { label: lessonTitle },
          ]}
        />
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            {lessonTitle}
          </h1>
          {description && (
            <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <MarkReadButton lessonKey={lessonKey} />
            <PrintLessonButton />
          </div>
        </header>
        <LessonToc />
        <div className="prose prose-base prose-neutral max-w-none prose-headings:scroll-mt-28 prose-p:leading-relaxed dark:prose-invert sm:prose-lg">
          <MdxContent source={content} images={images} />
        </div>
        <GlossaryBoxes
          terms={getGlossaryForKeywords(keywords ?? [], {
            title: lessonTitle,
            description,
            track: lessonKey.startsWith("world/") ? "world" : "korean",
          })}
        />
        <RelatedLessons items={related ?? []} />
        <LessonReferences items={getLessonReferences(lessonKey)} review={review} />
        {quiz && (
          <QuizPanel quiz={quiz} lessonKey={lessonKey} href={`/${lessonKey}`} />
        )}
        <nav
          className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 dark:border-slate-800"
          aria-label="이전 다음 차시"
        >
          {adjacent.prev ? (
            <Link
              href={adjacent.prev.href}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm sm:w-auto sm:justify-start hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-900"
            >
              ← {adjacent.prev.title}
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {adjacent.next ? (
            <Link
              href={adjacent.next.href}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm sm:w-auto sm:justify-start hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-900"
            >
              {adjacent.next.title} →
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>
      </article>
    </div>
  );
}
