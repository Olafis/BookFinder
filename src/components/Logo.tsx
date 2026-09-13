import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

type LogoProps = {
  size?: "sm" | "md";
};

export function Logo({ size = "md" }: LogoProps) {
  const compact = size === "sm";

  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={`grid place-items-center rounded-lg bg-forest text-paper-elevated shadow-[inset_0_-1px_0_rgba(255,255,255,0.12)] ${
          compact ? "h-8 w-8" : "h-10 w-10"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={compact ? "h-4 w-4" : "h-5 w-5"} fill="none">
          <path
            d="M6.5 5.2c1.8-.9 3.6-.7 5.5.4 1.9-1.1 3.7-1.3 5.5-.4v13.1c-1.8-.8-3.6-.6-5.5.5-1.9-1.1-3.7-1.3-5.5-.5V5.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 6.1v12.4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      <span
        className={`font-serif font-semibold tracking-tight text-ink ${
          compact ? "text-lg" : "text-xl"
        }`}
      >
        {SITE_NAME}
      </span>
    </Link>
  );
}
