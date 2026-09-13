export function extractWorkId(key: string): string {
  const parts = key.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? key;
}

export function isWorkId(value: string): boolean {
  return /^OL\d+[Ww]$/.test(value);
}

export function pickIsbn(isbns?: string[]): string | undefined {
  if (!isbns?.length) return undefined;
  const normalized = isbns.map((isbn) => isbn.replace(/[-\s]/g, ""));
  return (
    normalized.find((isbn) => isbn.length === 13) ??
    normalized.find((isbn) => isbn.length === 10) ??
    normalized[0]
  );
}

export function formatAuthors(names?: string[]): string {
  if (!names?.length) return "Unknown author";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names[0]} and ${names.length - 1} more`;
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeDescription(
  description?: string | { value?: string },
): string {
  if (!description) return "";
  const raw = typeof description === "string" ? description : (description.value ?? "");
  return stripHtml(raw);
}

export function excerpt(text: string, max = 170): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
