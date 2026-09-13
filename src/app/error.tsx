"use client";

import { ErrorState } from "@/components/ErrorState";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ErrorState onRetry={reset} />
    </div>
  );
}
