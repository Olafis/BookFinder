"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { shelfErrorMessage } from "@/lib/favorites";
import { createBrowserSupabase } from "@/lib/supabase/client";

type FavoriteButtonProps = {
  workId: string;
  title: string;
  author?: string;
  coverId?: number;
  coverUrl?: string;
  firstPublishYear?: number;
};

export function FavoriteButton({
  workId,
  title,
  author,
  coverId,
  coverUrl,
  firstPublishYear,
}: FavoriteButtonProps) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const user = data.user;
      setSignedIn(Boolean(user));
      if (!user) return;
      supabase
        .from("favorites")
        .select("work_id")
        .eq("work_id", workId)
        .maybeSingle()
        .then(({ data: row, error }) => {
          if (cancelled) return;
          setErrorMessage(shelfErrorMessage(error));
          setSaved(Boolean(row));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [workId]);

  async function toggle() {
    const supabase = createBrowserSupabase();
    setPending(true);
    setErrorMessage(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSignedIn(false);
        return;
      }

      if (saved) {
        const { error } = await supabase.from("favorites").delete().eq("work_id", workId);
        const message = shelfErrorMessage(error);
        setErrorMessage(message);
        if (!message) setSaved(false);
      } else {
        const payload = {
          user_id: user.id,
          work_id: workId,
          title,
          author: author ?? null,
          cover_id: coverId ?? null,
          cover_url: coverUrl ?? null,
          first_publish_year: firstPublishYear ?? null,
        };
        let { error } = await supabase.from("favorites").insert(payload);
        if (error && (error.code === "PGRST204" || error.message.includes("cover_url"))) {
          const { cover_url: _ignored, ...withoutCoverUrl } = payload;
          ({ error } = await supabase.from("favorites").insert(withoutCoverUrl));
        }
        const message = shelfErrorMessage(error);
        setErrorMessage(message);
        if (!message) setSaved(true);
      }
    } finally {
      setPending(false);
    }
  }

  if (signedIn === false) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm font-medium text-ink hover:border-forest/30"
      >
        Save to my shelf
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={pending || signedIn === null}
        className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition disabled:opacity-60 ${
          saved
            ? "border border-forest bg-forest text-paper-elevated"
            : "border border-line bg-paper-elevated text-ink hover:border-forest/30"
        }`}
      >
        {saved ? "Saved on your shelf" : "Save to my shelf"}
      </button>
      {errorMessage ? (
        <p className="text-center text-xs leading-5 text-red-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
