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
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw) as GlossaryFile;
  cached = data.terms ?? [];
  return cached;
}

export function getGlossaryForKeywords(keywords: string[]): GlossaryTerm[] {
  if (!keywords.length) return [];
  const normalized = keywords.map((k) => k.trim().toLowerCase());
  const hits: GlossaryTerm[] = [];
  for (const term of getGlossaryTerms()) {
    const names = [term.term, ...(term.aliases ?? [])].map((n) =>
      n.trim().toLowerCase()
    );
    const matched = names.some((name) =>
      normalized.some(
        (kw) => kw === name || kw.includes(name) || name.includes(kw)
      )
    );
    if (matched) hits.push(term);
    if (hits.length >= 4) break;
  }
  return hits;
}
