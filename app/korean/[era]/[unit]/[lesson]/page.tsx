import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonShell } from "@/components/LessonShell";
import {
  getAdjacentLessons,
  getAllLessonParams,
  getCurriculum,
  getLesson,
} from "@/lib/content";
import { getRelatedLessons } from "@/lib/related";

type Params = { era: string; unit: string; lesson: string };

export function generateStaticParams() {
  return getAllLessonParams("korean");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { era, unit, lesson } = await params;
  const data = await getLesson("korean", era, unit, lesson);
  if (!data) return { title: "차시 없음" };
  return {
    title: data.lessonTitle,
    description: data.frontmatter.description,
  };
}

export default async function KoreanLessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { era, unit, lesson } = await params;
  const data = await getLesson("korean", era, unit, lesson);
  if (!data) notFound();

  const curriculum = getCurriculum("korean");
  const adjacent = getAdjacentLessons("korean", era, unit, lesson);

  return (
    <LessonShell
      curriculum={curriculum}
      current={{ era, unit, lesson }}
      trackLabel={data.trackLabel}
      eraTitle={data.eraTitle}
      unitTitle={data.unitTitle}
      lessonTitle={data.lessonTitle}
      description={data.frontmatter.description}
      content={data.content}
      quiz={data.quiz}
      lessonKey={data.lessonKey}
      adjacent={adjacent}
      related={getRelatedLessons(data.lessonKey)}
      keywords={data.frontmatter.keywords}
      trackHref="/korean"
    />
  );
}
