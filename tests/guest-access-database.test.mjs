import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
const a='11111111-1111-4111-8111-111111111111',admin='33333333-3333-4333-8333-333333333333',post='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',file='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('is_anonymous',coalesce(nullif(current_setting('request.jwt.claim.is_anonymous',true),''),'false')::boolean)$$;
grant usage on schema auth,public to anon,authenticated;
create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
grant usage on schema storage to anon,authenticated;grant select,insert,update,delete on storage.objects to anon,authenticated;
create policy legacy_wide_policy on storage.objects for all to anon,authenticated using(true) with check(true);`);
for(const f of ['001_schema.sql','002_admin_roles.sql','003_security_hardening.sql','004_like_privacy.sql','005_member_read_categories.sql','007_security_input_bounds.sql','008_feedback_ai.sql'])await db.exec(await readFile(new URL('../supabase/'+f,import.meta.url),'utf8'));
// Supabase projects can have broad default table privileges; exercise that production condition too.
await db.exec('grant insert,update,delete on public.replies to anon');
const migration=await readFile(new URL('../supabase/009_guest_read_attachments.sql',import.meta.url),'utf8');await db.exec(migration);
await db.query('insert into auth.users(id) values($1),($2)',[a,admin]);await db.query("insert into public.forum_roles values($1,'admin')",[admin]);
await db.query("insert into public.threads(id,author_id,category_id,title,content) values($1,$2,'cat-2-vat','Public guide',repeat('Knowledge ',100))",[post,a]);
await db.query("insert into public.replies(thread_id,author_id,content) values($1,$2,'Member reply')",[post,a]);
after(()=>db.close());
async function as(role,id,fn){await db.exec('begin');try{await db.exec('set local role '+role);await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id||'']);return await fn();}finally{await db.exec('rollback');}}
async function seedFile(){await db.query("select set_config('request.jwt.claim.sub',$1,true)",[admin]);await db.query(`insert into public.forum_attachments(id,thread_id,filename,storage_path,mime_type,byte_size,source_url,license_text) values($1,$2,'form.pdf',$3,'application/pdf',100,'https://chinhphu.vn','Approved synthetic example')`,[file,post,post+'/'+file+'.pdf']);await db.query("insert into storage.objects(bucket_id,name) values('forum-resources',$1)",[post+'/'+file+'.pdf']);}

test('guests read/search public articles without table, profile directory or comment access',async()=>{
 await as('anon',null,async()=>{
  const catalog=(await db.query('select public.forum_guest_catalog() p')).rows[0].p;assert.equal(catalog.stats.threads,1);
  const page=(await db.query("select public.forum_guest_thread_page(p_category=>'cat-2',p_search=>'Knowledge',p_limit=>500) p")).rows[0].p;assert.equal(page.total,1);assert.equal(page.items[0].content.length,180);assert.deepEqual(Object.keys(page.authors[0]).sort(),['id','name','role']);
  const detail=(await db.query('select public.forum_guest_thread_detail($1) p',[post])).rows[0].p;assert.match(detail.thread.content,/Knowledge/);assert.equal(detail.replies,undefined);assert.equal(detail.thread.has_attachments,false);
 });
 for(const t of ['threads','profiles','replies','forum_roles','forum_attachments'])await as('anon',null,()=>assert.rejects(db.query('select * from public.'+t),/permission denied/));
 await as('anon',null,()=>assert.rejects(db.query("insert into public.replies(thread_id,author_id,content) values($1,$2,'bad')",[post,a]),/permission denied/));
});
test('private bucket and guards deny guests and unauthenticated/anonymous identities even under legacy permissive policies',async()=>{
 assert.equal((await db.query("select public from storage.buckets where id='forum-resources'")).rows[0].public,false);
 for(const [role,id] of [['anon',null],['authenticated',null],['authenticated',a]])await as(role,id,async()=>{
  if(id)await db.query("select set_config('request.jwt.claim.is_anonymous','true',true)");
  // An unauthenticated request may fail privileges before policy evaluation; either result denies data.
  try{assert.equal((await db.query("select * from storage.objects where bucket_id='forum-resources'")).rows.length,0);}catch(e){assert.match(e.message,/permission denied/);}
 });
});
test('anonymous Auth identities cannot comment through a direct API insert',async()=>{
 await as('authenticated',a,async()=>{await db.query("select set_config('request.jwt.claim.is_anonymous','true',true)");await assert.rejects(db.query("insert into public.replies(thread_id,author_id,content) values($1,$2,'anonymous bypass')",[post,a]),/row-level security/);});
 await as('authenticated',a,async()=>assert.equal((await db.query("insert into public.replies(thread_id,author_id,content) values($1,$2,'member allowed') returning id",[post,a])).rows.length,1));
});
test('only approved files are visible to members; withdraw blocks new reads and metadata',async()=>{
 await db.exec('begin');try{
  await seedFile();
  await db.exec('set local role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[a]);
  assert.equal((await db.query('select * from public.forum_attachments')).rows.length,0);assert.equal((await db.query("select * from storage.objects where bucket_id='forum-resources'")).rows.length,0);
  await db.query("select set_config('request.jwt.claim.sub',$1,true)",[admin]);await db.query('update public.forum_attachments set approved=true where id=$1',[file]);
  await db.query("select set_config('request.jwt.claim.sub',$1,true)",[a]);assert.equal((await db.query('select * from public.forum_attachments')).rows.length,1);assert.equal((await db.query("select * from storage.objects where bucket_id='forum-resources'")).rows.length,1);
  await db.query("select set_config('request.jwt.claim.sub',$1,true)",[admin]);await db.query('update public.forum_attachments set approved=false where id=$1',[file]);
  await db.query("select set_config('request.jwt.claim.sub',$1,true)",[a]);assert.equal((await db.query("select * from storage.objects where bucket_id='forum-resources'")).rows.length,0);
 }finally{await db.exec('rollback');}
});
test('members cannot approve, overwrite, upload or delete files; public metadata reveals no path',async()=>{
 await db.exec('begin');try{await seedFile();await db.query('update public.forum_attachments set approved=true where id=$1',[file]);
  const detail=(await db.query('select public.forum_guest_thread_detail($1) p',[post])).rows[0].p;assert.equal(detail.thread.has_attachments,true);assert.ok(!JSON.stringify(detail).includes('storage_path'));
  await db.exec('set local role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[a]);
  assert.equal((await db.query("update storage.objects set name='overwritten' where bucket_id='forum-resources' returning id")).rows.length,0);
  assert.equal((await db.query("delete from storage.objects where bucket_id='forum-resources' returning id")).rows.length,0);
  await db.query("select set_config('request.jwt.claim.sub','',true)");assert.equal((await db.query("select * from storage.objects where bucket_id='forum-resources'")).rows.length,0);
 }finally{await db.exec('rollback');}
 await as('authenticated',a,async()=>assert.equal((await db.query('update public.forum_attachments set approved=true returning id')).rows.length,0));
 await as('authenticated',a,()=>assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('forum-resources','guessed.pdf')"),/row-level security/));
 await as('authenticated',a,()=>assert.rejects(db.query("update public.forum_attachments set original_editor_name='fake'"),/permission denied/));
});
test('migration can repeat, preserves content and does not expand old member RPCs',async()=>{
 const before=(await db.query('select md5(content) h from public.threads where id=$1',[post])).rows[0].h;
 await db.exec(migration);assert.equal((await db.query('select md5(content) h from public.threads where id=$1',[post])).rows[0].h,before);
 await as('anon',null,()=>assert.rejects(db.query('select public.forum_thread_detail($1)',[post]),/permission denied/));
});
