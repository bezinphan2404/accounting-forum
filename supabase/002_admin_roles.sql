-- Run only after confirming the owner's auth.users UUID.
-- Membership roles are stored separately so profile editing cannot grant admin.
begin;
create table public.forum_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','moderator'))
);
alter table public.forum_roles enable row level security;
revoke all on public.forum_roles from anon, authenticated;
grant select on public.forum_roles to authenticated;
create policy own_role_read on public.forum_roles for select to authenticated
  using (user_id = (select auth.uid()));
create function public.is_forum_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.forum_roles where user_id = auth.uid() and role = 'admin'); $$;
revoke all on function public.is_forum_admin() from public;
grant execute on function public.is_forum_admin() to authenticated;
create policy admin_threads_update on public.threads for update to authenticated
using ((select public.is_forum_admin())) with check ((select public.is_forum_admin()));
create policy admin_replies_update on public.replies for update to authenticated
using ((select public.is_forum_admin())) with check ((select public.is_forum_admin()));
grant update on public.replies to authenticated;
commit;
