"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthControls } from "./AuthControls";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";

export function SiteHeader() {
  const pathname = usePathname();
  const showSearch = pathname !== "/";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 ${
          showSearch ? "md:grid-cols-[auto_minmax(0,1fr)_auto]" : "grid-cols-[1fr_auto]"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3 text-sm text-ink-muted md:hidden">
            <AuthControls />
          </div>
        </div>
        {showSearch ? <SearchBar /> : null}
        <nav className="hidden items-center justify-end gap-4 text-sm text-ink-muted md:flex">
          <Link href="/search?subject=fiction" className="hover:text-ink">
            Browse
          </Link>
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
          <AuthControls />
        </nav>
      </div>
    </header>
  );
}
