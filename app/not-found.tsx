import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        존재하지 않는 차시이거나 초안(draft) 콘텐츠입니다.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
      >
        홈으로
      </Link>
    </div>
  );
}
