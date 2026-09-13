import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-forest text-paper-elevated">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{SITE_NAME}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-paper-elevated/75">
            A lightweight catalog for world literature. Search Open Library, then
            buy through Amazon when a book belongs on your shelf.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper-elevated/55">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-paper-elevated/85">
            <li>
              <Link href="/search?subject=fiction" className="hover:text-paper-elevated">
                Fiction
              </Link>
            </li>
            <li>
              <Link href="/search?subject=science" className="hover:text-paper-elevated">
                Science
              </Link>
            </li>
            <li>
              <Link href="/library" className="hover:text-paper-elevated">
                My shelf
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-paper-elevated">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm leading-6 text-paper-elevated/75">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper-elevated/55">
            Sources
          </p>
          <p className="mt-3">
            Book data from{" "}
            <a
              href="https://openlibrary.org"
              className="underline decoration-paper-elevated/30 underline-offset-4 hover:decoration-paper-elevated"
              rel="noreferrer"
              target="_blank"
            >
              Open Library
            </a>
            . Covers via the Open Library Covers API.
          </p>
        </div>
      </div>
    </footer>
  );
}
