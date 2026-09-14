import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";

export function createBrowserSupabase() {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Supabase env vars are missing.");
  }

  return createBrowserClient(config.url, config.anonKey);
}
