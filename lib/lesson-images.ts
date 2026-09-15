import type { LessonImage } from "./lesson-image-helpers";
import { KOREAN_LESSON_IMAGES } from "./lesson-images-korean";
import { KOREAN_LESSON_IMAGES_2 } from "./lesson-images-korean-2";
import { WORLD_LESSON_IMAGES } from "./lesson-images-world";
import { WORLD_LESSON_IMAGES_2 } from "./lesson-images-world-2";

export type { LessonImage };

const LESSON_IMAGES: Record<string, LessonImage[]> = {
  ...KOREAN_LESSON_IMAGES,
  ...KOREAN_LESSON_IMAGES_2,
  ...WORLD_LESSON_IMAGES,
  ...WORLD_LESSON_IMAGES_2,
};

export function getLessonImages(lessonKey: string): LessonImage[] {
  const list = LESSON_IMAGES[lessonKey];
  if (!list?.length) return [];
  return list.map((img, i) => ({
    ...img,
    after: img.after ?? (i === 0 ? "배경" : "인물"),
  }));
}
