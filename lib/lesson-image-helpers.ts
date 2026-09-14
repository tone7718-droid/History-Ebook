export type LessonImage = {
  src: string;
  caption: string;
  credit: string;
  href?: string;
  after?: string;
};

export function commons(file: string, width = 960): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

export function filePage(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
}

export function c(file: string, caption: string, after?: string): LessonImage {
  return {
    src: commons(file),
    caption,
    credit: "위키미디어 공용",
    href: filePage(file),
    after,
  };
}

export function u(src: string, caption: string, after?: string): LessonImage {
  const clean = src.split("?")[0];
  return {
    src: clean,
    caption,
    credit: "위키미디어 공용",
    after,
  };
}
