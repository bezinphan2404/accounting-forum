import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite(),a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',post='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
await db.exec(`create role anon;create role authenticated;create schema auth;
create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('is_anonymous',coalesce(nullif(current_setting('request.jwt.claim.is_anonymous',true),''),'false')::boolean)$$;
grant usage on schema auth,public to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
for(const f of ['001_schema.sql','002_admin_roles.sql','003_security_hardening.sql','004_like_privacy.sql','005_member_read_categories.sql'])await db.exec(await readFile(new URL('../supabase/'+f,import.meta.url),'utf8'));
await db.query("insert into auth.users(id) values($1),($2)",[a,b]);
await db.query("insert into public.threads(id,author_id,category_id,title,content) values($1,$2,'cat-2-vat','Synthetic','Synthetic')",[post,a]);
const migration=await readFile(new URL('../supabase/007_security_input_bounds.sql',import.meta.url),'utf8');
await db.exec(migration);after(()=>db.close());
async function as(role,id,fn){await db.exec('begin');try{await db.exec('set local role '+role);await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id||'']);return await fn();}finally{await db.exec('rollback');}}
test('bio accepts the Unicode boundary and rejects oversized INSERT/UPDATE',async()=>{
 await as('authenticated',a,async()=>{const r=await db.query("update public.profiles set bio=repeat('😀',2000) where id=$1 returning char_length(bio) n",[a]);assert.equal(r.rows[0].n,2000);});
 for(const count of [2001,262144])await as('authenticated',a,()=>assert.rejects(db.query("update public.profiles set bio=repeat('b',$2) where id=$1",[a,count]),/profiles_bio_size/));
 await db.exec('begin');try{await assert.rejects(db.query("insert into public.profiles(id,name,bio) values(gen_random_uuid(),'x',repeat('x',2001))"),/profiles_bio_size/);}finally{await db.exec('rollback');}
});
test('tags accept empty or ten Unicode tags and reject cardinality, element, null and dimensional abuse',async()=>{
 for(const tags of [[],Array(10).fill('😀'.repeat(50))])await as('authenticated',a,async()=>{const r=await db.query('update public.threads set tags=$1 where id=$2 returning cardinality(tags) n',[tags,post]);assert.equal(r.rows[0].n,tags.length);});
 for(const tags of [Array(11).fill('x'),Array(5000).fill('t'.repeat(64)),['x'.repeat(51)],[''],['  '],[null],[['nested']]])await as('authenticated',a,()=>assert.rejects(db.query('update public.threads set tags=$1 where id=$2',[tags,post]),/threads_tags_size/));
 await as('authenticated',a,()=>assert.rejects(db.query("insert into public.threads(author_id,category_id,title,content,tags) values($1,'cat-2-vat','x','x',array_fill('x'::text,array[11]))",[a]),/threads_tags_size/));
});
test('RPC preserves membership and existing profiles while rejecting nested, oversized and null IDs',async()=>{
 await as('authenticated',a,async()=>{assert.equal((await db.query('select jsonb_array_length(public.forum_public_profiles($1)) n',[[a,b]])).rows[0].n,2);});
 for(const ids of [null,[]])await as('authenticated',a,async()=>assert.deepEqual((await db.query('select public.forum_public_profiles($1) p',[ids])).rows[0].p,[]));
 for(const ids of [Array(101).fill(a),[[a,b]],[a,null]])await as('authenticated',a,()=>assert.rejects(db.query('select public.forum_public_profiles($1)',[ids]),e=>e.code==='22023'));
 await as('authenticated',a,async()=>assert.equal((await db.query('select jsonb_array_length(public.forum_public_profiles($1)) n',[Array(100).fill(a)])).rows[0].n,1));
 await as('anon',null,()=>assert.rejects(db.query('select public.forum_public_profiles($1)',[[a]]),/permission denied/));
 await as('authenticated',null,()=>assert.rejects(db.query('select public.forum_public_profiles($1)',[[a]]),/đăng nhập/));
});
test('new constraints do not grant cross-member updates or alter parent category filtering',async()=>{
 await as('authenticated',b,async()=>assert.equal((await db.query("update public.threads set tags='{changed}' where id=$1 returning id",[post])).rows.length,0));
 await as('authenticated',a,async()=>{assert.equal((await db.query("select (public.forum_thread_page(p_category=>'cat-2')->>'total')::int n")).rows[0].n,1);});
});
test('migration repeats without changing content or member-only RPC grants',async()=>{
 const before=(await db.query("select md5(jsonb_agg(to_jsonb(t) order by id)::text) h from public.threads t")).rows[0].h;
 await db.exec(migration);assert.equal((await db.query("select md5(jsonb_agg(to_jsonb(t) order by id)::text) h from public.threads t")).rows[0].h,before);
 assert.equal((await db.query("select has_function_privilege('anon','public.forum_public_profiles(uuid[])','EXECUTE') allowed")).rows[0].allowed,false);
});
test('migration refuses legacy oversized content and leaves its values unchanged',async()=>{
 await db.exec('begin');try{await db.exec('alter table public.profiles drop constraint profiles_bio_size');await db.query("update public.profiles set bio=repeat('x',2001) where id=$1",[a]);
 // Run its body within the existing test transaction; production uses its own BEGIN/COMMIT.
 await db.exec('savepoint candidate');await assert.rejects(db.exec(migration.replace(/^begin;$/m,'').replace(/^commit;$/m,'')),/Existing forum data exceeds/);await db.exec('rollback to candidate');
 assert.equal((await db.query('select char_length(bio) n from public.profiles where id=$1',[a])).rows[0].n,2001);
 }finally{await db.exec('rollback');}
});
test('client rejects excessive tags before requesting identity or writing',async()=>{
 let calls=0;globalThis.window={location:{hash:''},dispatchEvent(){}};globalThis.__boundsClient=()=>({auth:{onAuthStateChange(){},getUser(){calls++;throw Error('unexpected request');}}});
 const source=(await readFile(new URL('../js/remote-data.js',import.meta.url),'utf8')).replace("'./published-series.js'",JSON.stringify(new URL('../js/published-series.js',import.meta.url).href)).replace("import { createClient } from '@supabase/supabase-js';",'const createClient=globalThis.__boundsClient;');
 const module=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 for(const tags of [Array(11).fill('tag'),['x'.repeat(51)],[null],[['nested']]])await assert.rejects(module.createThread({title:'x',content:'x',categoryId:'cat-2-vat',tags}),/tối đa 10 thẻ/);
 assert.equal(calls,0);
});
