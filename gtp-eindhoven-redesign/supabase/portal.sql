-- Run once in the SQL editor of the GTP Supabase project.
create table if not exists public.portal_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null check (char_length(full_name) between 1 and 100),
 phone text not null default '' check (char_length(phone) <= 30),
 city text not null default '' check (char_length(city) <= 100),
 interests text[] not null default '{}',
 privacy_acknowledged_at timestamptz,
 updated_at timestamptz not null default now(),
 constraint allowed_interests check (interests <@ array['Worship','Media','Welcome team','Children’s ministry','Prayer team']::text[])
);
create table if not exists public.portal_registrations (
 user_id uuid not null references auth.users(id) on delete cascade,
 gathering_id text not null check (gathering_id in ('sunday','eindhoven','helmond','best')),
 created_at timestamptz not null default now(),
 primary key (user_id,gathering_id)
);
alter table public.portal_profiles enable row level security;
alter table public.portal_registrations enable row level security;
revoke all on public.portal_profiles,public.portal_registrations from anon,authenticated;
grant select on public.portal_profiles to authenticated;
grant update (full_name,phone,city,interests,updated_at) on public.portal_profiles to authenticated;
grant select,insert,update,delete on public.portal_registrations to authenticated;
create policy "Own profile read" on public.portal_profiles for select to authenticated using ((select auth.uid())=id);
create policy "Own profile update" on public.portal_profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "Own registration read" on public.portal_registrations for select to authenticated using ((select auth.uid())=user_id);
create policy "Own registration insert" on public.portal_registrations for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Own registration update" on public.portal_registrations for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Own registration delete" on public.portal_registrations for delete to authenticated using ((select auth.uid())=user_id);
create or replace function public.create_portal_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.portal_profiles(id,full_name,privacy_acknowledged_at)
 values(new.id,left(coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'GTP member'),100),now());
 return new;
end;
$$;
revoke execute on function public.create_portal_profile() from public,anon,authenticated;
create trigger on_portal_user_created after insert on auth.users for each row execute function public.create_portal_profile();
