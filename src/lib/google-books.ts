import { GOOGLE_BOOKS_ORIGIN } from "./constants";
import { fetchJson, OpenLibraryError } from "./openlibrary";
import type { BookDetail, SearchDoc, SearchQuery, SearchResponse } from "./types";
import { hasHangul, normalizeDescription, pickIsbn } from "./utils";

type GoogleImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
};

type GoogleVolumeInfo = {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: GoogleImageLinks;
  industryIdentifiers?: Array<{ type?: string; identifier?: string }>;
  language?: string;
  infoLink?: string;
  previewLink?: string;
};

type GoogleVolume = {
  id: string;
  volumeInfo?: GoogleVolumeInfo;
};

type GoogleVolumesResponse = {
  totalItems?: number;
  items?: GoogleVolume[];
};

type FetchOptions = {
  signal?: AbortSignal;
  revalidate?: number | false;
  timeoutMs?: number;
};

export function toGoogleWorkId(volumeId: string): string {
  return `gb-${volumeId}`;
}

export function googleVolumeId(workId: string): string {
  return decodeURIComponent(workId).replace(/^gb-/, "");
}

export function googleCoverUrl(links?: GoogleImageLinks): string | undefined {
  const raw =
    links?.large ||
    links?.medium ||
    links?.thumbnail ||
    links?.small ||
    links?.smallThumbnail;
  if (!raw) return undefined;
  return raw
    .replace(/^http:\/\//, "https://")
    .replace("zoom=1", "zoom=2")
    .replace("&edge=curl", "");
}

function yearFromDate(value?: string): number | undefined {
  if (!value) return undefined;
  const year = Number.parseInt(value.slice(0, 4), 10);
  return Number.isFinite(year) ? year : undefined;
}

function isbnsFromVolume(info?: GoogleVolumeInfo): string[] {
  return (info?.industryIdentifiers ?? [])
    .map((item) => item.identifier)
    .filter((value): value is string => Boolean(value));
}

export function googleVolumeToSearchDoc(volume: GoogleVolume): SearchDoc | null {
  const info = volume.volumeInfo;
  const title = info?.title?.trim();
  if (!volume.id || !title) return null;

  return {
    key: toGoogleWorkId(volume.id),
    catalogId: toGoogleWorkId(volume.id),
    title,
    author_name: info?.authors,
    first_publish_year: yearFromDate(info?.publishedDate),
    cover_url: googleCoverUrl(info?.imageLinks),
    isbn: isbnsFromVolume(info),
    publisher: info?.publisher ? [info.publisher] : undefined,
    number_of_pages_median: info?.pageCount,
    subject: info?.categories,
  };
}

function googleVolumeToDetail(volume: GoogleVolume): BookDetail {
  const info = volume.volumeInfo ?? {};
  const workId = toGoogleWorkId(volume.id);
  return {
    workId,
    title: info.title?.trim() || "Untitled",
    description: normalizeDescription(info.description),
    authors: info.authors ?? [],
    coverUrl: googleCoverUrl(info.imageLinks),
    subjects: (info.categories ?? []).filter(Boolean).slice(0, 16),
    publishers: info.publisher ? [info.publisher] : [],
    pageCount: info.pageCount,
    firstPublishYear: yearFromDate(info.publishedDate),
    isbn: pickIsbn(isbnsFromVolume(info)),
    sourceLabel: "Google Books",
    sourceUrl: info.infoLink || info.previewLink,
  };
}

function buildGoogleQuery(query: SearchQuery): { q: string; langRestrict?: string } {
  const text = query.q?.trim() ?? "";
  const subject = query.subject?.trim() ?? "";

  if (subject === "korean") {
    return { q: text || "한국문학", langRestrict: "ko" };
  }

  if (hasHangul(text)) {
    return { q: text, langRestrict: "ko" };
  }

  if (subject && text) {
    return { q: `${text} subject:${subject}` };
  }
  if (subject) {
    return { q: `subject:${subject}` };
  }
  return { q: text };
}

export async function searchGoogleBooks(
  query: SearchQuery,
  options: FetchOptions = {},
): Promise<SearchResponse> {
  const built = buildGoogleQuery(query);
  if (!built.q) {
    return { num_found: 0, start: 0, docs: [] };
  }

  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 40);
  const url = new URL(`${GOOGLE_BOOKS_ORIGIN}/volumes`);
  url.searchParams.set("q", built.q);
  url.searchParams.set("printType", "books");
  url.searchParams.set("maxResults", String(limit));
  url.searchParams.set("startIndex", String(Math.max(0, (page - 1) * limit)));
  if (built.langRestrict) {
    url.searchParams.set("langRestrict", built.langRestrict);
  }

  const data = await fetchJson<GoogleVolumesResponse>(url.toString(), {
    ...options,
    revalidate: options.revalidate ?? 60,
  });

  const docs = (data.items ?? [])
    .map(googleVolumeToSearchDoc)
    .filter((doc): doc is SearchDoc => Boolean(doc));

  return {
    num_found: data.totalItems ?? docs.length,
    start: (page - 1) * limit,
    docs,
  };
}

export async function getGoogleBookDetail(
  workId: string,
  options: FetchOptions = {},
): Promise<BookDetail> {
  const volumeId = googleVolumeId(workId);
  if (!volumeId) {
    throw new OpenLibraryError("NOT_FOUND", 404);
  }

  const volume = await fetchJson<GoogleVolume>(
    `${GOOGLE_BOOKS_ORIGIN}/volumes/${encodeURIComponent(volumeId)}`,
    { ...options, revalidate: options.revalidate ?? 86_400 },
  );
  if (!volume.id) {
    throw new OpenLibraryError("NOT_FOUND", 404);
  }
  return googleVolumeToDetail(volume);
}
