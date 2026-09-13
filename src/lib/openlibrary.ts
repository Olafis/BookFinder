import {
  OPEN_LIBRARY_COVERS,
  OPEN_LIBRARY_ORIGIN,
  SEARCH_FIELDS,
  SEARCH_PAGE_SIZE,
} from "./constants";
import type { SearchQuery, SearchResponse } from "./types";

export class OpenLibraryError extends Error {
  readonly code: "RATE_LIMIT" | "NOT_FOUND" | "NETWORK";
  readonly status?: number;

  constructor(code: OpenLibraryError["code"], status?: number) {
    super(code);
    this.name = "OpenLibraryError";
    this.code = code;
    this.status = status;
  }
}

type FetchOptions = {
  signal?: AbortSignal;
  revalidate?: number | false;
};

async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const onAbort = () => controller.abort();
  options.signal?.addEventListener("abort", onAbort);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (typeof window === "undefined") {
      headers["User-Agent"] = "BookFinder/1.0 (global book search; Vercel)";
    }

    const init: RequestInit & { next?: { revalidate: number } } = {
      signal: controller.signal,
      headers,
    };

    if (typeof window === "undefined" && options.revalidate !== false) {
      init.next = { revalidate: options.revalidate ?? 86_400 };
    }

    const response = await fetch(url, init);

    if (response.status === 404) {
      throw new OpenLibraryError("NOT_FOUND", 404);
    }

    if (response.status === 429 || response.status === 503 || response.status === 403) {
      throw new OpenLibraryError("RATE_LIMIT", response.status);
    }

    if (!response.ok) {
      throw new OpenLibraryError(
        response.status >= 500 ? "RATE_LIMIT" : "NETWORK",
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof OpenLibraryError) throw error;
    if (options.signal?.aborted) throw error;
    throw new OpenLibraryError("NETWORK");
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", onAbort);
  }
}

export function coverUrl(
  coverId: number,
  size: "S" | "M" | "L" = "M",
): string {
  return `${OPEN_LIBRARY_COVERS}/b/id/${coverId}-${size}.jpg?default=false`;
}

export function openLibraryWorkUrl(workId: string): string {
  return `${OPEN_LIBRARY_ORIGIN}/works/${workId}`;
}

export async function searchBooks(
  query: SearchQuery,
  options: FetchOptions = {},
): Promise<SearchResponse> {
  const url = new URL(`${OPEN_LIBRARY_ORIGIN}/search.json`);
  const q = query.q?.trim();
  const subject = query.subject?.trim();

  if (q) url.searchParams.set("q", q);
  if (subject) url.searchParams.set("subject", subject);
  if (!q && !subject) url.searchParams.set("q", "*");

  url.searchParams.set("page", String(query.page ?? 1));
  url.searchParams.set("limit", String(query.limit ?? SEARCH_PAGE_SIZE));
  url.searchParams.set("fields", SEARCH_FIELDS);

  const data = await fetchJson<SearchResponse>(url.toString(), {
    ...options,
    revalidate: options.revalidate ?? 60,
  });

  return {
    num_found: data.num_found ?? 0,
    start: data.start ?? 0,
    docs: Array.isArray(data.docs) ? data.docs : [],
  };
}

export { fetchJson };

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}
