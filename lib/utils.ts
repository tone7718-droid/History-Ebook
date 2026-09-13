import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TrackId } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lessonKey(
  track: TrackId,
  era: string,
  unit: string,
  lesson: string
) {
  return `${track}/${era}/${unit}/${lesson}`;
}

export function lessonHref(
  track: TrackId,
  era: string,
  unit: string,
  lesson: string
) {
  return `/${track}/${era}/${unit}/${lesson}`;
}

export const TOC_HEADINGS = [
  "학습목표",
  "배경",
  "핵심사건(연표)",
  "인물",
  "인과·영향",
  "헷갈리기 쉬운 포인트",
  "요약",
] as const;

export function headingToId(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[·\s()（）]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
