create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  uid text not null unique,
  name text not null,
  bio text not null default '',
  "photoUrl" text,
  reviews jsonb not null default '[]'::jsonb,
  watched jsonb not null default '[]'::jsonb,
  favourites jsonb not null default '[]'::jsonb
);

create table if not exists public.movies (
  id text primary key,
  reviews jsonb not null default '[]'::jsonb
);

alter table public.users enable row level security;
alter table public.movies enable row level security;

create policy "Users are visible to everyone"
  on public.users for select
  using (true);

create policy "Users can create their own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Movies are visible to everyone"
  on public.movies for select
  using (true);

create policy "Authenticated users can create movie review containers"
  on public.movies for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update movie reviews"
  on public.movies for update
  to authenticated
  using (true)
  with check (true);
