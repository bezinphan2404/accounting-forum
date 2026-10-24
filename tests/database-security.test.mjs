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
grant usage on schema auth,public to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
for(const file of ['001_schema.sql','002_admin_roles.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
await db.exec('alter policy likes_read on public.thread_likes rename to thread_likes_read');
await db.exec(`insert into auth.users(id) values('${a}'),('${b}'),('${admin}');insert into public.forum_roles values('${admin}','admin');`);
for(const file of ['003_security_hardening.sql','004_like_privacy.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
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
test('public cards are bounded summaries, aggregates hide identities, badges exclude auth data',async()=>{
 await as('anon',null,async()=>{
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
 for(const file of ['003_security_hardening.sql','004_like_privacy.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
});
