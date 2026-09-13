import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink">This page is not on the shelf.</h1>
      <p className="mt-3 text-sm text-ink-muted">
        The book or page you asked for is missing. Try a new search.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper-elevated hover:bg-forest-hover"
      >
        Back to BookFinder
      </Link>
    </div>
  );
}
