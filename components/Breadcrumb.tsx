import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="브레드크럼"
      className="mb-4 text-sm text-slate-600 dark:text-slate-400"
    >
      <ol className="flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const collapseMiddle = items.length > 3 && i > 0 && i < items.length - 2;
          return (
            <li
              key={`${item.label}-${i}`}
              className={`flex shrink-0 items-center gap-1 ${collapseMiddle ? "hidden sm:flex" : ""}`}
            >
              {i > 0 && (
                <span aria-hidden="true" className="text-slate-400">
                  ›
                </span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="max-w-[10rem] truncate hover:text-slate-900 dark:hover:text-slate-100 sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`font-medium text-slate-900 dark:text-slate-100 ${isLast ? "max-w-[12rem] truncate sm:max-w-[20rem]" : ""}`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
