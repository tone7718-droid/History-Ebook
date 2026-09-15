import { ReviewClient } from "@/components/ReviewClient";

export const metadata = { title: "오늘 복습" };

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">오답 노트 · 오늘 복습</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        퀴즈에서 틀린 문항이 이 브라우저에 모입니다. 매일 오래된 문항을 먼저
        넣고 10문항을 섞어 오늘 복습으로 보여 줍니다.
      </p>
      <ReviewClient />
    </div>
  );
}
