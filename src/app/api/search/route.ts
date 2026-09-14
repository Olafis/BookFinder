import { NextResponse, type NextRequest } from "next/server";
import { searchCatalogSources } from "@/lib/catalog";
import { SEARCH_PAGE_SIZE } from "@/lib/constants";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const subject = request.nextUrl.searchParams.get("subject")?.trim() ?? "";
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(
    40,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? SEARCH_PAGE_SIZE) || SEARCH_PAGE_SIZE),
  );

  if (!q && !subject) {
    return NextResponse.json({ num_found: 0, start: 0, docs: [] });
  }

  try {
    const data = await searchCatalogSources({
      q: q || undefined,
      subject: subject || undefined,
      page,
      limit,
    });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(
      { num_found: 0, start: 0, docs: [], error: true },
      { status: 502 },
    );
  }
}
