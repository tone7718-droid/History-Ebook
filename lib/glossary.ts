import fs from "fs";
import path from "path";

export interface GlossaryTerm {
  id: string;
  term: string;
  aliases?: string[];
  definition: string;
  track?: "korean" | "world" | "both";
}

interface GlossaryFile {
  terms: GlossaryTerm[];
}

let cached: GlossaryTerm[] | null = null;

export function getGlossaryTerms(): GlossaryTerm[] {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "content", "glossary.json");
  try {
    if (!fs.existsSync(filePath)) {
      cached = [];
      return cached;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as GlossaryFile;
    cached = data.terms ?? [];
  } catch {
    cached = [];
  }
  return cached;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[()[\]{}「」『』]/g, " ")
    .replace(/[·・.,/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compact(s: string): string {
  return norm(s).replace(/[\s\-_']/g, "");
}

function tokens(s: string): string[] {
  return norm(s)
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function namesOf(term: GlossaryTerm): { text: string; exact: boolean }[] {
  return [
    { text: term.term, exact: true },
    ...(term.aliases ?? []).map((a) => ({ text: a, exact: false })),
  ];
}

function bounded(hay: string, needle: string): boolean {
  return new RegExp(
    `(?:^|[^0-9a-z가-힣])${needle}(?:$|[^0-9a-z가-힣])`
  ).test(hay);
}

function scoreName(
  name: string,
  keywordList: string[],
  titleN: string,
  titleC: string,
  descN: string,
  descC: string
): number {
  const n = norm(name);
  const c = compact(name);
  if (c.length < 1) return 0;

  let score = 0;
  for (const raw of keywordList) {
    const k = norm(raw);
    const kc = compact(raw);
    if (!k) continue;
    if (k === n || kc === c) {
      score += c.length >= 3 ? 28 : c.length === 2 ? 20 : 16;
      continue;
    }
    if (c.length === 1) {
      if (bounded(k, n)) score += 12;
      continue;
    }
    if (c.length >= 4 && (kc.includes(c) || (kc.length >= 4 && c.includes(kc)))) {
      score += 14;
    } else if (
      c.length >= 3 &&
      n.length >= 3 &&
      (k.includes(n) || (k.length >= 3 && n.includes(k)))
    ) {
      score += 10;
    }
  }

  if (c.length === 1) {
    if (bounded(titleN, n)) score += 10;
  } else if (titleC.includes(c) || titleN.includes(n)) {
    score += c.length >= 3 ? 12 : 8;
  }
  if (c.length >= 3 && (descC.includes(c) || descN.includes(n))) {
    score += 5;
  }

  const titleTok = new Set(tokens(titleN));
  const descTok = new Set(tokens(descN));
  for (const t of tokens(n)) {
    if (titleTok.has(t)) score += 6;
    if (descTok.has(t)) score += 2;
  }
  return score;
}

export function getGlossaryForKeywords(
  keywords: string[],
  opts?: {
    title?: string;
    description?: string;
    track?: "korean" | "world";
  }
): GlossaryTerm[] {
  const titleN = norm(opts?.title ?? "");
  const descN = norm(opts?.description ?? "");
  const titleC = compact(titleN);
  const descC = compact(descN);
  const kws = keywords.map((k) => k.trim()).filter(Boolean);
  if (!kws.length && !titleN) return [];

  const ranked = getGlossaryTerms()
    .map((term) => {
      let score = 0;
      for (const name of namesOf(term)) {
        const s = scoreName(name.text, kws, titleN, titleC, descN, descC);
        score += name.exact ? s : Math.round(s * 0.88);
      }
      if (
        score > 0 &&
        opts?.track &&
        (term.track === opts.track || term.track === "both")
      ) {
        score += 3;
      } else if (
        score > 0 &&
        opts?.track &&
        term.track &&
        term.track !== "both" &&
        term.track !== opts.track
      ) {
        score -= 6;
      }
      return { term, score };
    })
    .filter((x) => x.score >= 8)
    .sort(
      (a, b) => b.score - a.score || b.term.term.length - a.term.term.length
    );

  const hits: GlossaryTerm[] = [];
  for (const item of ranked) {
    if (hits.some((h) => h.id === item.term.id)) continue;
    hits.push(item.term);
    if (hits.length >= 4) break;
  }
  return hits;
}
