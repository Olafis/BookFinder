import { AdSlot } from "@/components/AdSlot";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-forest">
            한국어 · 원서 · 가입 없이
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Find any book.
            <span className="block italic text-forest">Anywhere.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
            가입 없이 한국어 책과 원서를 검색하세요. 제목, 저자, ISBN, 또는
            주제 카드를 고르면 됩니다.
          </p>
          <div className="mt-8 w-full">
            <SearchBar variant="hero" autoFocus />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot variant="banner" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
              Quick browse
            </p>
            <h2 className="font-serif text-3xl text-ink">Explore by subject</h2>
          </div>
        </div>
        <CategoryGrid />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <AdSlot variant="footer" />
      </div>
    </div>
  );
}
