import { redirect } from "next/navigation";
import { BookCover } from "@/components/BookCover";
import { createServerSupabase } from "@/lib/supabase/server";
import { shelfErrorMessage, type FavoriteRecord } from "@/lib/favorites";
import { bookHref } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/library");
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("user_id, work_id, title, author, cover_id, first_publish_year, created_at")
    .order("created_at", { ascending: false });

  const books = (data ?? []) as FavoriteRecord[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        Private shelf
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">My shelf</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Books you save stay on this account. They are not visible to anyone else.
      </p>

      {error ? (
        <p className="mt-8 rounded-2xl border border-line bg-paper-elevated px-5 py-4 text-sm text-ink-muted">
          {shelfErrorMessage(error)}{" "}
          <a
            href="https://supabase.com/dashboard/project/nwcuphpowzgylrzrftaf/sql/new"
            className="underline decoration-line underline-offset-4 hover:text-forest"
            target="_blank"
            rel="noreferrer"
          >
            Open the SQL Editor
          </a>
        </p>
      ) : null}

      {!error && books.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-line bg-paper-elevated px-6 py-12 text-center">
          <p className="font-serif text-2xl text-ink">Your shelf is empty</p>
          <p className="mt-2 text-sm text-ink-muted">
            Open a book and tap Save to my shelf.
          </p>
          <Link
            href="/search?subject=fiction"
            className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper-elevated hover:bg-forest-hover"
          >
            Browse fiction
          </Link>
        </div>
      ) : null}

      {books.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => (
            <li key={book.work_id}>
              <Link
                href={bookHref(book.work_id)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-elevated"
              >
                <BookCover
                  coverId={book.cover_id ?? undefined}
                  imageUrl={book.cover_url ?? undefined}
                  title={book.title}
                  className="aspect-[2/3] w-full"
                />
                <div className="p-3.5">
                  <h2 className="line-clamp-2 font-serif text-sm font-semibold text-ink group-hover:text-forest">
                    {book.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-xs text-ink-muted">
                    {book.author ?? "Unknown author"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
