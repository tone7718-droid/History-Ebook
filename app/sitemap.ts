import type { MetadataRoute } from "next";
import { getFlatLessons } from "@/lib/content";

const BASE = "https://history-ebook.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lessons = getFlatLessons();
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/korean`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/world`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/search`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/progress`, changeFrequency: "monthly", priority: 0.3 },
    ...lessons.map((l) => ({
      url: `${BASE}${l.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
