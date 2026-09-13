export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden rounded-2xl border border-line bg-paper-elevated"
        >
          <div className="aspect-[2/3] animate-pulse bg-line/80" />
          <div className="space-y-2 p-3.5">
            <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-line/80" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr_260px]">
        <div className="aspect-[2/3] animate-pulse rounded-2xl bg-line" />
        <div className="space-y-3">
          <div className="h-10 w-3/4 animate-pulse rounded bg-line" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-line/80" />
          <div className="h-32 animate-pulse rounded-2xl bg-line/70" />
        </div>
        <div className="h-40 animate-pulse rounded-2xl bg-gold/30" />
      </div>
    </div>
  );
}
