-- BZ Forum: shared data, with per-user write access.
begin;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  bio text not null default '',
  created_at timestamptz not null default now()
);
create table public.categories (
  id text primary key,
  name text not null,
  icon text not null default '',
  color text not null default '#457b9d'
);
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  category_id text not null references public.categories(id),
  title text not null check (char_length(title) between 1 and 300),
  content text not null check (char_length(content) between 1 and 50000),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  content text not null check (char_length(content) between 1 and 10000),
  created_at timestamptz not null default now()
);
create table public.thread_likes (
  thread_id uuid not null references public.threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (thread_id, user_id)
);
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.threads enable row level security;
alter table public.replies enable row level security;
alter table public.thread_likes enable row level security;
create policy profiles_read on public.profiles for select to anon, authenticated using (true);
create policy profiles_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy categories_read on public.categories for select to anon, authenticated using (true);
create policy threads_read on public.threads for select to anon, authenticated using (true);
create policy threads_insert on public.threads for insert to authenticated with check ((select auth.uid()) = author_id);
create policy threads_update on public.threads for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy replies_read on public.replies for select to anon, authenticated using (true);
create policy replies_insert on public.replies for insert to authenticated with check ((select auth.uid()) = author_id);
create policy likes_read on public.thread_likes for select to anon, authenticated using (true);
create policy likes_insert on public.thread_likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy likes_delete on public.thread_likes for delete to authenticated using ((select auth.uid()) = user_id);
grant select on public.profiles, public.categories, public.threads, public.replies, public.thread_likes to anon, authenticated;
grant insert, update on public.profiles, public.threads to authenticated;
grant insert on public.replies, public.thread_likes to authenticated;
grant delete on public.thread_likes to authenticated;
create index threads_category_created on public.threads(category_id, created_at desc);
create index threads_author on public.threads(author_id);
create index replies_thread_created on public.replies(thread_id, created_at);
create index replies_author on public.replies(author_id);
insert into public.categories(id,name,icon,color) values
('cat-1','Kế toán tổng hợp','📊','#457b9d'),
('cat-2','Thuế','🧾','#e76f51'),
('cat-3','Kế toán quản trị','📈','#2a9d8f'),
('cat-4','Kiểm toán','🔍','#9b8ec4'),
('cat-5','Tài liệu & Biểu mẫu','📁','#e9c46a'),
('cat-6','Hỏi đáp','💬','#f4a261'),
('cat-7','Excel & Phần mềm','💻','#7ec8a0'),
('cat-8','Luật & Quy định','⚖️','#e07a8f');
commit;
