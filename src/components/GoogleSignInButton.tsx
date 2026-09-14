"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function GoogleSignInButton({ nextPath = "/library" }: { nextPath?: string }) {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = useMemo(() => {
    const fromQuery = searchParams.get("next");
    if (fromQuery?.startsWith("/")) return fromQuery;
    return nextPath;
  }, [nextPath, searchParams]);

  async function signIn() {
    setPending(true);
    setError(null);
    try {
      const supabase = createBrowserSupabase();
      const origin = window.location.origin;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setPending(false);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start Google sign-in.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => void signIn()}
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-line bg-paper-elevated px-5 py-3 text-sm font-medium text-ink shadow-sm transition hover:border-forest/30 hover:bg-paper disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h4c2.3-2.1 3.5-5.2 3.5-8.7z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 5.9-1 7.9-2.9l-4-3c-1.1.7-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8H1.4v3.1C3.4 21.4 7.4 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.5 14.5c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H1.4C.5 8.8 0 10.4 0 12.3c0 1.9.5 3.5 1.4 5.2l4.1-2.9z"
          />
          <path
            fill="#EA4335"
            d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 7l4.1 3.1C6.4 7 9 4.8 12 4.8z"
          />
        </svg>
        {pending ? "구글로 이동 중…" : "Google로 시작"}
      </button>
      {error ? <p className="text-center text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
