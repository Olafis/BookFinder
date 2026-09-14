import Link from "next/link";
import type { SearchDoc } from "@/lib/types";
import { bookHref, catalogBookId, formatAuthors } from "@/lib/utils";
import { BookCover } from "./BookCover";

type BookCardProps = {
  book: SearchDoc;
};

export function BookCard({ book }: BookCardProps) {
  const workId = catalogBookId(book);
  const authors = formatAuthors(book.author_name);

  return (
    <Link
      href={bookHref(workId)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-elevated shadow-[0_1px_0_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_12px_30px_rgba(35,64,55,0.08)]"
    >
      <BookCover
        coverId={book.cover_i}
        imageUrl={book.cover_url}
        title={book.title}
        className="aspect-[2/3] w-full"
      />
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 font-serif text-[0.95rem] font-semibold leading-snug text-ink group-hover:text-forest">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-xs text-ink-muted">{authors}</p>
        {book.first_publish_year ? (
          <p className="mt-auto pt-1 text-[11px] uppercase tracking-[0.16em] text-ink-muted">
            {book.first_publish_year}
          </p>
        ) : (
          <p className="mt-auto pt-1 text-[11px] uppercase tracking-[0.16em] text-ink-muted/70">
            Year unknown
          </p>
        )}
      </div>
    </Link>
  );
}
