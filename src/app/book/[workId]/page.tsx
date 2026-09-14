import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { AmazonCta } from "@/components/AmazonCta";
import { FavoriteButton } from "@/components/FavoriteButton";
import { BookCover } from "@/components/BookCover";
import { BookJsonLd } from "@/components/BookJsonLd";
import { RelatedBooks } from "@/components/RelatedBooks";
import { getBookDetail, getRelatedBooks } from "@/lib/book-detail";
import { OpenLibraryError } from "@/lib/openlibrary";
import { excerpt, formatAuthors, isWorkId } from "@/lib/utils";

type BookPageProps = {
  params: Promise<{ workId: string }>;
};

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { workId: rawWorkId } = await params;
  const workId = decodeURIComponent(rawWorkId);
  if (!isWorkId(workId)) {
    return { title: "Book not found" };
  }

  try {
    const book = await getBookDetail(workId);
    const description =
      excerpt(book.description, 180) ||
      `${book.title} by ${formatAuthors(book.authors)}. Find details and Amazon pricing on BookFinder.`;
    return {
      title: book.title,
      description,
      openGraph: {
        title: book.title,
        description,
        type: "book",
      },
    };
  } catch {
    return { title: "Book details" };
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { workId: rawWorkId } = await params;
  const workId = decodeURIComponent(rawWorkId);
  if (!isWorkId(workId)) notFound();

  let book;
  try {
    book = await getBookDetail(workId);
  } catch (error) {
    if (error instanceof OpenLibraryError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  const primarySubject = book.subjects[0];
  const related = await getRelatedBooks(primarySubject, book.workId).catch(
    () => [],
  );

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BookJsonLd book={book} />

      <div className="mb-4 lg:hidden">
        <AmazonCta isbn={book.isbn} title={book.title} layout="banner" />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)_260px]">
        <BookCover
          coverId={book.coverId}
          imageUrl={book.coverUrl}
          title={book.title}
          size="L"
          priority
          className="mx-auto aspect-[2/3] w-full max-w-[240px] rounded-2xl border border-line shadow-[0_16px_40px_rgba(28,25,23,0.12)]"
        />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            {book.sourceLabel ?? "Catalog"}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-ink-muted">{formatAuthors(book.authors)}</p>
          <div className="mt-5 max-w-sm lg:hidden">
            <FavoriteButton
              workId={book.workId}
              title={book.title}
              author={formatAuthors(book.authors)}
              coverId={book.coverId}
              coverUrl={book.coverUrl}
              firstPublishYear={book.firstPublishYear}
            />
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink">
            {book.firstPublishYear ? (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                  First published
                </dt>
                <dd>{book.firstPublishYear}</dd>
              </div>
            ) : null}
            {book.publishers[0] ? (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                  Publisher
                </dt>
                <dd>{book.publishers.join(", ")}</dd>
              </div>
            ) : null}
            {book.pageCount ? (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                  Pages
                </dt>
                <dd>{book.pageCount}</dd>
              </div>
            ) : null}
            {book.isbn ? (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                  ISBN
                </dt>
                <dd>{book.isbn}</dd>
              </div>
            ) : null}
          </dl>

          {book.subjects.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {book.subjects.map((subject) => (
                <li key={subject}>
                  <Link
                    href={`/search?subject=${encodeURIComponent(subject)}`}
                    className="inline-flex rounded-full border border-line bg-paper-elevated px-3 py-1 text-xs text-ink-muted hover:border-forest/30 hover:text-forest"
                  >
                    {subject}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {book.description ? (
            <div className="mt-8 max-w-prose">
              <h2 className="font-serif text-2xl text-ink">Description</h2>
              <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-7 text-ink/85">
                {book.description}
              </p>
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink-muted">
              No description is available for this work yet.
            </p>
          )}

          {book.sourceUrl ? (
            <p className="mt-6 text-xs text-ink-muted">
              Record on{" "}
              <a
                href={book.sourceUrl}
                className="underline decoration-line underline-offset-4 hover:text-forest"
                target="_blank"
                rel="noreferrer"
              >
                {book.sourceLabel ?? "source"}
              </a>
            </p>
          ) : null}
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <AmazonCta isbn={book.isbn} title={book.title} />
          <div className="mt-3">
            <FavoriteButton
              workId={book.workId}
              title={book.title}
              author={formatAuthors(book.authors)}
              coverId={book.coverId}
              coverUrl={book.coverUrl}
              firstPublishYear={book.firstPublishYear}
            />
          </div>
        </aside>
      </div>

      <div className="mt-12">
        <AdSlot variant="footer" />
      </div>

      {primarySubject ? (
        <RelatedBooks books={related} subject={primarySubject} />
      ) : null}
    </article>
  );
}
