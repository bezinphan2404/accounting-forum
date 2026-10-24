-- Member-only public feedback; bounded article retrieval and private AI attempt counters.
begin;
create table if not exists public.forum_feedback (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references public.profiles(id),
 kind text not null check(kind in ('idea','bug','content')),
 title text not null check(char_length(btrim(title)) between 1 and 150),
 content text not null check(char_length(btrim(content)) between 1 and 4000),
 status text not null default 'new' check(status in ('new','reviewing','planned','done','declined','hidden')),
 admin_response text not null default '' check(char_length(admin_response)<=4000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.forum_feedback enable row level security;
revoke all on public.forum_feedback from public,anon,authenticated;
grant select on public.forum_feedback to authenticated;
grant insert(author_id,kind,title,content) on public.forum_feedback to authenticated;
grant update(status,admin_response) on public.forum_feedback to authenticated;
drop policy if exists feedback_read on public.forum_feedback;
drop policy if exists feedback_insert on public.forum_feedback;
drop policy if exists feedback_admin_update on public.forum_feedback;
create policy feedback_read on public.forum_feedback for select to authenticated
 using ((select auth.uid()) is not null and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
   and (status<>'hidden' or author_id=(select auth.uid()) or (select public.is_forum_admin())));
create policy feedback_insert on public.forum_feedback for insert to authenticated
 with check(author_id=(select auth.uid()) and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true');
create policy feedback_admin_update on public.forum_feedback for update to authenticated
 using ((select public.is_forum_admin())) with check ((select public.is_forum_admin()));
create index if not exists feedback_created_id on public.forum_feedback(created_at desc,id);

create or replace function public.limit_feedback_writes() returns trigger
language plpgsql security definer set search_path='' as $$
declare used_now integer; begin
 if tg_op='UPDATE' then new.updated_at:=now();return new;end if;
 if auth.uid() is null or new.author_id is distinct from auth.uid() then
   raise exception 'Vui lòng đăng nhập bằng tài khoản của bạn.' using errcode='42501';
 end if;
 insert into forum_private.write_limits(actor,bucket,window_start,used)
 values(new.author_id,'feedback',clock_timestamp(),1)
 on conflict(actor,bucket) do update set
   window_start=case when forum_private.write_limits.window_start<clock_timestamp()-interval '1 hour' then clock_timestamp() else forum_private.write_limits.window_start end,
   used=case when forum_private.write_limits.window_start<clock_timestamp()-interval '1 hour' then 1 else forum_private.write_limits.used+1 end
 returning used into used_now;
 if used_now>5 then raise exception 'Bạn đã gửi 5 góp ý trong một giờ. Vui lòng chờ rồi gửi tiếp.';end if;
 new.status:='new';new.admin_response:='';new.created_at:=now();new.updated_at:=now();return new;
end $$;
revoke all on function public.limit_feedback_writes() from public,anon,authenticated;
drop trigger if exists feedback_write_limits on public.forum_feedback;
create trigger feedback_write_limits before insert or update on public.forum_feedback for each row execute function public.limit_feedback_writes();

create or replace function public.forum_feedback_page(p_offset integer default 0)
returns jsonb language plpgsql stable set search_path='' as $$ begin
 perform public.require_forum_member();
 return (with matching as (
   select f.*,p.name as author_name from public.forum_feedback f join public.profiles p on p.id=f.author_id
 ), page as (
   select * from matching order by created_at desc,id offset greatest(0,least(coalesce(p_offset,0),100000)) limit 20
 ) select jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(page)) from page),'[]'::jsonb),'total',(select count(*) from matching)));
end $$;
revoke all on function public.forum_feedback_page(integer) from public,anon;
grant execute on function public.forum_feedback_page(integer) to authenticated;

