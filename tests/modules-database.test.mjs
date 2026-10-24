import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',admin='33333333-3333-4333-8333-333333333333';
const fa='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',fb='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('is_anonymous',coalesce(nullif(current_setting('request.jwt.claim.is_anonymous',true),''),'false')::boolean)$$;
grant usage on schema auth,public to anon,authenticated;`);
for(const file of ['001_schema.sql','002_admin_roles.sql','003_security_hardening.sql','004_like_privacy.sql','005_member_read_categories.sql','006_classify_existing_articles.sql','007_tax_overview.sql','008_feedback_ai.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
await db.query(`insert into auth.users(id) values($1),($2),($3);`,[a,b,admin]);
await db.query('insert into public.forum_roles values($1,$2)',[admin,'admin']);
await db.query("insert into public.threads(author_id,category_id,title,content) values($1,'cat-2-vat','GTGT nông sản',repeat('GTGT example ',1000)),($2,'cat-8-insurance','BHXH tiền lương','BHXH example')",[a,b]);
await db.query("select set_config('request.jwt.claim.sub',$1,false)",[a]);
await db.query("insert into public.forum_feedback(id,author_id,kind,title,content) values($1,$2,'idea','First idea','Original feedback')",[fa,a]);
await db.query("select set_config('request.jwt.claim.sub',$1,false)",[b]);
await db.query("insert into public.forum_feedback(id,author_id,kind,title,content) values($1,$2,'bug','Second idea','Another feedback')",[fb,b]);
await db.query("select set_config('request.jwt.claim.sub','',false)");
after(()=>db.close());
async function as(role,id,action){await db.exec('begin');try{await db.exec('set local role '+role);await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id || '']);return await action();}finally{await db.exec('rollback');}}

test('guests and missing/anonymous identities cannot read feedback or AI context/counters',async()=>{
 for(const sql of ['select * from public.forum_feedback','select public.forum_feedback_page()',"select public.forum_ai_context('GTGT')",'select public.forum_ai_reserve()'])await as('anon',null,async()=>assert.rejects(db.query(sql),/permission denied/));
 await as('authenticated',null,async()=>{assert.equal((await db.query('select * from public.forum_feedback')).rows.length,0);await assert.rejects(db.query("select public.forum_ai_context('GTGT')"),/đăng nhập/);});
 await as('authenticated',a,async()=>{await db.query("select set_config('request.jwt.claim.is_anonymous','true',true)");assert.equal((await db.query('select * from public.forum_feedback')).rows.length,0);await assert.rejects(db.query('select public.forum_ai_reserve()'),/đăng nhập/);});
 await as('authenticated',a,async()=>assert.rejects(db.query('select * from forum_private.ai_daily_usage'),/permission denied/));
});
test('all members read public feedback; hidden entries remain visible to owner/admin only',async()=>{
 await as('authenticated',b,async()=>{const page=(await db.query('select public.forum_feedback_page() p')).rows[0].p;assert.equal(page.total,2);assert.ok(page.items.some(f=>f.id===fa));});
 await as('authenticated',admin,async()=>{
  await db.query("update public.forum_feedback set status='hidden',admin_response='Moderated' where id=$1",[fa]);
  await db.query("select set_config('request.jwt.claim.sub',$1,true)",[b]);assert.equal((await db.query('select public.forum_feedback_page() p')).rows[0].p.total,1);
  await db.query("select set_config('request.jwt.claim.sub',$1,true)",[a]);assert.equal((await db.query('select public.forum_feedback_page() p')).rows[0].p.total,2);
 });
});
test('feedback attribution/status cannot be forged; only admin updates public response',async()=>{
 await as('authenticated',a,async()=>assert.rejects(db.query("insert into public.forum_feedback(author_id,kind,title,content) values($1,'idea','fake','fake')",[b]),/tài khoản/));
 await as('authenticated',a,async()=>assert.rejects(db.query("insert into public.forum_feedback(author_id,kind,title,content,status) values($1,'idea','fake','fake','done')",[a]),/permission denied/));
 await as('authenticated',a,async()=>assert.equal((await db.query("update public.forum_feedback set status='done' where id=$1 returning id",[fa])).rows.length,0));
 await as('authenticated',admin,async()=>{
  assert.equal((await db.query("update public.forum_feedback set status='reviewing',admin_response='Received' where id=$1 returning id",[fa])).rows.length,1);
 });
 for(const actor of [a,admin])await as('authenticated',actor,async()=>assert.rejects(db.query('update public.forum_feedback set author_id=$1 where id=$2',[b,fa]),/permission denied/));
});
test('feedback insert limit is enforced in the database',async()=>{
 await as('authenticated',a,async()=>{
  for(let i=0;i<4;i++)await db.query("insert into public.forum_feedback(author_id,kind,title,content) values($1,'idea','Test','Test')",[a]);
  await assert.rejects(db.query("insert into public.forum_feedback(author_id,kind,title,content) values($1,'bug','Limit','Limit')",[a]),/5 góp ý/);
 });
});
test('Vietnamese natural-language retrieval returns bounded relevant articles only',async()=>{
 await as('authenticated',a,async()=>{
  const rows=(await db.query("select public.forum_ai_context('Xin hỏi GTGT nông sản như thế nào?') p")).rows[0].p;
  assert.equal(rows.length,1);assert.equal(rows[0].title,'GTGT nông sản');assert.equal(rows[0].content.length,10000);
  assert.deepEqual((await db.query("select public.forum_ai_context('và của') p")).rows[0].p,[]);
 });
});
test('AI reservation is atomic, limited per member and throttles repeated requests',async()=>{
 await as('authenticated',a,async()=>{
  const first=(await db.query('select public.forum_ai_reserve() q')).rows[0].q;assert.equal(first.allowed,true);assert.equal(first.remaining,4);
  const next=(await db.query('select public.forum_ai_reserve() q')).rows[0].q;assert.equal(next.allowed,false);assert.match(next.message,/10 giây/);
 });
});
test('global free-use daily cap blocks requests regardless of user',async()=>{
 await db.exec('begin');try{
  await db.exec("insert into forum_private.ai_global_usage(day,used) values(timezone('Asia/Ho_Chi_Minh',now())::date,20)");
  await db.exec('set local role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[admin]);
  const q=(await db.query('select public.forum_ai_reserve() q')).rows[0].q;assert.equal(q.allowed,false);assert.match(q.message,/Forum đã dùng hết/);
 }finally{await db.exec('rollback');}
});
test('new module migration is repeatable without deleting feedback or reopening guest access',async()=>{
 await db.exec(await readFile(new URL('../supabase/008_feedback_ai.sql',import.meta.url),'utf8'));
 assert.equal((await db.query('select count(*)::int n from public.forum_feedback')).rows[0].n,2);
 await as('anon',null,async()=>assert.rejects(db.query('select public.forum_feedback_page()'),/permission denied/));
});
