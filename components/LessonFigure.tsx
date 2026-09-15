"use client";

import { useState } from "react";

export function LessonFigure({
  src,
  caption,
  credit,
  href,
  license,
  licenseHref,
}: {
  src: string;
  caption: string;
  credit?: string;
  href?: string;
  license?: string;
  licenseHref?: string;
}) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="bg-slate-100 dark:bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          className="mx-auto max-h-[28rem] w-full object-contain print:max-h-64"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHidden(true)}
        />
      </div>
      <figcaption className="space-y-0.5 px-3 py-2.5 text-sm leading-snug text-slate-600 dark:text-slate-400">
        <p className="font-medium text-slate-800 dark:text-slate-200">{caption}</p>
        {credit && (
          <p className="text-xs">
            {href ? (
              <a href={href} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                출처: {credit}
              </a>
            ) : (
              <>출처: {credit}</>
            )}
          </p>
        )}
        {license && (
          <p className="text-xs">
            {licenseHref ? (
              <a href={licenseHref} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                이용 조건: {license}
              </a>
            ) : (
              <>이용 조건: {license}</>
            )}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
