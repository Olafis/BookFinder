import { getAmazonAssociateTag, getAmazonUrl } from "@/lib/amazon";

type AmazonCtaProps = {
  isbn?: string;
  title: string;
  layout?: "card" | "banner";
};

export function AmazonCta({ isbn, title, layout = "card" }: AmazonCtaProps) {
  const href = getAmazonUrl({ isbn, title });
  const associate = Boolean(getAmazonAssociateTag());
  const isBanner = layout === "banner";

  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel={associate ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer"}
        className={`group flex items-center justify-between gap-4 rounded-2xl bg-gold text-ink shadow-[0_10px_24px_rgba(232,148,42,0.28)] transition hover:bg-gold-hover ${
          isBanner ? "w-full px-4 py-3" : "w-full flex-col items-stretch p-5"
        }`}
      >
        <span className={isBanner ? "text-left" : "block"}>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/70">
            {associate ? "Amazon Associate" : "Amazon"}
          </span>
          <span className={`block font-serif font-semibold ${isBanner ? "text-lg" : "mt-1 text-2xl"}`}>
            Buy on Amazon
          </span>
          <span className="block text-sm text-ink/75">Check Price</span>
        </span>
        <span
          className={`inline-flex items-center justify-center rounded-full bg-ink text-paper-elevated ${
            isBanner ? "h-10 px-4 text-sm" : "mt-3 h-11 w-full text-sm font-medium"
          }`}
        >
          View on Amazon
          <svg viewBox="0 0 24 24" className="ml-1.5 h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M7 17 17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
      {associate ? (
        <p className="mt-3 text-xs leading-5 text-ink-muted">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      ) : null}
    </div>
  );
}
