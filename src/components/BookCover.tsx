"use client";

import { useState } from "react";
import { coverUrl } from "@/lib/openlibrary";

type BookCoverProps = {
  coverId?: number;
  title: string;
  size?: "S" | "M" | "L";
  className?: string;
  priority?: boolean;
};

export function BookCover({
  coverId,
  title,
  size = "M",
  className = "",
  priority = false,
}: BookCoverProps) {
  const [failed, setFailed] = useState(!coverId);

  if (failed || !coverId) {
    return <NoImage title={title} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-forest/10 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl(coverId, size)}
        alt={`Cover of ${title}`}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function NoImage({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  const initial = title.trim().charAt(0).toUpperCase() || "B";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#d8c4a8] via-[#c9b496] to-[#b08968] ${className}`}
      aria-label="No cover image"
    >
      <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,transparent_0_18px,rgba(255,255,255,0.18)_18px_19px)]" />
      <div className="relative flex flex-col items-center gap-2 px-3 text-center">
        <span className="font-serif text-4xl font-semibold text-[#5c4330]/80">{initial}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c4330]/70">
          No Image
        </span>
      </div>
    </div>
  );
}
