import { RATE_LIMIT_MESSAGE } from "@/lib/constants";

type ErrorStateProps = {
  onRetry?: () => void;
  title?: string;
};

export function ErrorState({
  onRetry,
  title = "We could not load these books.",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-line bg-paper-elevated px-6 py-10 text-center"
    >
      <p className="font-serif text-2xl text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{RATE_LIMIT_MESSAGE}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper-elevated hover:bg-forest-hover"
        >
          Try again
        </button>
      )}
    </div>
  );
}
