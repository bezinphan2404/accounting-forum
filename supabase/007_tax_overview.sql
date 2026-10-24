-- Give the cross-tax overview a visible child category, alongside tax-specific articles.
begin;
insert into public.categories(id,parent_id,sort_order,name,icon,color)
values('cat-2-overview','cat-2',5,'Tổng quan & cập nhật thuế','🧾','#e76f51')
on conflict(id) do nothing;
do $$ declare before_articles text; after_articles text; begin
  select md5(coalesce(jsonb_agg(to_jsonb(t)-'category_id' order by t.id)::text,'[]')) into before_articles from public.threads t;
  update public.threads set category_id='cat-2-overview'
  where id='9b89b85f-09c0-47bb-a4c1-784e0832c378' and category_id='cat-2'
    and title='Cập nhật thuế 2026: bảng tra nhanh và việc kế toán cần làm cuối năm';
  select md5(coalesce(jsonb_agg(to_jsonb(t)-'category_id' order by t.id)::text,'[]')) into after_articles from public.threads t;
  if before_articles is distinct from after_articles then
    raise exception 'Unexpected article change outside category; rolling back.';
  end if;
end $$;
commit;
