import fs from "fs";
import path from "path";
import type { TrackId } from "./types";

export type TimelineEvent = {
  year: number;
  label: string;
  track: TrackId | "both";
  href: string;
  approximate?: boolean;
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

export function formatYear(year: number, approximate = false): string {
  const label = year < 0 ? `기원전 ${Math.abs(year)}` : `${year}`;
  return approximate ? `약 ${label}` : label;
}
