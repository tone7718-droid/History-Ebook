import { TimelineView } from "@/components/TimelineView";
import { getTimelineEvents } from "@/lib/timeline";

export const metadata = { title: "세계 연표" };

export default function TimelinePage() {
  const events = getTimelineEvents();
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">한국사 · 세계사 연표</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        같은 시기의 한국사와 세계사를 한 줄로 비교합니다. 항목을 누르면 해당
        차시로 이동합니다.
      </p>
      <TimelineView events={events} />
    </div>
  );
}
