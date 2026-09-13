"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/", label: "홈" },
  { href: "/korean", label: "한국사" },
  { href: "/world", label: "세계사" },
  { href: "/search", label: "검색" },
  { href: "/progress", label: "내 진도" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:gap-3 sm:py-3">
        <Link
          href="/"
          className="mr-auto flex min-h-11 shrink-0 items-center text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-slate-50"
        >
          역사 e-book
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주요">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/search"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          aria-label="검색"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </Link>

        <div className="hidden w-56 md:block lg:w-72">
          <SearchBox compact />
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-950 md:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3"
            aria-label="모바일 주요"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
