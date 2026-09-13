import { INLINE_AD_AFTER } from "@/lib/constants";
import type { SearchDoc } from "@/lib/types";
import { AdSlot } from "./AdSlot";
import { BookCard } from "./BookCard";

type BookGridProps = {
  books: SearchDoc[];
  showInlineAd?: boolean;
};

export function BookGrid({ books, showInlineAd = false }: BookGridProps) {
  const items: Array<{ type: "book"; book: SearchDoc } | { type: "ad" }> = [];

  books.forEach((book, index) => {
    items.push({ type: "book", book });
    if (showInlineAd && index === INLINE_AD_AFTER - 1) {
      items.push({ type: "ad" });
    }
  });

  if (showInlineAd && books.length > 0 && books.length < INLINE_AD_AFTER) {
    items.push({ type: "ad" });
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, index) =>
        item.type === "ad" ? (
          <li key="inline-ad" className="min-h-0">
            <AdSlot variant="inline" className="h-full" />
          </li>
        ) : (
          <li key={`${item.book.key}-${index}`}>
            <BookCard book={item.book} />
          </li>
        ),
      )}
    </ul>
  );
}