create index if not exists threads_ai_search on public.threads using gin(to_tsvector('simple',title||' '||content));
create or replace function public.forum_ai_context(p_query text)
returns jsonb language plpgsql stable set search_path='' as $$
declare q tsquery; begin
 perform public.require_forum_member();
 select string_agg(plainto_tsquery('simple',word)::text,' | ')::tsquery into q from (
   select distinct word from regexp_split_to_table(lower(left(coalesce(p_query,''),1000)),'[^[:alnum:]_]+') word
   where char_length(word)>1 and word not in ('là','và','của','cho','với','như','thế','nào','có','tôi','mình','xin','hỏi','giúp','được','cần','bài','viết') limit 12
 ) words;
 if q is null then return '[]'::jsonb;end if;
 return (select coalesce(jsonb_agg(to_jsonb(article_rows)),'[]'::jsonb) from (
   select id,title,left(content,10000) as content,created_at from public.threads
   where to_tsvector('simple',title||' '||content) @@ q
   order by ts_rank(to_tsvector('simple',title||' '||content),q) desc,created_at desc,id limit 4
 ) article_rows);
end $$;
revoke all on function public.forum_ai_context(text) from public,anon;
grant execute on function public.forum_ai_context(text) to authenticated;

create table if not exists forum_private.ai_daily_usage (
 actor uuid not null references auth.users(id) on delete cascade,
 day date not null,used integer not null default 0,last_call timestamptz,
 primary key(actor,day)
);
create table if not exists forum_private.ai_global_usage (
 day date primary key,used integer not null default 0,
 minute_start timestamptz not null default now(),minute_used integer not null default 0
);
revoke all on forum_private.ai_daily_usage,forum_private.ai_global_usage from public,anon,authenticated;
alter table forum_private.ai_daily_usage enable row level security;
alter table forum_private.ai_global_usage enable row level security;

create or replace function public.forum_ai_reserve()
returns jsonb language plpgsql security definer set search_path='' as $$
declare d date:=timezone('Asia/Ho_Chi_Minh',now())::date;mine forum_private.ai_daily_usage;total forum_private.ai_global_usage;cap integer; begin
 perform public.require_forum_member();
 cap:=case when public.is_forum_admin() then 10 else 5 end;
 insert into forum_private.ai_global_usage(day) values(d) on conflict do nothing;
 select * into total from forum_private.ai_global_usage where day=d for update;
 insert into forum_private.ai_daily_usage(actor,day) values(auth.uid(),d) on conflict do nothing;
 select * into mine from forum_private.ai_daily_usage where actor=auth.uid() and day=d for update;
 if mine.used>=cap then return jsonb_build_object('allowed',false,'message','Bạn đã dùng hết lượt yêu cầu AI hôm nay.');end if;
 if total.used>=20 then return jsonb_build_object('allowed',false,'message','Forum đã dùng hết lượt AI hôm nay. Bạn vẫn có thể tìm và đọc các bài viết.');end if;
 if mine.last_call>clock_timestamp()-interval '10 seconds' then return jsonb_build_object('allowed',false,'message','Vui lòng chờ 10 giây rồi hỏi tiếp.');end if;
 if total.minute_start>clock_timestamp()-interval '1 minute' and total.minute_used>=3 then
   return jsonb_build_object('allowed',false,'message','AI đang có nhiều yêu cầu. Vui lòng thử lại sau một phút.');
 end if;
 update forum_private.ai_global_usage set used=used+1,
   minute_used=case when minute_start<clock_timestamp()-interval '1 minute' then 1 else minute_used+1 end,
   minute_start=case when minute_start<clock_timestamp()-interval '1 minute' then clock_timestamp() else minute_start end where day=d;
 update forum_private.ai_daily_usage set used=used+1,last_call=clock_timestamp() where actor=auth.uid() and day=d;
 return jsonb_build_object('allowed',true,'remaining',cap-mine.used-1);
end $$;
revoke all on function public.forum_ai_reserve() from public,anon;
grant execute on function public.forum_ai_reserve() to authenticated;
notify pgrst,'reload schema';
commit;
