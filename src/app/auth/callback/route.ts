import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/library";
  const safeNext = nextParam.startsWith("/") ? nextParam : "/library";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const redirectBase =
    process.env.NODE_ENV === "development" || !forwardedHost
      ? origin
      : `https://${forwardedHost}`;

  if (!code) {
    return NextResponse.redirect(`${redirectBase}/login?error=auth`);
  }

  const config = getSupabasePublicConfig();
  if (!config) {
    return NextResponse.redirect(`${redirectBase}/login?error=auth`);
  }

  const response = NextResponse.redirect(`${redirectBase}${safeNext}`);
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${redirectBase}/login?error=auth`);
  }

  return response;
}
