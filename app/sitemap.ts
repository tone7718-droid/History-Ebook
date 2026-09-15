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
    { url: `${BASE}/timeline`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/review`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/glossary`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/progress`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/editorial-policy`, changeFrequency: "yearly", priority: 0.2 },
    ...lessons.map((l) => ({
      url: `${BASE}${l.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
