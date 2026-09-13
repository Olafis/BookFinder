export type SearchDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  publisher?: string[];
  number_of_pages_median?: number;
  subject?: string[];
};

export type SearchResponse = {
  num_found: number;
  start: number;
  docs: SearchDoc[];
};

export type WorkRecord = {
  key: string;
  title: string;
  description?: string | { value?: string };
  covers?: number[];
  subjects?: string[];
  authors?: { author?: { key?: string } }[];
  first_publish_date?: string;
};

export type BookDetail = {
  workId: string;
  title: string;
  description: string;
  authors: string[];
  coverId?: number;
  subjects: string[];
  publishers: string[];
  pageCount?: number;
  firstPublishYear?: number;
  isbn?: string;
};

export type SearchQuery = {
  q?: string;
  subject?: string;
  page?: number;
  limit?: number;
};
