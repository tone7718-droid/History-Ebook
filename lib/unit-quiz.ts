import type { QuizQuestion } from "./types";

// Round-robin by lesson; least-seen questions first. Deterministic initial
// selection keeps server rendering and hydration identical.
export function selectUnitQuestions(
  questions: QuizQuestion[],
  seen: Record<string, number> = {},
  attempt = 0,
  limit = 10,
): QuizQuestion[] {
  const groups = new Map<string, QuizQuestion[]>();
  for (const question of questions) {
    const key = question.sourceLessonKey ?? "unknown";
    groups.set(key, [...(groups.get(key) ?? []), question]);
  }
  const lists = [...groups.values()];
  if (!lists.length || limit <= 0) return [];
  const offset = attempt % lists.length;
  const rotated = [...lists.slice(offset), ...lists.slice(0, offset)].map((list) =>
    [...list].sort((a, b) => (seen[a.id] ?? 0) - (seen[b.id] ?? 0))
  );
  const selected: QuizQuestion[] = [];
  for (let round = 0; selected.length < limit; round += 1) {
    let added = false;
    for (const list of rotated) {
      if (list[round] && selected.length < limit) {
        selected.push(list[round]);
        added = true;
      }
    }
    if (!added) break;
  }
  return selected;
}
