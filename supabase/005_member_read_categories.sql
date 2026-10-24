-- Additive, repeatable migration. Apply after 004. No article/user data changes.
begin;

alter table public.categories add column if not exists parent_id text references public.categories(id);
alter table public.categories add column if not exists sort_order integer not null default 0;
do $$ begin
  if not exists(select 1 from pg_constraint where conrelid='public.categories'::regclass and conname='categories_not_own_parent') then
    alter table public.categories add constraint categories_not_own_parent check(parent_id is distinct from id);
  end if;
end $$;
create index if not exists categories_parent_sort on public.categories(parent_id,sort_order,id);

update public.categories set sort_order=case id
  when 'cat-1' then 10 when 'cat-2' then 20 when 'cat-3' then 30 when 'cat-4' then 40
  when 'cat-8' then 50 when 'cat-7' then 60 when 'cat-5' then 70 when 'cat-6' then 80 end
where id in ('cat-1','cat-2','cat-3','cat-4','cat-5','cat-6','cat-7','cat-8');

insert into public.categories(id,parent_id,sort_order,name,icon,color) values
('cat-1-ledger','cat-1',10,'Chứng từ & hạch toán','📊','#457b9d'),
('cat-1-closing','cat-1',20,'Khóa sổ & báo cáo tài chính','📊','#457b9d'),
('cat-1-inventory','cat-1',30,'Hàng tồn kho & giá thành','📊','#457b9d'),
('cat-1-assets','cat-1',40,'Tài sản & công cụ dụng cụ','📊','#457b9d'),
('cat-1-receivables','cat-1',50,'Tiền & công nợ','📊','#457b9d'),
('cat-2-vat','cat-2',10,'Thuế GTGT','🧾','#e76f51'),
('cat-2-cit','cat-2',20,'Thuế TNDN','🧾','#e76f51'),
('cat-2-pit','cat-2',30,'Thuế TNCN','🧾','#e76f51'),
('cat-2-fct','cat-2',40,'Thuế nhà thầu','🧾','#e76f51'),
('cat-2-customs','cat-2',50,'Thuế xuất nhập khẩu','🧾','#e76f51'),
('cat-2-excise','cat-2',60,'Thuế tiêu thụ đặc biệt','🧾','#e76f51'),
('cat-2-resources','cat-2',70,'Thuế tài nguyên','🧾','#e76f51'),
('cat-2-environment','cat-2',80,'Thuế bảo vệ môi trường','🧾','#e76f51'),
('cat-2-land','cat-2',90,'Thuế & nghĩa vụ về đất đai','🧾','#e76f51'),
('cat-2-invoices','cat-2',100,'Chuyên đề: hóa đơn điện tử','🧾','#e76f51'),
('cat-2-administration','cat-2',110,'Chuyên đề: quản lý thuế & kê khai','🧾','#e76f51'),
('cat-2-households','cat-2',120,'Chuyên đề: hộ & cá nhân kinh doanh','🧾','#e76f51'),
('cat-3-budget','cat-3',10,'Ngân sách & dự báo','📈','#2a9d8f'),
('cat-3-cost','cat-3',20,'Chi phí & hiệu quả kinh doanh','📈','#2a9d8f'),
('cat-3-cashflow','cat-3',30,'Dòng tiền & báo cáo quản trị','📈','#2a9d8f'),
('cat-4-control','cat-4',10,'Kiểm soát nội bộ','🔍','#9b8ec4'),
('cat-4-audit','cat-4',20,'Kiểm toán báo cáo tài chính','🔍','#9b8ec4'),
('cat-4-review','cat-4',30,'Soát xét & hồ sơ kiểm toán','🔍','#9b8ec4'),
('cat-8-insurance','cat-8',10,'BHXH, BHYT & BHTN','⚖️','#e07a8f'),
('cat-8-labor','cat-8',20,'Lao động & tiền lương','⚖️','#e07a8f'),
('cat-8-enterprise','cat-8',30,'Doanh nghiệp & hợp đồng','⚖️','#e07a8f'),
('cat-8-accounting','cat-8',40,'Chế độ & chuẩn mực kế toán','⚖️','#e07a8f'),
('cat-7-excel','cat-7',10,'Excel & Power Query','💻','#7ec8a0'),
('cat-7-software','cat-7',20,'Phần mềm kế toán & hóa đơn','💻','#7ec8a0'),
('cat-7-automation','cat-7',30,'Tự động hóa nghiệp vụ','💻','#7ec8a0'),
('cat-5-accounting','cat-5',10,'Biểu mẫu kế toán','📁','#e9c46a'),
('cat-5-tax','cat-5',20,'Biểu mẫu thuế','📁','#e9c46a'),
('cat-5-labor','cat-5',30,'Biểu mẫu lao động & BHXH','📁','#e9c46a'),
('cat-5-tools','cat-5',40,'Bảng tính & công cụ thực hành','📁','#e9c46a'),
('cat-6-accounting','cat-6',10,'Hỏi đáp kế toán','💬','#f4a261'),
('cat-6-tax','cat-6',20,'Hỏi đáp thuế','💬','#f4a261'),
('cat-6-labor','cat-6',30,'Hỏi đáp lao động & BHXH','💬','#f4a261'),
('cat-6-tools','cat-6',40,'Hỏi đáp phần mềm & biểu mẫu','💬','#f4a261')
on conflict(id) do update set parent_id=excluded.parent_id,sort_order=excluded.sort_order;

