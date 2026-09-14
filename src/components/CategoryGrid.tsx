import type { ReactNode } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, ReactNode> = {
  korean: (
    <>
      <path d="M5 6.5c2-.9 4-.7 6 .5 2-1.2 4-1.4 6-.5v11c-2-.8-4-.6-6 .6-2-1.2-4-1.4-6-.6v-11Z" />
      <path d="M9 10h6M9 13h4" />
    </>
  ),
  fiction: (
    <path d="M5 6.5c2-.9 4-.7 6 .5 2-1.2 4-1.4 6-.5v11c-2-.8-4-.6-6 .6-2-1.2-4-1.4-6-.6v-11Z" />
  ),
  science: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <ellipse cx="12" cy="12" rx="8" ry="3.2" />
      <ellipse cx="12" cy="12" rx="8" ry="3.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8" ry="3.2" transform="rotate(120 12 12)" />
    </>
  ),
  history: (
    <>
      <path d="M5 19V7.5L12 5l7 2.5V19" />
      <path d="M5 11h14" />
      <path d="M12 5v14" />
    </>
  ),
  art: (
    <>
      <path d="M12 4.5c4.2 0 7.5 2.4 7.5 5.8 0 2.2-1.6 3.4-3.3 3.4-1.3 0-2.1-.7-2.5-1.6-.3.7-1 1.6-2.4 1.6-1.8 0-3.3-1.5-3.3-3.6C8 7.2 9.6 4.5 12 4.5Z" />
      <circle cx="9.4" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8.2" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  business: (
    <>
      <path d="M4.5 18.5h15" />
      <path d="M7 18.5V11l5-4 5 4v7.5" />
      <path d="M10.5 18.5v-4h3v4" />
    </>
  ),
  biography: (
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M6.2 18.5c.8-2.8 3-4.3 5.8-4.3s5 1.5 5.8 4.3" />
    </>
  ),
  philosophy: (
    <>
      <path d="M12 4.5v3" />
      <circle cx="12" cy="13" r="6.5" />
      <path d="M9.2 13.2c.6-1.4 1.6-2.1 2.8-2.1 1.7 0 2.8 1.3 2.8 2.8 0 2.2-2.8 2.4-2.8 3.8" />
      <circle cx="12" cy="19.2" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  technology: (
    <>
      <rect x="5" y="6" width="14" height="10" rx="1.6" />
      <path d="M9 19h6" />
      <path d="M12 16v3" />
    </>
  ),
};

export function CategoryGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CATEGORIES.map((category) => (
        <li key={category.slug}>
          <Link
            href={`/search?subject=${encodeURIComponent(category.subject)}`}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-paper-elevated p-4 transition hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-[0_14px_32px_rgba(35,64,55,0.08)]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest/8 text-forest">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONS[category.slug]}
              </svg>
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold text-ink group-hover:text-forest">
                {category.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                {category.ko} · {category.blurb}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
