"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SEARCH_DEBOUNCE_MS, SUGGESTION_LIMIT } from "@/lib/constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { isAbortError, searchBooks } from "@/lib/openlibrary";
import type { SearchDoc } from "@/lib/types";
import { extractWorkId, formatAuthors } from "@/lib/utils";

type SearchBarProps = {
  variant?: "hero" | "compact";
  initialQuery?: string;
  autoFocus?: boolean;
};

export function SearchBar({
  variant = "compact",
  initialQuery = "",
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchDoc[]>([]);
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const rootRef = useRef<HTMLFormElement>(null);
  const isHero = variant === "hero";
  const canSuggest = debouncedQuery.length >= 2 && query.trim() === debouncedQuery;

  useEffect(() => {
    if (!canSuggest) return;

    const controller = new AbortController();

    searchBooks(
      { q: debouncedQuery, limit: SUGGESTION_LIMIT, page: 1 },
      { signal: controller.signal, revalidate: false },
    )
      .then((data) => {
        setSuggestions(data.docs);
        setActiveIndex(-1);
        setOpen(true);
      })
      .catch((error) => {
        if (!isAbortError(error)) {
          setSuggestions([]);
        }
      });

    return () => controller.abort();
  }, [canSuggest, debouncedQuery]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function goToResults(value = query) {
    const next = value.trim();
    if (!next) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(next)}`);
  }

  function goToBook(book: SearchDoc) {
    setOpen(false);
    router.push(`/book/${extractWorkId(book.key)}`);
  }

  return (
    <form
      ref={rootRef}
      action="/search"
      method="get"
      className={`relative w-full ${isHero ? "max-w-2xl" : "max-w-xl"}`}
      onSubmit={(event) => {
        event.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          goToBook(suggestions[activeIndex]);
          return;
        }
        const formData = new FormData(event.currentTarget);
        const next = String(formData.get("q") ?? query);
        goToResults(next);
      }}
    >
      <label htmlFor={isHero ? "hero-search" : "header-search"} className="sr-only">
        Search by title, author, or ISBN
      </label>
      <div
        className={`flex items-center gap-2 rounded-full border border-line bg-paper-elevated shadow-[0_8px_30px_rgba(35,64,55,0.06)] focus-within:border-forest/40 focus-within:ring-4 focus-within:ring-forest/10 ${
          isHero ? "px-4 py-2.5 sm:px-5 sm:py-3" : "px-3 py-1.5"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`shrink-0 text-ink-muted ${isHero ? "h-5 w-5" : "h-4 w-4"}`}
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          id={isHero ? "hero-search" : "header-search"}
          name="q"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Title, author, or ISBN"
          className={`w-full bg-transparent text-ink outline-none placeholder:text-ink-muted/70 ${
            isHero ? "text-base sm:text-lg" : "text-sm"
          }`}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, -1));
            }
          }}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-full bg-forest font-medium text-paper-elevated transition hover:bg-forest-hover ${
            isHero ? "px-4 py-2 text-sm sm:px-5" : "px-3 py-1.5 text-xs"
          }`}
        >
          Search
        </button>
      </div>

      {open && canSuggest && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-paper-elevated py-2 shadow-[0_18px_50px_rgba(28,25,23,0.12)]"
        >
          {suggestions.map((book, index) => (
            <li key={book.key} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`flex w-full flex-col items-start px-4 py-2.5 text-left ${
                  index === activeIndex ? "bg-forest/8" : "hover:bg-paper"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToBook(book)}
              >
                <span className="line-clamp-1 font-medium text-ink">{book.title}</span>
                <span className="line-clamp-1 text-xs text-ink-muted">
                  {formatAuthors(book.author_name)}
                  {book.first_publish_year ? ` · ${book.first_publish_year}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
