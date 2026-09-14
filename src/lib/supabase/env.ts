type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return "";

  try {
    const parsed = new URL(raw.trim());
    parsed.pathname = parsed.pathname.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}
