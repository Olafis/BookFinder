export type FavoriteRecord = {
  user_id: string;
  work_id: string;
  title: string;
  author: string | null;
  cover_id: number | null;
  first_publish_year: number | null;
  created_at: string;
};
