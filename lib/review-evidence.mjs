/** Validate the record, not the historical truth of its claims. */
export function validReview(record, today = new Date().toISOString().slice(0, 10)) {
  if (!record || typeof record !== "object") return false;
  if (record.status === "pending") return Object.keys(record).every((key) => key === "status");
  const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
  if (record.status !== "reviewed" || !nonempty(record.reviewer) || !nonempty(record.scope)) return false;
  const date = record.reviewedAt;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;
  return Array.isArray(record.sources) && record.sources.length > 0 && record.sources.every((source) => {
    if (!source || !nonempty(source.title) || !nonempty(source.locator)) return false;
    try { return ["https:", "http:"].includes(new URL(source.url).protocol); } catch { return false; }
  });
}
