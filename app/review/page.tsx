import { ReviewClient } from "@/components/ReviewClient";

export const metadata = { title: "오답 노트" };

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">오답 노트</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        퀴즈에서 틀린 문항이 이 브라우저에 모입니다. 다시 풀면 맞힌 문항은
        목록에서 빨집니다.
      </p>
      <ReviewClient />
    </div>
  );
}
