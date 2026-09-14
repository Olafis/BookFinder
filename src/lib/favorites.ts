export type FavoriteRecord = {
  user_id: string;
  work_id: string;
  title: string;
  author: string | null;
  cover_id: number | null;
  cover_url?: string | null;
  first_publish_year: number | null;
  created_at: string;
};

type ShelfError = {
  code?: string;
  message?: string;
};

export function shelfErrorMessage(error: ShelfError | null | undefined): string | null {
  if (!error) return null;

  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  if (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  ) {
    return "The shelf table is not ready yet. Run supabase/schema.sql in the Supabase SQL Editor, then refresh.";
  }

  if (code === "42501" || message.includes("permission denied")) {
    return "This account cannot write to the shelf yet. Re-run supabase/schema.sql so access policies are applied.";
  }

  return error.message || "Could not update your shelf.";
}
