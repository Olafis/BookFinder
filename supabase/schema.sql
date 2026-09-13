-- Run this in the Supabase SQL Editor once.
-- Dashboard: https://supabase.com/dashboard/project/nwcuhpowzgylrzrftaf/sql/new

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  work_id text not null,
  title text not null,
  author text,
  cover_id integer,
  first_publish_year integer,
  created_at timestamptz not null default now(),
  primary key (user_id, work_id)
);

create index if not exists favorites_user_created_idx
  on public.favorites (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "read own favorites" on public.favorites;
create policy "read own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "insert own favorites" on public.favorites;
create policy "insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "delete own favorites" on public.favorites;
create policy "delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
