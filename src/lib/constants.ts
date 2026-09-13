export const SITE_NAME = "BookFinder";

export const OPEN_LIBRARY_ORIGIN = "https://openlibrary.org";
export const OPEN_LIBRARY_COVERS = "https://covers.openlibrary.org";

export const SEARCH_PAGE_SIZE = 20;
export const SUGGESTION_LIMIT = 6;
export const RELATED_LIMIT = 12;
export const SEARCH_DEBOUNCE_MS = 500;
export const INLINE_AD_AFTER = 4;

export const RATE_LIMIT_MESSAGE =
  "Please try again in a moment. / 잠시 후 다시 시도해 주세요";

export const CATEGORIES = [
  {
    slug: "fiction",
    label: "Fiction",
    ko: "소설",
    subject: "fiction",
    blurb: "Stories that travel well.",
  },
  {
    slug: "science",
    label: "Science",
    ko: "과학",
    subject: "science",
    blurb: "From atoms to galaxies.",
  },
  {
    slug: "history",
    label: "History",
    ko: "역사",
    subject: "history",
    blurb: "How the world was made.",
  },
  {
    slug: "art",
    label: "Art",
    ko: "예술",
    subject: "art",
    blurb: "Color, form, and craft.",
  },
  {
    slug: "business",
    label: "Business",
    ko: "비즈니스",
    subject: "business",
    blurb: "Markets, makers, money.",
  },
  {
    slug: "biography",
    label: "Biography",
    ko: "전기",
    subject: "biography",
    blurb: "Lives worth rereading.",
  },
  {
    slug: "philosophy",
    label: "Philosophy",
    ko: "철학",
    subject: "philosophy",
    blurb: "Questions that linger.",
  },
  {
    slug: "technology",
    label: "Technology",
    ko: "기술",
    subject: "technology",
    blurb: "Tools that reshape us.",
  },
] as const;

export const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "cover_i",
  "isbn",
  "publisher",
  "number_of_pages_median",
  "subject",
].join(",");
