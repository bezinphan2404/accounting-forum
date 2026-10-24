-- Apply AFTER the hardened frontend is live; old cached clients must reload.
begin;
drop policy if exists likes_read on public.thread_likes;
drop policy if exists thread_likes_read on public.thread_likes;
create policy likes_read on public.thread_likes for select to authenticated
using (user_id = (select auth.uid()));
revoke select on public.thread_likes from anon;

commit;
