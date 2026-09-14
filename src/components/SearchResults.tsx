"use client";

import { useCallback, useEffect, useState } from "react";
import { SEARCH_PAGE_SIZE } from "@/lib/constants";
import { searchCatalog } from "@/lib/catalog";
import { isAbortError } from "@/lib/openlibrary";
import type { SearchDoc } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AdSlot } from "./AdSlot";
import { BookGrid } from "./BookGrid";
import { CategoryGrid } from "./CategoryGrid";
import { ErrorState } from "./ErrorState";
import { BookGridSkeleton } from "./Skeletons";

type SearchResultsProps = {
  q: string;
  subject: string;
};

export function SearchResults({ q, subject }: SearchResultsProps) {
  if (!q && !subject) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-serif text-4xl text-ink">Browse by subject</h1>
        <p className="mt-2 mb-8 text-ink-muted">
          주제 카드를 고르거나, 제목·저자·ISBN으로 검색하세요.
        </p>
        <CategoryGrid />
      </div>
    );
  }

  return <SearchResultsList key={`${q}|${subject}`} q={q} subject={subject} />;
}

function SearchResultsList({ q, subject }: { q: string; subject: string }) {
  const [books, setBooks] = useState<SearchDoc[]>([]);
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    searchCatalog(
      { q: q || undefined, subject: subject || undefined, page: 1 },
      { signal: controller.signal, revalidate: false },
    )
      .then((data) => {
        setBooks(data.docs);
        setNumFound(data.num_found);
        setPage(1);
        setStatus("idle");
      })
      .catch((error) => {
        if (!isAbortError(error)) {
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, [q, subject]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await searchCatalog(
        { q: q || undefined, subject: subject || undefined, page: nextPage },
        { revalidate: false },
      );
      setBooks((current) => [...current, ...data.docs]);
      setNumFound(data.num_found);
      setPage(nextPage);
    } catch (error) {
      if (!isAbortError(error)) {
        setStatus("error");
      }
    } finally {
      setLoadingMore(false);
    }
  }, [page, q, subject]);

  const heading = q
    ? `“${q}” 검색 결과`
    : subject === "korean"
      ? "한국문학"
      : `${capitalize(subject)} books`;
  const hasMore = books.length < numFound && books.length >= SEARCH_PAGE_SIZE;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdSlot variant="banner" className="mb-8" />
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Google Books · Open Library
        </p>
        <h1 className="font-serif text-4xl text-ink">{heading}</h1>
        {status === "idle" && (
          <p className="mt-2 text-sm text-ink-muted">{formatNumber(numFound)}권</p>
        )}
      </div>

      {status === "loading" && <BookGridSkeleton />}
      {status === "error" && (
        <ErrorState
          title="This search is taking a break."
          onRetry={() => {
            setStatus("loading");
            searchCatalog(
              { q: q || undefined, subject: subject || undefined, page: 1 },
              { revalidate: false },
            )
              .then((data) => {
                setBooks(data.docs);
                setNumFound(data.num_found);
                setPage(1);
                setStatus("idle");
              })
              .catch(() => setStatus("error"));
          }}
        />
      )}
      {status === "idle" && books.length === 0 && (
        <div className="rounded-3xl border border-line bg-paper-elevated px-6 py-12 text-center">
          <p className="font-serif text-2xl text-ink">검색 결과가 없습니다.</p>
          <p className="mt-2 text-sm text-ink-muted">
            짧은 제목, ISBN, 또는 주제 카드를 다시 써 보세요.
          </p>
        </div>
      )}
      {status === "idle" && books.length > 0 && (
        <>
          <BookGrid books={books} showInlineAd />
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => void loadMore()}
                className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper-elevated hover:bg-forest-hover disabled:opacity-60"
              >
                {loadingMore ? "불러오는 중…" : "더 보기"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
