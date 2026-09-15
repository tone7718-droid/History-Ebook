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

function readTermsFile(filePath: string): GlossaryTerm[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as GlossaryFile;
    return data.terms ?? [];
  } catch {
    return [];
  }
}

function mergeTerms(base: GlossaryTerm[], extra: GlossaryTerm[]): GlossaryTerm[] {
  const byId = new Map(base.map((t) => [t.id, t]));
  for (const term of extra) {
    const prev = byId.get(term.id);
    byId.set(term.id, prev ? { ...prev, ...term } : term);
  }
  return Array.from(byId.values());
}

export function getGlossaryTerms(): GlossaryTerm[] {
  if (cached) return cached;
  const dir = path.join(process.cwd(), "content");
  cached = mergeTerms(
    readTermsFile(path.join(dir, "glossary.json")),
    readTermsFile(path.join(dir, "glossary-extra.json"))
  );
  return cached;
}
