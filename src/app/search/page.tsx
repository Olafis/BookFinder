import type { Metadata } from "next";
import { SearchResults } from "@/components/SearchResults";
import { CATEGORIES } from "@/lib/constants";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; subject?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q, subject } = await searchParams;
  if (q) {
    return {
      title: `“${q}” books`,
    description: `Search Google Books and Open Library for “${q}”.`,
    };
  }
  if (subject) {
    const known = CATEGORIES.find((item) => item.subject === subject);
    const label = known?.label ?? subject;
    return {
      title: `${label} books`,
      description: `Browse ${label} titles from Google Books and Open Library.`,
    };
  }
  return {
    title: "Search books",
    description: "Search global books by title, author, ISBN, or subject.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, subject } = await searchParams;
  return (
    <SearchResults q={q?.trim() ?? ""} subject={subject?.trim() ?? ""} />
  );
}
