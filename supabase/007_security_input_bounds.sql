-- Additive and repeatable. Requires 005. No content/user records are rewritten.
begin;

create or replace function public.forum_tags_valid(p_tags text[]) returns boolean
language sql immutable parallel safe set search_path='' as $$
  select p_tags is not null
    and coalesce(array_ndims(p_tags),1)=1
    and cardinality(p_tags)<=10
    and not exists (
      select 1 from unnest(p_tags) as tag
      where tag is null or char_length(tag) not between 1 and 50
        or btrim(tag)='' or octet_length(tag)>200
    );
$$;
revoke all on function public.forum_tags_valid(text[]) from public,anon;
grant execute on function public.forum_tags_valid(text[]) to authenticated;

-- Stop atomically rather than truncating pre-existing member data.
do $$ begin
  if exists(select 1 from public.profiles where char_length(bio)>2000 or octet_length(bio)>8000)
     or exists(select 1 from public.threads where not public.forum_tags_valid(tags)) then
    raise exception 'Existing forum data exceeds the proposed limits; review affected records before applying this migration.' using errcode='23514';
  end if;
  if not exists(select 1 from pg_constraint where conrelid='public.profiles'::regclass and conname='profiles_bio_size') then
    alter table public.profiles add constraint profiles_bio_size check(char_length(bio)<=2000 and octet_length(bio)<=8000) not valid;
  end if;
  if not exists(select 1 from pg_constraint where conrelid='public.threads'::regclass and conname='threads_tags_size') then
    alter table public.threads add constraint threads_tags_size check(public.forum_tags_valid(tags)) not valid;
  end if;
end $$;
alter table public.profiles validate constraint profiles_bio_size;
alter table public.threads validate constraint threads_tags_size;

create or replace function public.forum_public_profiles(p_ids uuid[])
returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
  perform public.require_forum_member();
  if p_ids is null or cardinality(p_ids)=0 then return '[]'::jsonb; end if;
  if array_ndims(p_ids)<>1 or cardinality(p_ids)>100 then
    raise exception 'Chỉ chấp nhận tối đa 100 mã hồ sơ trong mảng một chiều.' using errcode='22023';
  end if;
  if array_position(p_ids,null) is not null then
    raise exception 'Mã hồ sơ không được để trống.' using errcode='22023';
  end if;
  return (select coalesce(jsonb_agg(to_jsonb(p)),'[]'::jsonb) from (
    select p.id,p.name,p.bio,p.created_at,coalesce(r.role,'member') as role
    from public.profiles p left join public.forum_roles r on r.user_id=p.id
    where p.id=any(p_ids)
  ) p);
end $$;
revoke all on function public.forum_public_profiles(uuid[]) from public,anon;
grant execute on function public.forum_public_profiles(uuid[]) to authenticated;
notify pgrst,'reload schema';
commit;
