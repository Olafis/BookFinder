"use client";

import { useEffect } from "react";

type AdVariant = "banner" | "inline" | "footer";

type AdSlotProps = {
  variant?: AdVariant;
  className?: string;
};

const SLOT_IDS: Record<AdVariant, string | undefined> = {
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
  inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DETAIL,
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ variant = "banner", className = "" }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const slot = SLOT_IDS[variant]?.trim();

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and duplicate pushes are expected.
    }
  }, [client, slot]);

  const frame =
    variant === "inline"
      ? "min-h-[280px] aspect-[2/3] max-h-[360px]"
      : variant === "footer"
        ? "min-h-[120px]"
        : "min-h-[90px]";

  return (
    <aside
      aria-label="Advertisement"
      className={`overflow-hidden rounded-2xl border border-dashed border-line bg-paper-elevated/70 ${frame} ${className}`}
    >
      {client && slot ? (
        <ins
          className="adsbygoogle block h-full w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 px-4 py-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Advertisement
          </p>
          <p className="max-w-[16rem] text-xs leading-5 text-ink-muted/80">
            Google AdSense slot — layout reserved so ads never collapse the page.
          </p>
        </div>
      )}
    </aside>
  );
}
