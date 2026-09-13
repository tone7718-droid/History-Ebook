import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";

const nav = [
  { href: "/", label: "홈" },
  { href: "/korean", label: "한국사" },
  { href: "/world", label: "세계사" },
  { href: "/search", label: "검색" },
  { href: "/progress", label: "내 진도" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="mr-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50"
        >
          역사 e-book
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-1" aria-label="주요">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden w-56 md:block lg:w-72">
          <SearchBox compact />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
