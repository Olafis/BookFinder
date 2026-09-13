import { cache } from "react";
import { OPEN_LIBRARY_ORIGIN, RELATED_LIMIT } from "./constants";
import { fetchJson, searchBooks } from "./openlibrary";
import type { BookDetail, SearchDoc, WorkRecord } from "./types";
import { extractWorkId, normalizeDescription, pickIsbn } from "./utils";

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
  };
}

export const getBookDetail = cache(async (workId: string): Promise<BookDetail> => {
  const [work, search] = await Promise.all([
    fetchWork(workId),
    fetchWorkSearch(workId).catch(() => undefined),
  ]);
  return toBookDetail(workId, work, search);
});

export async function getRelatedBooks(
  subject: string | undefined,
  excludeWorkId: string,
): Promise<SearchDoc[]> {
  if (!subject) return [];

  const data = await searchBooks(
    { subject, limit: RELATED_LIMIT, page: 1 },
    { revalidate: 86_400 },
  );

  return data.docs
    .filter((doc) => extractWorkId(doc.key) !== excludeWorkId)
    .slice(0, 10);
}
