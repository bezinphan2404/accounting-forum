import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',admin='33333333-3333-4333-8333-333333333333';
const post='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
await db.exec(`create role anon;create role authenticated;create schema auth;
create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('is_anonymous',coalesce(nullif(current_setting('request.jwt.claim.is_anonymous',true),''),'false')::boolean)$$;
grant usage on schema auth,public to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
for(const file of ['001_schema.sql','002_admin_roles.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
await db.exec('alter policy likes_read on public.thread_likes rename to thread_likes_read');
await db.exec(`insert into auth.users(id) values('${a}'),('${b}'),('${admin}');insert into public.forum_roles values('${admin}','admin');`);
await db.exec('alter policy threads_read on public.threads rename to legacy_thread_read; grant select(title) on public.threads to public,anon;');
for(const file of ['003_security_hardening.sql','004_like_privacy.sql','005_member_read_categories.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
await db.exec(`insert into public.threads(id,author_id,category_id,title,content) values('${post}','${a}','cat-1','Test',repeat('x',1000));
insert into public.thread_likes(thread_id,user_id) values('${post}','${a}'),('${post}','${b}');`);
after(()=>db.close());
async function as(role,id,action){await db.exec('begin');try{await db.exec('set local role '+role);await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id || '']);return await action();}finally{await db.exec('rollback');}}
test('anonymous access cannot enumerate liker identities or write posts',async()=>{
 await as('anon',null,async()=>assert.rejects(db.query('select * from public.thread_likes'),/permission denied/));
 await as('anon',null,async()=>assert.rejects(db.query(`insert into public.threads(author_id,category_id,title,content) values('${a}','cat-1','x','x')`),/permission denied/));
});
test('members only see their own likes and cannot forge attribution or elevate privileges',async()=>{
 await as('authenticated',a,async()=>{const r=await db.query('select user_id from public.thread_likes');assert.deepEqual(r.rows,[{user_id:a}]);});
 await as('authenticated',a,async()=>assert.rejects(db.query(`insert into public.thread_likes(thread_id,user_id) values('${post}','${admin}')`),/row-level security/));
 await as('authenticated',a,async()=>assert.rejects(db.query(`insert into public.forum_roles values('${a}','admin')`),/permission denied/));
 await as('authenticated',a,async()=>assert.rejects(db.query(`update public.threads set author_id='${b}' where id='${post}'`),/permission denied/));
});
test('owners and admins can edit content but other members cannot',async()=>{
 await as('authenticated',b,async()=>assert.equal((await db.query(`update public.threads set title='attack' where id='${post}' returning id`)).rows.length,0));
 for(const id of [a,admin])await as('authenticated',id,async()=>assert.equal((await db.query(`update public.threads set title='allowed' where id='${post}' returning id`)).rows.length,1));
});
test('profiles are automatically created and clients cannot insert profiles',async()=>{
 assert.equal((await db.query('select count(*)::int n from public.profiles')).rows[0].n,3);
 await db.exec('begin');try{
 await db.query('insert into auth.users values($1,$2)', ['44444444-4444-4444-8444-444444444444',{name:'Auto profile'}]);
 assert.equal((await db.query("select name from public.profiles where id='44444444-4444-4444-8444-444444444444'")).rows[0].name,'Auto profile');
 }finally{await db.exec('rollback');}
 await as('authenticated',a,async()=>assert.rejects(db.query(`insert into public.profiles(id,name) values('${a}','overwrite')`),/permission denied/));
});
test('member cards are bounded summaries, aggregates hide identities, badges exclude auth data',async()=>{
 await as('authenticated',a,async()=>{
 const page=(await db.query('select public.forum_thread_page(p_limit=>1) p')).rows[0].p;
 assert.equal(page.items.length,1);assert.equal(page.items[0].content.length,180);assert.equal(page.items[0].likes,2);
 assert.ok(!JSON.stringify(page).includes('user_id'));
 const profiles=(await db.query('select public.forum_public_profiles($1) p',[[admin]])).rows[0].p;
 assert.equal(profiles[0].role,'admin');assert.deepEqual(Object.keys(profiles[0]).sort(),['bio','created_at','id','name','role']);
 const detail=(await db.query('select public.forum_thread_detail($1) p',[post])).rows[0].p;assert.equal(detail.content.length,1000);
 });
});
test('posting rate limit cannot be bypassed by spoofing timestamps',async()=>{
 await as('authenticated',b,async()=>{
 for(let i=0;i<5;i++)await db.query(`insert into public.threads(author_id,category_id,title,content,created_at) values($1,'cat-1','x','x','2000-01-01')`,[b]);
 await assert.rejects(db.query(`insert into public.threads(author_id,category_id,title,content) values($1,'cat-1','x','x')`,[b]),/Thao tác quá nhanh/);
 });
});
test('database length constraints reject oversized content',async()=>{
 await as('authenticated',a,async()=>assert.rejects(db.query(`update public.threads set content=repeat('x',50001) where id='${post}'`),/check constraint/));
});
test('security migrations can be applied again safely',async()=>{
 for(const file of ['003_security_hardening.sql','004_like_privacy.sql','005_member_read_categories.sql','005_member_read_categories.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
});

test('guests cannot read any forum table, column grant or content RPC',async()=>{
 for(const table of ['profiles','categories','threads','replies','thread_likes','forum_roles']) {
  await as('anon',null,async()=>assert.rejects(db.query('select * from public.'+table),/permission denied/));
 }
 await as('anon',null,async()=>assert.rejects(db.query('select title from public.threads'),/permission denied/));
 for(const sql of ["select public.forum_public_profiles('{}')",'select public.forum_thread_page()',`select public.forum_thread_detail('${post}')`,'select public.forum_stats()','select public.is_forum_admin()','select public.require_forum_member()']) {
  await as('anon',null,async()=>assert.rejects(db.query(sql),/permission denied/));
 }
});

test('authenticated role without an identity gets no rows and cannot bypass SECURITY DEFINER guards',async()=>{
 for(const table of ['profiles','categories','threads','replies','thread_likes','forum_roles']) {
  await as('authenticated',null,async()=>assert.equal((await db.query('select * from public.'+table)).rows.length,0));
 }
 for(const sql of ["select public.forum_public_profiles('{}')",'select public.forum_thread_page()',`select public.forum_thread_detail('${post}')`,'select public.forum_stats()']) {
  await as('authenticated',null,async()=>assert.rejects(db.query(sql),/Vui lòng đăng nhập/));
 }
});

test('parent and child filtering, search, author, pagination and counts agree',async()=>{
 await db.exec('begin');
 try {
  await db.query("insert into public.threads(author_id,category_id,title,content) values ($1,'cat-2','Tổng quan thuế','parent'),($1,'cat-2-vat','GTGT example','child'),($2,'cat-2-pit','TNCN example','sibling')",[a,b]);
  await db.exec('set local role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[a]);
  const page=async(category,search=null,author=null,offset=0,limit=20)=>(await db.query('select public.forum_thread_page($1,$2,$3,$4,$5,$6) p',[category,search,author,'newest',offset,limit])).rows[0].p;
  assert.equal((await page('cat-2')).total,3);assert.equal((await page('cat-2-vat')).total,1);
  assert.equal((await page('cat-2','example')).total,2);assert.equal((await page('cat-2',null,a)).total,2);
  assert.equal((await page('missing')).total,0);
  const first=await page('cat-2',null,null,0,1),second=await page('cat-2',null,null,1,1);
  assert.equal(first.total,3);assert.equal(first.items.length,1);assert.notEqual(first.items[0].id,second.items[0].id);
  const stats=(await db.query('select public.forum_stats() s')).rows[0].s;
  assert.equal(stats.categoryCounts['cat-2'],3);assert.equal(stats.categoryCounts['cat-2-vat'],1);assert.equal(stats.categories,8);assert.equal(stats.subcategories,38);
  const roots=(await db.query('select id from public.categories where parent_id is null order by sort_order,id')).rows;
  assert.equal(roots.at(-1).id,'cat-6');
 } finally {await db.exec('rollback');}
});

test('Supabase anonymous identities are not treated as signed-in members',async()=>{
 await as('authenticated',a,async()=>{
  await db.query("select set_config('request.jwt.claim.is_anonymous','true',true)");
  assert.equal((await db.query('select * from public.threads')).rows.length,0);
  await assert.rejects(db.query('select public.forum_stats()'),/Vui lòng đăng nhập/);
 });
});

test('existing single-topic articles move into children without changing content or attribution; repeat is safe',async()=>{
 const vat='0e522016-cd9b-4002-a022-1f8e9a931b43',insurance='1786c9d6-c5dc-4915-95ed-7774bfe91744';
 await db.query(`insert into public.threads(id,author_id,category_id,title,content,tags) values
 ($1,$3,'cat-2','Thuế GTGT nông sản, gỗ/măng và dược liệu sau Luật 149 — sơ đồ 3 cột','Original VAT content',array['GTGT']),
 ($2,$3,'cat-8','BHXH và tiền lương 2026: đối tượng, mức đóng và checklist cho kế toán','Original insurance content',array['BHXH'])`,[vat,insurance,a]);
 const preserved=async()=>(await db.query("select id,author_id,title,content,tags,created_at from public.threads order by id")).rows;
 const before=await preserved();const migration=await readFile(new URL('../supabase/006_classify_existing_articles.sql',import.meta.url),'utf8');
 await db.exec(migration);await db.exec(migration);
 assert.deepEqual(await preserved(),before);
 assert.equal((await db.query('select category_id from public.threads where id=$1',[vat])).rows[0].category_id,'cat-2-vat');
 assert.equal((await db.query('select category_id from public.threads where id=$1',[insurance])).rows[0].category_id,'cat-8-insurance');
 await as('authenticated',a,async()=>{
  for(const category of ['cat-2','cat-2-vat']) {
   const page=(await db.query('select public.forum_thread_page(p_category=>$1) p',[category])).rows[0].p;
   assert.ok(page.items.some(t=>t.id===vat));
  }
 });
});

test('cross-tax overview gets its own child and parent counts include both children',async()=>{
 const overview='9b89b85f-09c0-47bb-a4c1-784e0832c378';
 await db.query("insert into public.threads(id,author_id,category_id,title,content) values($1,$2,'cat-2','Cập nhật thuế 2026: bảng tra nhanh và việc kế toán cần làm cuối năm','Original cross-tax article')",[overview,a]);
 const before=(await db.query('select title,content,author_id,created_at from public.threads where id=$1',[overview])).rows;
 const sql=await readFile(new URL('../supabase/007_tax_overview.sql',import.meta.url),'utf8');await db.exec(sql);await db.exec(sql);
 assert.deepEqual((await db.query('select title,content,author_id,created_at from public.threads where id=$1',[overview])).rows,before);
 await as('authenticated',a,async()=>{
  const stats=(await db.query('select public.forum_stats() s')).rows[0].s;
  assert.equal(stats.categoryCounts['cat-2'],2);assert.equal(stats.categoryCounts['cat-2-vat'],1);assert.equal(stats.categoryCounts['cat-2-overview'],1);assert.equal(stats.subcategories,39);
 });
});
