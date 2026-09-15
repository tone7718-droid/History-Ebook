import credits from "@/content/image-credits.json";

export type LessonImage = {
  src: string;
  caption: string;
  credit: string;
  href?: string;
  license?: string;
  licenseHref?: string;
  after?: string;
};

function metadata(file: string) {
  const normalized = file.replace(/_/g, " ");
  const files = credits.files as Record<string, { artist: string; license: string; licenseUrl: string | null; sourceUrl: string }>;
  const hit = files[file] ?? files[normalized];
  return hit
    ? { credit: hit.artist, license: hit.license, licenseHref: hit.licenseUrl ?? undefined, href: hit.sourceUrl }
    : { credit: "저작자 정보 확인 필요", license: "라이선스 정보 확인 필요", href: filePage(file) };
}

export function commons(file: string, width = 960): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

export function filePage(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
}

export function filenameFromSrc(src: string): string | null {
  try {
    const clean = src.split("?")[0];
    const name = decodeURIComponent(clean.split("/").pop() || "");
    return name || null;
  } catch {
    return null;
  }
}

export function c(file: string, caption: string, after?: string): LessonImage {
  const meta = metadata(file);
  return {
    src: commons(file),
    caption,
    ...meta,
    after,
  };
}

export function u(src: string, caption: string, after?: string): LessonImage {
  const file = filenameFromSrc(src);
  if (file) {
    return {
      src: commons(file, 960),
      caption,
      ...metadata(file),
      after,
    };
  }
  return {
    src: src.split("?")[0],
    caption,
    credit: "위키미디어 공용",
    after,
  };
}
