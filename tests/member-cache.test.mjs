import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
let serial=0;
const id='11111111-1111-4111-8111-111111111111';
const empty={data:[],error:null};
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
async function fixture({user={id},profileDelay=null,detailDelay=null,archiveDelay=null}={}) {
 const calls=[];const events=[];let authCallback;
 globalThis.window={location:{hash:''},dispatchEvent:e=>events.push(e.type)};
 const resultFor=table=>table==='profiles'?{data:{id,name:'Member'},error:null}:empty;
 const chain=table=>{
  const q={};for(const method of ['select','order','limit','eq','range','in'])q[method]=()=>q;
  q.maybeSingle=()=>profileDelay?.promise || Promise.resolve(resultFor(table));
  q.then=(resolve,reject)=>(table==='threads' && archiveDelay ? archiveDelay.promise : Promise.resolve(resultFor(table))).then(resolve,reject);return q;
 };
 const rawThread={id,author_id:id,category_id:'cat-1',title:'Private',content:'Member-only text',created_at:new Date().toISOString()};
 globalThis.__cacheTestClient=()=>({auth:{onAuthStateChange:cb=>{authCallback=cb;},getUser:async()=>({data:{user},error:null}),getSession:async()=>({data:{session:{user:{id},access_token:'synthetic-session'}},error:null}),signOut:async opts=>{calls.push(['signOut',opts]);return {error:null};}},
 from:table=>{calls.push(['table',table]);return chain(table);},rpc:async(name)=>{
  calls.push(['rpc',name]);
  if(name==='forum_thread_detail')return detailDelay?detailDelay.promise:{data:rawThread,error:null};
  if(name==='forum_guest_thread_detail')return {data:{thread:{...rawThread,title:'Public',content:'Public knowledge'},author:{id,name:'Author'}},error:null};
  if(name==='forum_guest_catalog')return {data:{categories:[],stats:{threads:1,categoryCounts:{}}},error:null};
  if(name==='forum_guest_thread_page')return {data:{items:[rawThread],total:1,authors:[{id,name:'Author'}]},error:null};
  return {data:name==='forum_public_profiles'?[{id,name:'Member'}]:name==='forum_thread_page'?{items:[rawThread],total:1}:{threads:1,categoryCounts:{}},error:null};
 }});
 let code=await readFile(new URL('../js/remote-data.js',import.meta.url),'utf8');
 code=code.replace("'./published-series.js'",JSON.stringify(new URL('../js/published-series.js',import.meta.url).href)).replace("import { createClient } from '@supabase/supabase-js';",'const createClient=globalThis.__cacheTestClient;');
 const api=await import('data:text/javascript;base64,'+Buffer.from(code+'\n//cache'+serial++).toString('base64'));
 return {api,calls,events,auth:(...args)=>authCallback(...args),rawThread};
}

test('guests read bounded public RPCs, never raw member tables',async()=>{
 const {api,calls}=await fixture({user:null});assert.equal(await api.getCurrentUser(),null);
 await api.refreshData();await api.loadThreadPage();await api.loadThreadDetail(id);
 assert.equal(api.getThreadById(id).content,'Public knowledge');assert.deepEqual(api.getAttachments(id),[]);
 assert.ok(calls.length>=3);assert.ok(calls.every(c=>c[0]==='rpc' && c[1].startsWith('forum_guest_')));
 for(const fn of [()=>api.loadProfile(id),()=>api.loadAdminReplies(),()=>api.downloadAttachment(id)])await assert.rejects(fn,/đăng nhập/);
});

test('anonymous Auth users get public reading without member privileges',async()=>{
 const {api,calls}=await fixture({user:{id,is_anonymous:true}});
 assert.equal(await api.getCurrentUser(),null);await api.refreshData();
 assert.deepEqual(calls,[['rpc','forum_guest_catalog']]);await assert.rejects(api.downloadAttachment(id),/đăng nhập/);
});

test('retained part lookups cannot repopulate private caches after signout',async()=>{
 const archiveDelay=deferred();const {api,auth}=await fixture({archiveDelay});await api.getCurrentUser();
 const pending=api.refreshData();await new Promise(r=>setTimeout(r,0));auth('SIGNED_OUT',null);
 archiveDelay.resolve({data:[{id:'retired',title:'Private',content:'Private',category_id:'cat-1'}],error:null});
 await assert.rejects(pending,/đăng nhập/);assert.equal(api.getStats().threads,0);assert.equal(api.getThreadById('retired'),undefined);
});

test('local logout clears every private cache and leaves other devices signed in',async()=>{
 const {api,calls}=await fixture();await api.getCurrentUser();await api.loadThreadPage();await api.loadThreadDetail(id);
 assert.equal(api.getThreadById(id).content,'Member-only text');
 await api.signOut();assert.equal(api.getThreadById(id),undefined);assert.deepEqual(api.getDB(),{categories:[],users:[],threads:[],replies:[]});
 assert.equal(api.getPageInfo().total,0);assert.equal(api.getStats().threads,0);
 assert.deepEqual(calls.at(-1),['signOut',{scope:'local'}]);
});

test('SDK signout from another tab clears data synchronously',async()=>{
 const {api,auth,events}=await fixture();await api.getCurrentUser();await api.loadThreadDetail(id);
 auth('SIGNED_OUT',null);assert.equal(api.getThreadById(id),undefined);assert.ok(events.includes('bz-auth-cleared'));
});

test('requests that finish after signout cannot repopulate detail/profile caches',async()=>{
 const detailDelay=deferred();const {api,auth,rawThread}=await fixture({detailDelay});await api.getCurrentUser();
 const pending=api.loadThreadDetail(id);auth('SIGNED_OUT',null);detailDelay.resolve({data:rawThread,error:null});
 await assert.rejects(pending,/đăng nhập/);assert.equal(api.getThreadById(id),undefined);assert.deepEqual(api.getUsers(),[]);
 const profileDelay=deferred();const f=await fixture({profileDelay});const reading=f.api.getCurrentUser();
 await new Promise(r=>setTimeout(r,0));f.auth('SIGNED_OUT',null);profileDelay.resolve({data:{id,name:'Late profile'},error:null});
 assert.equal(await reading,null);await assert.rejects(f.api.loadAdminReplies(),/đăng nhập/);
});

test('expiry clears cached content when the SDK cannot refresh a session',async()=>{
 const {api,auth,events}=await fixture();await api.getCurrentUser();await api.loadThreadDetail(id);
 auth('TOKEN_REFRESHED',{user:{id},expires_at:Date.now()/1000+.015});
 await new Promise(r=>setTimeout(r,35));assert.equal(api.getThreadById(id),undefined);assert.ok(events.includes('bz-auth-cleared'));
});

test('AI response body finishing after signout is discarded',async()=>{
 const originalFetch=globalThis.fetch;const jsonDelay=deferred();
 try {
  globalThis.fetch=async()=>({ok:true,status:200,json:()=>jsonDelay.promise});
  const {api,auth}=await fixture();await api.getCurrentUser();
  const pending=api.askAI({mode:'ask',prompt:'GTGT',consent:true});await new Promise(r=>setTimeout(r,0));
  auth('SIGNED_OUT',null);jsonDelay.resolve({generated:true,answer:'Private response'});await assert.rejects(pending,/đăng nhập/);
 } finally {globalThis.fetch=originalFetch;}
});
