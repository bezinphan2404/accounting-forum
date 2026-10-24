-- Additive migration. No users, posts, replies or likes are deleted.
begin;

create or replace function public.create_forum_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,name)
  values(new.id,left(coalesce(nullif(btrim(new.raw_user_meta_data->>'name'),''),nullif(btrim(new.raw_user_meta_data->>'full_name'),''),'Thành viên'),100))
  on conflict(id) do nothing;
  return new;
end $$;
revoke all on function public.create_forum_profile() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_forum on auth.users;
create trigger on_auth_user_created_forum after insert on auth.users
for each row execute function public.create_forum_profile();
insert into public.profiles(id,name)
select id,left(coalesce(nullif(btrim(raw_user_meta_data->>'name'),''),nullif(btrim(raw_user_meta_data->>'full_name'),''),'Thành viên'),100)
from auth.users on conflict(id) do nothing;
drop policy if exists profiles_insert on public.profiles;
revoke insert on public.profiles from anon, authenticated;

-- Explicit public projections: no emails, auth metadata or like-user graph.
create or replace function public.forum_public_profiles(p_ids uuid[])
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(to_jsonb(p)), '[]'::jsonb) from (
    select p.id,p.name,p.bio,p.created_at,coalesce(r.role,'member') as role
    from public.profiles p left join public.forum_roles r on r.user_id=p.id
    where p.id=any(p_ids[1:100])
  ) p;
$$;

create or replace function public.forum_thread_page(p_category text default null,p_search text default null,p_author uuid default null,p_sort text default 'newest',p_offset integer default 0,p_limit integer default 20)
returns jsonb language sql stable security definer set search_path = '' as $$
  with matching as (
    select t.id,t.author_id,t.category_id,t.title,left(t.content,180) as content,t.tags,t.created_at,
      (select count(*) from public.thread_likes l where l.thread_id=t.id) as likes,
      (select count(*) from public.replies r where r.thread_id=t.id) as reply_count
    from public.threads t
    where (p_category is null or t.category_id=p_category)
      and (p_author is null or t.author_id=p_author)
      and (p_search is null or concat_ws(' ',t.title,t.content,array_to_string(t.tags,' ')) ilike '%' || left(p_search,200) || '%')
  ), page as (
    select * from matching order by case when p_sort='most-liked' then likes end desc nulls last,created_at desc,id
    offset greatest(0,least(coalesce(p_offset,0),100000)) limit greatest(1,least(coalesce(p_limit,20),50))
  )
  select jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(page)) from page),'[]'::jsonb),'total',(select count(*) from matching));
$$;

create or replace function public.forum_thread_detail(p_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select to_jsonb(t) || jsonb_build_object(
    'likes',(select count(*) from public.thread_likes l where l.thread_id=t.id),
    'reply_count',(select count(*) from public.replies r where r.thread_id=t.id))
  from public.threads t where t.id=p_id;
$$;

create or replace function public.forum_stats()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('threads',(select count(*) from public.threads),
    'replies',(select count(*) from public.replies),'users',(select count(*) from public.profiles),
    'categories',(select count(*) from public.categories),
    'categoryCounts',coalesce((select jsonb_object_agg(category_id,n) from (select category_id,count(*) n from public.threads group by category_id) q),'{}'::jsonb));
$$;

revoke all on function public.forum_public_profiles(uuid[]), public.forum_thread_page(text,text,uuid,text,integer,integer),public.forum_thread_detail(uuid),public.forum_stats() from public;
grant execute on function public.forum_public_profiles(uuid[]),public.forum_thread_page(text,text,uuid,text,integer,integer),public.forum_thread_detail(uuid),public.forum_stats() to anon,authenticated;

create index if not exists threads_created_id on public.threads(created_at desc,id);
create index if not exists likes_user_thread on public.thread_likes(user_id,thread_id);
alter table public.thread_likes add column if not exists created_at timestamptz not null default now();

create schema if not exists forum_private;
revoke all on schema forum_private from public,anon,authenticated;
create table if not exists forum_private.write_limits (
  actor uuid not null references auth.users(id) on delete cascade,
  bucket text not null,
  window_start timestamptz not null,
  used integer not null,
  primary key(actor,bucket)
);
revoke all on forum_private.write_limits from public,anon,authenticated;
alter table forum_private.write_limits enable row level security;
create or replace function public.limit_forum_writes() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid; used_now integer; cap integer;
begin
  if tg_table_name='thread_likes' then v_actor:=new.user_id; else v_actor:=new.author_id; end if;
  if exists(select 1 from public.forum_roles where user_id=v_actor and role='admin') then new.created_at:=now(); return new; end if;
  cap:=case tg_table_name when 'threads' then 5 when 'replies' then 30 else 60 end;
  insert into forum_private.write_limits(actor,bucket,window_start,used)
  values(v_actor,tg_table_name,clock_timestamp(),1)
  on conflict(actor,bucket) do update set
    window_start=case when forum_private.write_limits.window_start<clock_timestamp()-interval '1 minute' then clock_timestamp() else forum_private.write_limits.window_start end,
    used=case when forum_private.write_limits.window_start<clock_timestamp()-interval '1 minute' then 1 else forum_private.write_limits.used+1 end
  returning used into used_now;
  if used_now>cap then raise exception 'Thao tác quá nhanh. Vui lòng chờ một phút rồi thử lại.' using errcode='P0001'; end if;
  new.created_at:=now();
  return new;
end $$;
revoke all on function public.limit_forum_writes() from public,anon,authenticated;
drop trigger if exists limit_threads on public.threads;
drop trigger if exists limit_replies on public.replies;
drop trigger if exists limit_likes on public.thread_likes;
create trigger limit_threads before insert on public.threads for each row execute function public.limit_forum_writes();
create trigger limit_replies before insert on public.replies for each row execute function public.limit_forum_writes();
create trigger limit_likes before insert on public.thread_likes for each row execute function public.limit_forum_writes();

-- Only editable fields: owners cannot reassign records, times or attribution.
revoke update on public.profiles,public.threads,public.replies from authenticated;
grant update(name,bio) on public.profiles to authenticated;
grant update(title,content,category_id,tags) on public.threads to authenticated;
grant update(content) on public.replies to authenticated;
commit;
