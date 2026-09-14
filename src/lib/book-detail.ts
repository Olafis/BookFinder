import { cache } from "react";
import { searchCatalogSources } from "./catalog";
import { OPEN_LIBRARY_ORIGIN, RELATED_LIMIT } from "./constants";
import { getGoogleBookDetail } from "./google-books";
import { fetchJson, searchBooks } from "./openlibrary";
import type { BookDetail, SearchDoc, WorkRecord } from "./types";
import {
  catalogBookId,
  extractWorkId,
  hasHangul,
  isGoogleBooksId,
  normalizeDescription,
  pickIsbn,
} from "./utils";

async function fetchWork(workId: string): Promise<WorkRecord> {
  return fetchJson<WorkRecord>(`${OPEN_LIBRARY_ORIGIN}/works/${workId}.json`);
}

async function fetchWorkSearch(workId: string): Promise<SearchDoc | undefined> {
  const data = await searchBooks(
    { q: `key:/works/${workId}`, limit: 1, page: 1 },
    { revalidate: 86_400 },
  );
  return data.docs[0];
}

function toBookDetail(
  workId: string,
  work: WorkRecord,
  search?: SearchDoc,
): BookDetail {
  return {
    workId,
    title: search?.title || work.title,
    description: normalizeDescription(work.description),
    authors: search?.author_name ?? [],
    coverId: search?.cover_i ?? work.covers?.find((id) => id > 0),
    subjects: (work.subjects ?? search?.subject ?? [])
      .filter(Boolean)
      .slice(0, 16),
    publishers: search?.publisher?.slice(0, 3) ?? [],
    pageCount: search?.number_of_pages_median,
    firstPublishYear: search?.first_publish_year,
    isbn: pickIsbn(search?.isbn),
    coverUrl: search?.cover_url,
    sourceLabel: "Open Library",
    sourceUrl: `${OPEN_LIBRARY_ORIGIN}/works/${workId}`,
  };
}

export const getBookDetail = cache(async (workId: string): Promise<BookDetail> => {
  if (isGoogleBooksId(workId)) {
    return getGoogleBookDetail(workId);
  }

  const search = await fetchWorkSearch(workId).catch(() => undefined);
  try {
    const work = await fetchWork(workId);
    return toBookDetail(workId, work, search);
  } catch (error) {
    if (search?.title) {
      return toBookDetail(
        workId,
        {
          key: `/works/${workId}`,
          title: search.title,
          covers: search.cover_i ? [search.cover_i] : undefined,
          subjects: search.subject,
        },
        search,
      );
    }
    throw error;
  }
});

export async function getRelatedBooks(
  subject: string | undefined,
  excludeWorkId: string,
): Promise<SearchDoc[]> {
  if (!subject) return [];

  const data = await searchCatalogSources(
    {
      q: hasHangul(subject) ? subject : undefined,
      subject: hasHangul(subject) ? undefined : subject,
      limit: RELATED_LIMIT,
      page: 1,
    },
    { revalidate: 86_400 },
  );

  return data.docs
    .filter((doc) => catalogBookId(doc) !== extractWorkId(excludeWorkId))
    .slice(0, 10);
}
