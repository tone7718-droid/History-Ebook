import fs from "fs";
import path from "path";
import type { TrackId } from "./types";

export type TimelineEvent = {
  year: number;
  label: string;
  track: TrackId | "both";
  href: string;
};

export function getTimelineEvents(): TimelineEvent[] {
  const filePath = path.join(process.cwd(), "content", "timeline.json");
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as { events?: TimelineEvent[] };
    return (data.events ?? []).slice().sort((a, b) => a.year - b.year);
  } catch {
    return [];
  }
}

export function formatYear(year: number): string {
  if (year < 0) return `기원전 ${Math.abs(year)}`;
  return `${year}`;
}
