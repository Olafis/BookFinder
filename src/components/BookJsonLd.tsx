import type { BookDetail } from "@/lib/types";
import { excerpt, siteUrl } from "@/lib/utils";

type BookJsonLdProps = {
  book: BookDetail;
};

export function BookJsonLd({ book }: BookJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    url: `${siteUrl()}/book/${book.workId}`,
    author: book.authors.map((name) => ({ "@type": "Person", name })),
    isbn: book.isbn,
    numberOfPages: book.pageCount,
    datePublished: book.firstPublishYear ? String(book.firstPublishYear) : undefined,
    description: book.description ? excerpt(book.description, 240) : undefined,
    publisher: book.publishers[0]
      ? { "@type": "Organization", name: book.publishers[0] }
      : undefined,
    genre: book.subjects.slice(0, 5),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
