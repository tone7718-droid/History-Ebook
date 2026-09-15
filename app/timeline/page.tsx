import Link from "next/link";
import { formatYear, getTimelineEvents } from "@/lib/timeline";

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
      <ol className="relative border-l border-slate-300 pl-6 dark:border-slate-700">
        {events.map((ev, i) => {
          const tone =
            ev.track === "korean"
              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
              : ev.track === "world"
                ? "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200"
                : "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200";
          const tag = ev.track === "korean" ? "한국사" : ev.track === "world" ? "세계사" : "공통";
          return (
            <li key={`${ev.year}-${i}`} className="mb-6 last:mb-0">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-500" />
              <p className="text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                {formatYear(ev.year)}
              </p>
              <Link
                href={ev.href}
                className="mt-1 block rounded-xl border border-slate-200 p-3 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
              >
                <span className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>
                  {tag}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{ev.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
