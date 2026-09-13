import { TrackOverview } from "@/components/TrackOverview";
import { getCurriculum } from "@/lib/content";

export const metadata = { title: "세계사" };

export default function WorldTrackPage() {
  return <TrackOverview curriculum={getCurriculum("world")} />;
}
