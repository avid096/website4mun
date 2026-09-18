create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;
alter table public.site_content enable row level security;

create schema if not exists private;

create or replace function private.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.site_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on public.site_admins from anon, authenticated;
revoke all on function private.is_site_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_site_admin() to authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can add site content" on public.site_content;
create policy "Admins can add site content"
on public.site_content
for insert
to authenticated
with check ((select private.is_site_admin()));

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));
