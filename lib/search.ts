import FlexSearch from "flexsearch";
import type { SearchDocument } from "./types";
import { buildSearchDocuments } from "./content";

export type SearchResult = SearchDocument & { snippet?: string };

let cachedDocs: SearchDocument[] | null = null;
// flexsearch 0.8 typings vary; keep index untyped
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedIndex: any = null;

function getDocs() {
  if (!cachedDocs) cachedDocs = buildSearchDocuments();
  return cachedDocs;
}

function getIndex() {
  if (cachedIndex) return cachedIndex;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DocumentIndex = (FlexSearch as any).Document;
  const index = new DocumentIndex({
    document: {
      id: "id",
      index: [
        "title",
        "keywords",
        "bodyText",
        "description",
        "eraTitle",
        "unitTitle",
      ],
      store: true,
    },
    tokenize: "forward",
  });
  for (const doc of getDocs()) {
    index.add(doc);
  }
  cachedIndex = index;
  return index;
}

function makeSnippet(text: string, q: string, max = 120): string {
  const lower = text.toLowerCase();
  const needle = q.toLowerCase().trim();
  const idx = lower.indexOf(needle);
  if (idx < 0) {
    return text.slice(0, max) + (text.length > max ? "…" : "");
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + needle.length + 60);
  let snip = text.slice(start, end);
  if (start > 0) snip = "…" + snip;
  if (end < text.length) snip = snip + "…";
  return snip;
}

export function searchLessons(q: string, limit = 20): SearchResult[] {
  const query = q.trim();
  if (!query) return [];

  const docs = getDocs();
  const lower = query.toLowerCase();
  const simpleHits = docs.filter((d) => {
    const hay = [
      d.title,
      d.description ?? "",
      d.eraTitle,
      d.unitTitle,
      d.keywords.join(" "),
      d.bodyText,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(lower) || d.keywords.some((k) => k.includes(query));
  });

  let results = simpleHits;
  try {
    const index = getIndex();
    const flexResults = index.search(query, { limit, enrich: true }) as Array<{
      result?: Array<{ id: string; doc?: SearchDocument }>;
    }>;
    const seen = new Set<string>();
    const fromFlex: SearchDocument[] = [];
    for (const group of flexResults) {
      for (const item of group.result ?? []) {
        if (item.doc && !seen.has(item.doc.id)) {
          seen.add(item.doc.id);
          fromFlex.push(item.doc);
        }
      }
    }
    if (fromFlex.length > 0) {
      const map = new Map<string, SearchDocument>();
      for (const d of [...fromFlex, ...simpleHits]) map.set(d.id, d);
      results = Array.from(map.values());
    }
  } catch {
    // keep simpleHits
  }

  return results.slice(0, limit).map((d) => ({
    ...d,
    snippet: makeSnippet(
      d.description ? `${d.description} ${d.bodyText}` : d.bodyText,
      query
    ),
  }));
}

export function getSearchIndexJson() {
  return buildSearchDocuments();
}
