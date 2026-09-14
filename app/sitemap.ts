import type { MetadataRoute } from "next";
import { getAllUnitParams, getFlatLessons } from "@/lib/content";

const BASE = "https://history-ebook.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lessons = getFlatLessons();
  const units = [
    ...getAllUnitParams("korean").map((u) => `/korean/${u.era}/${u.unit}`),
    ...getAllUnitParams("world").map((u) => `/world/${u.era}/${u.unit}`),
  ];
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/korean`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/world`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/search`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/review`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/glossary`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/progress`, changeFrequency: "monthly", priority: 0.3 },
    ...units.map((href) => ({
      url: `${BASE}${href}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...lessons.map((l) => ({
      url: `${BASE}${l.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
