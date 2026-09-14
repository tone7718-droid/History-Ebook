import type { LessonImage } from "./lesson-image-helpers";
import { KOREAN_LESSON_IMAGES } from "./lesson-images-korean";
import { WORLD_LESSON_IMAGES } from "./lesson-images-world";

export type { LessonImage };

const LESSON_IMAGES: Record<string, LessonImage[]> = {
  ...KOREAN_LESSON_IMAGES,
  ...WORLD_LESSON_IMAGES,
};

export function getLessonImages(lessonKey: string): LessonImage[] {
  const list = LESSON_IMAGES[lessonKey];
  if (!list?.length) return [];
  return list.map((img, i) => ({
    ...img,
    after: img.after ?? (i === 0 ? "배경" : "인물"),
  }));
}
