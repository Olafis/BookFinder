import { Suspense } from "react";
import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Optional Google sign-in to save books on a private shelf.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        Optional account
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Save books to your shelf</h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        Search still works without signing in. A Google account is only needed if you
        want to keep a private list of books.
      </p>
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Google sign-in did not finish. Check that Google is enabled in Supabase Auth,
          then try again.
        </p>
      ) : null}
      <div className="mt-8">
        <Suspense>
          <GoogleSignInButton />
        </Suspense>
      </div>
    </div>
  );
}
