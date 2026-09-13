"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

type FavoriteButtonProps = {
  workId: string;
  title: string;
  author?: string;
  coverId?: number;
  firstPublishYear?: number;
};

export function FavoriteButton({
  workId,
  title,
  author,
  coverId,
  firstPublishYear,
}: FavoriteButtonProps) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

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
        .then(({ data: row }) => {
          if (!cancelled) setSaved(Boolean(row));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [workId]);

  async function toggle() {
    const supabase = createBrowserSupabase();
    setPending(true);
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
        if (!error) setSaved(false);
      } else {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          work_id: workId,
          title,
          author: author ?? null,
          cover_id: coverId ?? null,
          first_publish_year: firstPublishYear ?? null,
        });
        if (!error) setSaved(true);
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
  );
}
