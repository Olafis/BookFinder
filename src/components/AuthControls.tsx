"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const supabaseEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export function AuthControls() {
  const [user, setUser] = useState<User | null | undefined>(
    supabaseEnabled ? undefined : null,
  );

  useEffect(() => {
    if (!supabaseEnabled) return;

    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!supabaseEnabled) return null;

  if (user === undefined) {
    return <span className="h-7 w-16 rounded-full bg-line/70" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-forest px-3 py-1.5 text-xs font-medium text-paper-elevated hover:bg-forest-hover"
      >
        Sign in
      </Link>
    );
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Reader";

  return (
    <div className="flex items-center gap-3">
      <Link href="/library" className="hover:text-ink">
        My shelf
      </Link>
      <span className="hidden max-w-[8rem] truncate text-ink lg:inline">{name}</span>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:border-forest/30"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
