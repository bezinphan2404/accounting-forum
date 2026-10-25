-- Public article reading; member-only attachments. No article/file content rewritten.
-- Additive; apply after 008. Existing member/write/profile RPCs remain restricted.
begin;
drop policy if exists reply_member_insert_guard on public.replies;
create policy reply_member_insert_guard on public.replies as restrictive for insert to authenticated with check (
 (select auth.uid()) is not null and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true');
create or replace function public.forum_guest_hidden_ids() returns uuid[]
language sql immutable set search_path='' as $$select array['a68bb0d2-6ffe-4988-ada6-b12ce6404ccb'::uuid,'e6ce4456-d509-4289-8dcb-bf7f9765f9ca'::uuid,'e79e3cc4-bb24-4ec7-87ac-fce010bbae1d'::uuid,'f8ad919b-2b35-401f-a4bf-1ecda9fd1a7e'::uuid,'8bdd5836-7209-485e-a6e9-332ffd72ab9c'::uuid,'851bd0da-883b-458b-8f19-30f67b6d9ced'::uuid,'67a06d36-0107-4d64-ae4d-195eac688c58'::uuid,'9fd210f0-ff19-4d8e-83fe-be51c2d97d05'::uuid,'cedf79df-f12a-40c5-a845-86f3dbb97f47'::uuid,'39f36445-484b-4193-9ba9-dce7a869338a'::uuid,'94d2dd90-5bb2-4225-92ec-efa555c9d0ad'::uuid,'6c527b18-6cf8-438d-bb86-017a6a790263'::uuid,'b0fffdb1-d0ae-4ff5-a5c5-4e1ad7dc220e'::uuid,'50587396-26c1-4eef-b135-785857dae0de'::uuid,'1130f38b-739a-4fe3-85b2-12c2c7745681'::uuid,'48992f48-9b23-4a4c-b44e-c6af6abcbd91'::uuid,'fd0c4d4c-40e6-40b9-aaad-a044075e3701'::uuid,'9c5dc4b8-4581-4334-afe0-fee496da42bb'::uuid,'c94480d1-e1ed-4c0f-88f6-60f6fbc69bb0'::uuid]$$;
revoke all on function public.forum_guest_hidden_ids() from public,anon,authenticated;

create table if not exists public.forum_attachments (
 id uuid primary key default gen_random_uuid(),
 thread_id uuid not null references public.threads(id) on delete cascade,
 filename text not null check(char_length(filename) between 1 and 200 and filename !~ '[\\/[:cntrl:]]'),
 storage_path text not null unique check(storage_path ~ '^[a-z0-9-]{36}/[a-z0-9-]{36}\.(pdf|docx|xlsx|png|jpg)$'),
 mime_type text not null check(mime_type in ('application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/png','image/jpeg')),
 byte_size bigint not null check(byte_size between 1 and 10485760),
 source_url text not null check(source_url ~ '^https://[^[:space:]]+$' and char_length(source_url)<=2000),
 license_text text not null check(char_length(btrim(license_text)) between 1 and 2000),
 original_editor_id uuid not null default auth.uid() references public.profiles(id),
 original_editor_name text not null default '',
 approved boolean not null default false,
 approved_by uuid references public.profiles(id),
 approved_at timestamptz,
 created_at timestamptz not null default now()
);
alter table public.forum_attachments enable row level security;
revoke all on public.forum_attachments from public,anon,authenticated;
grant select on public.forum_attachments to authenticated;
grant insert(thread_id,filename,storage_path,mime_type,byte_size,source_url,license_text) on public.forum_attachments to authenticated;
grant update(approved) on public.forum_attachments to authenticated;
drop policy if exists attachment_member_read on public.forum_attachments;
drop policy if exists attachment_admin_insert on public.forum_attachments;
drop policy if exists attachment_admin_approve on public.forum_attachments;
create policy attachment_member_read on public.forum_attachments for select to authenticated using (
 (select auth.uid()) is not null and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
 and (approved or (select public.is_forum_admin())));
create policy attachment_admin_insert on public.forum_attachments for insert to authenticated with check (
 (select public.is_forum_admin()) and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true');
create policy attachment_admin_approve on public.forum_attachments for update to authenticated using (
 (select public.is_forum_admin()) and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true') with check ((select public.is_forum_admin()));
create or replace function public.stamp_forum_attachment() returns trigger
language plpgsql security definer set search_path='' as $$begin
 if tg_op='INSERT' then
   new.original_editor_id:=auth.uid();
   select name into new.original_editor_name from public.profiles where id=auth.uid();
   new.approved:=false;new.approved_by:=null;new.approved_at:=null;new.created_at:=now();
 else
   if row(new.original_editor_id,new.original_editor_name,new.storage_path,new.filename,new.thread_id,new.mime_type,new.byte_size,new.source_url,new.license_text,new.created_at)
      is distinct from row(old.original_editor_id,old.original_editor_name,old.storage_path,old.filename,old.thread_id,old.mime_type,old.byte_size,old.source_url,old.license_text,old.created_at) then
     raise exception 'Tạo phiên bản mới để thay đổi tệp hoặc thông tin phát hành.';
   end if;
   if new.approved is distinct from old.approved then
     new.approved_by:=case when new.approved then auth.uid() else null end;
     new.approved_at:=case when new.approved then now() else null end;
   end if;
 end if;return new;
end $$;
revoke all on function public.stamp_forum_attachment() from public,anon,authenticated;
drop trigger if exists stamp_forum_attachment on public.forum_attachments;
create trigger stamp_forum_attachment before insert or update on public.forum_attachments for each row execute function public.stamp_forum_attachment();
create index if not exists forum_attachments_thread on public.forum_attachments(thread_id,approved);

-- This bucket is private. Only separately reviewed, approved files may be published.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('forum-resources','forum-resources',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/png','image/jpeg'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists forum_resource_read on storage.objects;
drop policy if exists forum_resource_read_guard on storage.objects;
drop policy if exists forum_resource_insert on storage.objects;
drop policy if exists forum_resource_insert_guard on storage.objects;
drop policy if exists forum_resource_update_guard on storage.objects;
drop policy if exists forum_resource_delete_guard on storage.objects;
create policy forum_resource_read on storage.objects for select to authenticated using (
 bucket_id='forum-resources' and (select auth.uid()) is not null and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
 and exists(select 1 from public.forum_attachments a where a.storage_path=name and (a.approved or (select public.is_forum_admin()))));
-- Restrictive guards prevent unrelated pre-existing permissive policies exposing this bucket.
-- auth.uid() check avoids invoking the member-only admin helper for guests.
create policy forum_resource_read_guard on storage.objects as restrictive for select to public using (
 bucket_id<>'forum-resources' or ((select auth.uid()) is not null and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
 and exists(select 1 from public.forum_attachments a where a.storage_path=name and (a.approved or (select public.is_forum_admin())))));
create policy forum_resource_insert on storage.objects for insert to authenticated with check (
 bucket_id='forum-resources' and (select public.is_forum_admin()) and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
 and exists(select 1 from public.forum_attachments a where a.storage_path=name and not a.approved));
create policy forum_resource_insert_guard on storage.objects as restrictive for insert to public with check (
 bucket_id<>'forum-resources' or ((select auth.uid()) is not null and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
 and exists(select 1 from public.forum_attachments a where a.storage_path=name and not a.approved)));
create policy forum_resource_update_guard on storage.objects as restrictive for update to public using (bucket_id<>'forum-resources') with check(bucket_id<>'forum-resources');
create policy forum_resource_delete_guard on storage.objects as restrictive for delete to public using (bucket_id<>'forum-resources');

create or replace function public.forum_guest_catalog() returns jsonb
language sql stable security definer set search_path='' as $$
 with recursive ancestry(child,ancestor) as (
  select id,id from public.categories union select a.child,c.parent_id from ancestry a join public.categories c on c.id=a.ancestor where c.parent_id is not null
 ), visible as (select id,category_id from public.threads where not(id=any(public.forum_guest_hidden_ids()))),
 counts as (select ancestor,count(*) n from ancestry a join visible t on t.category_id=a.child group by ancestor)
 select jsonb_build_object('categories',(select coalesce(jsonb_agg(to_jsonb(c) order by sort_order,id),'[]'::jsonb) from (select id,name,icon,color,parent_id,sort_order from public.categories) c),
 'stats',jsonb_build_object('threads',(select count(*) from visible),'users',(select count(*) from public.profiles),
 'replies',(select count(*) from public.replies r join visible t on t.id=r.thread_id),'categories',(select count(*) from public.categories where parent_id is null),
 'categoryCounts',coalesce((select jsonb_object_agg(ancestor,n) from counts),'{}'::jsonb)))
$$;
create or replace function public.forum_guest_thread_page(p_category text default null,p_search text default null,p_sort text default 'newest',p_offset integer default 0,p_limit integer default 20)
returns jsonb language sql stable security definer set search_path='' as $$
 with recursive selected_categories(id) as (
  select id from public.categories where id=p_category union select c.id from public.categories c join selected_categories s on c.parent_id=s.id
 ), matching as (
  select t.id,t.author_id,t.category_id,t.title,left(t.content,180) content,t.tags,t.created_at,
   (select count(*) from public.thread_likes l where l.thread_id=t.id) likes,
   (select count(*) from public.replies r where r.thread_id=t.id) reply_count
  from public.threads t where not(t.id=any(public.forum_guest_hidden_ids()))
   and (p_category is null or t.category_id in(select id from selected_categories))
   and (p_search is null or concat_ws(' ',t.title,t.content,array_to_string(t.tags,' ')) ilike '%'||left(p_search,200)||'%')
 ), page as (
  select * from matching order by case when p_sort='most-liked' then likes end desc nulls last,created_at desc,id
  offset greatest(0,least(coalesce(p_offset,0),100000)) limit greatest(1,least(coalesce(p_limit,20),50))
 ) select jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(page)) from page),'[]'::jsonb),'total',(select count(*) from matching),
 'authors',coalesce((select jsonb_agg(to_jsonb(p)) from (select p.id,p.name,coalesce(r.role,'member') role from public.profiles p left join public.forum_roles r on r.user_id=p.id where p.id in(select author_id from page)) p),'[]'::jsonb))
$$;
create or replace function public.forum_guest_thread_detail(p_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('thread',jsonb_build_object('id',t.id,'author_id',t.author_id,'category_id',t.category_id,'title',t.title,'content',t.content,'tags',t.tags,'created_at',t.created_at,
  'likes',(select count(*) from public.thread_likes l where l.thread_id=t.id),'reply_count',(select count(*) from public.replies r where r.thread_id=t.id),
  'has_attachments',exists(select 1 from public.forum_attachments a where a.thread_id=t.id and a.approved)),
 'author',jsonb_build_object('id',p.id,'name',p.name,'role',coalesce(r.role,'member')))
 from public.threads t join public.profiles p on p.id=t.author_id left join public.forum_roles r on r.user_id=p.id
 where t.id=p_id and not(t.id=any(public.forum_guest_hidden_ids()))
$$;
revoke all on function public.forum_guest_catalog(),public.forum_guest_thread_page(text,text,text,integer,integer),public.forum_guest_thread_detail(uuid) from public;
grant execute on function public.forum_guest_catalog(),public.forum_guest_thread_page(text,text,text,integer,integer),public.forum_guest_thread_detail(uuid) to anon,authenticated;
notify pgrst,'reload schema';
commit;
