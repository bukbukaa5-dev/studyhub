-- StudyHub database schema for Supabase
-- Run the entire file in Supabase Dashboard -> SQL Editor -> New query.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Суралцагч',
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Програмчлал',
  level text not null default 'Анхан шат',
  duration text not null default '4 цаг',
  lessons integer not null default 10 check (lessons > 0),
  students integer not null default 0 check (students >= 0),
  rating text not null default '4.8',
  price integer not null default 0 check (price >= 0),
  color text not null default 'violet',
  icon text not null default '✦',
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  amount integer not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending','paid','cancelled')),
  created_at timestamptz not null default now()
);

-- Create a profile automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.orders enable row level security;

-- Helper checks the user's role without recursive profile-table policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
grant execute on function public.is_admin() to authenticated;

-- Profiles: users can see/update their own profile; admins can manage all profiles.
drop policy if exists "profile select own or admin" on public.profiles;
create policy "profile select own or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());
drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()) and role = 'student');
drop policy if exists "profile insert own" on public.profiles;
create policy "profile insert own" on public.profiles for insert to authenticated
with check (id = (select auth.uid()) and role = 'student');

-- Courses are readable by everyone; only admins can write.
drop policy if exists "courses public read" on public.courses;
create policy "courses public read" on public.courses for select to anon, authenticated using (true);
drop policy if exists "courses admin insert" on public.courses;
create policy "courses admin insert" on public.courses for insert to authenticated with check (public.is_admin());
drop policy if exists "courses admin update" on public.courses;
create policy "courses admin update" on public.courses for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "courses admin delete" on public.courses;
create policy "courses admin delete" on public.courses for delete to authenticated using (public.is_admin());

-- Enrollments: users see/create only their own; admins can inspect/manage all.
drop policy if exists "enrollments select own or admin" on public.enrollments;
create policy "enrollments select own or admin" on public.enrollments for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "enrollments insert own" on public.enrollments;
create policy "enrollments insert own" on public.enrollments for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "enrollments update admin" on public.enrollments;
create policy "enrollments update admin" on public.enrollments for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "enrollments delete own or admin" on public.enrollments;
create policy "enrollments delete own or admin" on public.enrollments for delete to authenticated using (user_id = (select auth.uid()) or public.is_admin());

-- Orders: customers see/create their own; only admins may change order status.
drop policy if exists "orders select own or admin" on public.orders;
create policy "orders select own or admin" on public.orders for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "orders insert own pending" on public.orders;
create policy "orders insert own pending" on public.orders for insert to authenticated with check (user_id = (select auth.uid()) and status = 'pending');
drop policy if exists "orders update admin" on public.orders;
create policy "orders update admin" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Starter courses are inserted by the app as demo content; optional seed rows can be added here.
