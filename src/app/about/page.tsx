import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `How ${SITE_NAME} uses Open Library, optional Google sign-in, and Google AdSense.`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        Disclosures
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">About BookFinder</h1>
      <div className="mt-6 space-y-5 text-[0.95rem] leading-7 text-ink/85">
        <p>
          BookFinder is a free catalog for world literature. Search still works
          without an account. Sign in with Google only if you want a private shelf
          of saved books.
        </p>
        <p>
          Bibliographic data and cover images come from{" "}
          <a
            href="https://books.google.com"
            className="underline decoration-line underline-offset-4 hover:text-forest"
            target="_blank"
            rel="noreferrer"
          >
            Google Books
          </a>{" "}
          and{" "}
          <a
            href="https://openlibrary.org"
            className="underline decoration-line underline-offset-4 hover:text-forest"
            target="_blank"
            rel="noreferrer"
          >
            Open Library
          </a>
          . Korean-language searches use Google Books. If a catalog is busy, you
          may see a short pause message — 잠시 후 다시 시도해 주세요.
        </p>
        <p>
          Book pages can link out to Amazon so you can check a price. Affiliate
          tags are not attached yet. Display ad slots are reserved for Google
          AdSense and stay in the layout even before ads are approved.
        </p>
        <p>
          Hosting is designed for Vercel’s free tier: the home page is static,
          search is cached for a minute, and book pages are cached after the first
          fetch.
        </p>
      </div>
    </article>
  );
}
