import { ProgressSummary } from "@/components/ProgressSummary";
import { getFlatLessons } from "@/lib/content";

export const metadata = { title: "내 진도" };

export default function ProgressPage() {
  const lessons = getFlatLessons();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">내 진도</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        진도는 이 브라우저의 localStorage(
        <code className="text-sm">history-ebook:progress:v1</code>)에만
        저장됩니다. 서버 동기화는 없습니다.
      </p>
      <ProgressSummary lessons={lessons} />
    </div>
  );
}