-- Handle existing SELECT policy names, without changing write policies.
do $$ declare r record; t text; cols text; begin
  for r in select tablename,policyname from pg_policies
    where schemaname='public' and tablename in ('profiles','categories','threads','replies') and cmd='SELECT'
  loop execute format('drop policy %I on public.%I',r.policyname,r.tablename); end loop;
  foreach t in array array['profiles','categories','threads','replies'] loop
    execute format('create policy member_read on public.%I for select to authenticated using ((select auth.uid()) is not null and coalesce((select auth.jwt()->>''is_anonymous''),''false'')<>''true'')',t);
    -- Restrictive policy also covers a possible pre-existing FOR ALL policy.
    execute format('create policy member_read_guard on public.%I as restrictive for select to authenticated using ((select auth.uid()) is not null and coalesce((select auth.jwt()->>''is_anonymous''),''false'')<>''true'')',t);
  end loop;
  foreach t in array array['profiles','categories','threads','replies','thread_likes','forum_roles'] loop
    execute format('revoke select on public.%I from public,anon',t);
    select string_agg(quote_ident(attname),',') into cols from pg_attribute
      where attrelid=format('public.%I',t)::regclass and attnum>0 and not attisdropped;
    execute format('revoke select (%s) on public.%I from public,anon',cols,t);
  end loop;
end $$;

create or replace function public.require_forum_member() returns void
language plpgsql stable set search_path='' as $$ begin
  if auth.uid() is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'Vui lòng đăng nhập để xem nội dung.' using errcode='42501'; end if;
end $$;
revoke all on function public.require_forum_member() from public,anon;
grant execute on function public.require_forum_member() to authenticated;

create or replace function public.forum_public_profiles(p_ids uuid[])
returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
  perform public.require_forum_member();
  return (select coalesce(jsonb_agg(to_jsonb(p)),'[]'::jsonb) from (
    select p.id,p.name,p.bio,p.created_at,coalesce(r.role,'member') as role
    from public.profiles p left join public.forum_roles r on r.user_id=p.id
    where p.id=any(p_ids[1:100])
  ) p);
end $$;

create or replace function public.forum_thread_page(p_category text default null,p_search text default null,p_author uuid default null,p_sort text default 'newest',p_offset integer default 0,p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
  perform public.require_forum_member();
  return (
    with recursive selected_categories(id) as (
      select id from public.categories where id=p_category
      union select c.id from public.categories c join selected_categories s on c.parent_id=s.id
    ), matching as (
      select t.id,t.author_id,t.category_id,t.title,left(t.content,180) as content,t.tags,t.created_at,
        (select count(*) from public.thread_likes l where l.thread_id=t.id) as likes,
        (select count(*) from public.replies r where r.thread_id=t.id) as reply_count
      from public.threads t
      where (p_category is null or t.category_id in (select id from selected_categories))
        and (p_author is null or t.author_id=p_author)
        and (p_search is null or concat_ws(' ',t.title,t.content,array_to_string(t.tags,' ')) ilike '%' || left(p_search,200) || '%')
    ), page as (
      select * from matching order by case when p_sort='most-liked' then likes end desc nulls last,created_at desc,id
      offset greatest(0,least(coalesce(p_offset,0),100000)) limit greatest(1,least(coalesce(p_limit,20),50))
    )
    select jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(page)) from page),'[]'::jsonb),'total',(select count(*) from matching))
  );
end $$;

create or replace function public.forum_thread_detail(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
  perform public.require_forum_member();
  return (select to_jsonb(t) || jsonb_build_object(
    'likes',(select count(*) from public.thread_likes l where l.thread_id=t.id),
    'reply_count',(select count(*) from public.replies r where r.thread_id=t.id))
  from public.threads t where t.id=p_id);
end $$;

create or replace function public.forum_stats()
returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
  perform public.require_forum_member();
  return (
    with recursive ancestry(child,ancestor) as (
      select id,id from public.categories
      union select a.child,c.parent_id from ancestry a join public.categories c on c.id=a.ancestor where c.parent_id is not null
    ), counts as (
      select a.ancestor,count(*) n from ancestry a join public.threads t on t.category_id=a.child group by a.ancestor
    )
    select jsonb_build_object('threads',(select count(*) from public.threads),
      'replies',(select count(*) from public.replies),'users',(select count(*) from public.profiles),
      'categories',(select count(*) from public.categories where parent_id is null),
      'subcategories',(select count(*) from public.categories where parent_id is not null),
      'categoryCounts',coalesce((select jsonb_object_agg(ancestor,n) from counts),'{}'::jsonb))
  );
end $$;

revoke all on function public.forum_public_profiles(uuid[]),public.forum_thread_page(text,text,uuid,text,integer,integer),public.forum_thread_detail(uuid),public.forum_stats() from public,anon;
revoke all on function public.is_forum_admin() from public,anon;
grant execute on function public.forum_public_profiles(uuid[]),public.forum_thread_page(text,text,uuid,text,integer,integer),public.forum_thread_detail(uuid),public.forum_stats() to authenticated;
notify pgrst,'reload schema';
commit;
