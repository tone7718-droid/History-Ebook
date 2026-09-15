"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "홈", match: (p: string) => p === "/" },
  { href: "/korean", label: "한국사", match: (p: string) => p.startsWith("/korean") },
  { href: "/world", label: "세계사", match: (p: string) => p.startsWith("/world") },
  { href: "/timeline", label: "연표", match: (p: string) => p.startsWith("/timeline") },
  { href: "/review", label: "오답", match: (p: string) => p.startsWith("/review") },
  { href: "/glossary", label: "용어", match: (p: string) => p.startsWith("/glossary") },
  { href: "/search", label: "검색", match: (p: string) => p.startsWith("/search") },
  { href: "/progress", label: "진도", match: (p: string) => p.startsWith("/progress") },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header data-site-header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:gap-3 sm:py-3">
        <Link
          href="/"
          className="mr-auto flex min-h-11 shrink-0 items-center text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-slate-50"
        >
          역사 e-book
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요">
          {nav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-lg px-2.5 py-2 text-sm font-medium",
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/search"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          aria-label="검색"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </Link>

        <div className="hidden w-44 lg:block xl:w-64">
          <SearchBox compact />
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="모바일 주요">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base font-medium",
                    active
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
