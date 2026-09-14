import { SEARCH_PAGE_SIZE } from "./constants";
import { searchGoogleBooks } from "./google-books";
import { OpenLibraryError, searchBooks } from "./openlibrary";
import type { SearchQuery, SearchResponse } from "./types";
import { hasHangul } from "./utils";

type FetchOptions = {
  signal?: AbortSignal;
  revalidate?: number | false;
  timeoutMs?: number;
};

function prefersKorean(query: SearchQuery): boolean {
  return query.subject === "korean" || hasHangul(query.q ?? "");
}

async function searchBooksWithRetry(
  query: SearchQuery,
  options: FetchOptions,
): Promise<SearchResponse> {
  try {
    return await searchBooks(query, options);
  } catch {
    return searchBooks(query, { ...options, timeoutMs: 20_000 });
  }
}

function openLibraryQuery(query: SearchQuery): SearchQuery {
  if (query.subject === "korean") {
    return { ...query, subject: undefined, q: query.q?.trim() || "한국 문학" };
  }
  return query;
}

export async function searchCatalogSources(
  query: SearchQuery,
  options: FetchOptions = {},
): Promise<SearchResponse> {
  const olOptions = {
    ...options,
    timeoutMs: options.timeoutMs ?? 15_000,
    revalidate: false as const,
  };

  if (prefersKorean(query)) {
    try {
      const google = await searchGoogleBooks(query, {
        ...options,
        timeoutMs: 4000,
        revalidate: false,
      });
      if (google.docs.length > 0) return google;
    } catch {
      // Google quota or network; try Open Library with the same words.
    }
    return searchBooksWithRetry(openLibraryQuery(query), olOptions);
  }

  const googleResult = await searchGoogleBooks(query, {
    ...options,
    timeoutMs: 4000,
    revalidate: false,
  })
    .then((data) => ({ ok: true as const, data }))
    .catch((error) => ({ ok: false as const, error }));

  if (googleResult.ok && googleResult.data.docs.length > 0) {
    return googleResult.data;
  }

  return searchBooksWithRetry(query, olOptions);
}

export async function searchCatalog(
  query: SearchQuery,
  options: FetchOptions = {},
): Promise<SearchResponse> {
  if (typeof window === "undefined") {
    return searchCatalogSources(query, options);
  }

  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.subject) params.set("subject", query.subject);
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? SEARCH_PAGE_SIZE));

  const response = await fetch(`/api/search?${params.toString()}`, {
    signal: options.signal,
  });
  if (!response.ok) {
    throw new OpenLibraryError(
      response.status === 429 || response.status >= 500 ? "RATE_LIMIT" : "NETWORK",
      response.status,
    );
  }
  return (await response.json()) as SearchResponse;
}
