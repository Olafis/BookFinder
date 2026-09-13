"use client";

import { useRef } from "react";
import type { SearchDoc } from "@/lib/types";
import { BookCard } from "./BookCard";

type RelatedBooksProps = {
  books: SearchDoc[];
  subject: string;
};

export function RelatedBooks({ books, subject }: RelatedBooksProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (books.length === 0) return null;

  function scroll(direction: number) {
    scrollerRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  }

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Because of {subject}
          </p>
          <h2 className="font-serif text-3xl text-ink">Recommended books</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Previous recommendations"
            onClick={() => scroll(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper-elevated text-ink hover:border-forest/30"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next recommendations"
            onClick={() => scroll(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper-elevated text-ink hover:border-forest/30"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book) => (
          <div key={book.key} className="w-[200px] shrink-0 snap-start sm:w-[220px]">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
