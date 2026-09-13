import { TrackOverview } from "@/components/TrackOverview";
import { getCurriculum } from "@/lib/content";

export const metadata = { title: "한국사" };

export default function KoreanTrackPage() {
  return <TrackOverview curriculum={getCurriculum("korean")} />;
}
