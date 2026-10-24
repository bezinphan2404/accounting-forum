-- Categorize the two existing single-topic articles after migration 005.
-- Verified IDs and current categories; no title/content/author/time is changed.
begin;
do $$ declare before_articles text; after_articles text; begin
  select md5(coalesce(jsonb_agg(to_jsonb(t)-'category_id' order by t.id)::text,'[]')) into before_articles from public.threads t;
  update public.threads set category_id='cat-2-vat'
  where id='0e522016-cd9b-4002-a022-1f8e9a931b43' and category_id='cat-2'
    and title='Thuế GTGT nông sản, gỗ/măng và dược liệu sau Luật 149 — sơ đồ 3 cột';
  update public.threads set category_id='cat-8-insurance'
  where id='1786c9d6-c5dc-4915-95ed-7774bfe91744' and category_id='cat-8'
    and title='BHXH và tiền lương 2026: đối tượng, mức đóng và checklist cho kế toán';
  select md5(coalesce(jsonb_agg(to_jsonb(t)-'category_id' order by t.id)::text,'[]')) into after_articles from public.threads t;
  if before_articles is distinct from after_articles then
    raise exception 'Unexpected article change outside category; rolling back.';
  end if;
end $$;
commit;
