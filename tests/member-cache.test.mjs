import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
let serial=0;
const id='11111111-1111-4111-8111-111111111111';
const empty={data:[],error:null};
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
async function fixture({user={id},profileDelay=null,detailDelay=null}={}) {
 const calls=[];const events=[];let authCallback;
 globalThis.window={location:{hash:''},dispatchEvent:e=>events.push(e.type)};
 const resultFor=table=>table==='profiles'?{data:{id,name:'Member'},error:null}:empty;
 const chain=table=>{
  const q={};for(const method of ['select','order','limit','eq','range'])q[method]=()=>q;
  q.maybeSingle=()=>profileDelay?.promise || Promise.resolve(resultFor(table));
  q.then=(resolve,reject)=>Promise.resolve(resultFor(table)).then(resolve,reject);return q;
 };
 const rawThread={id,author_id:id,category_id:'cat-1',title:'Private',content:'Member-only text',created_at:new Date().toISOString()};
 globalThis.__cacheTestClient=()=>({auth:{onAuthStateChange:cb=>{authCallback=cb;},getUser:async()=>({data:{user},error:null}),signOut:async opts=>{calls.push(['signOut',opts]);return {error:null};}},
 from:table=>{calls.push(['table',table]);return chain(table);},rpc:async(name)=>{
  calls.push(['rpc',name]);
  if(name==='forum_thread_detail')return detailDelay?detailDelay.promise:{data:rawThread,error:null};
  return {data:name==='forum_public_profiles'?[{id,name:'Member'}]:name==='forum_thread_page'?{items:[rawThread],total:1}:{threads:1,categoryCounts:{}},error:null};
 }});
 let code=await readFile(new URL('../js/remote-data.js',import.meta.url),'utf8');
 code=code.replace("import { createClient } from '@supabase/supabase-js';",'const createClient=globalThis.__cacheTestClient;');
 const api=await import('data:text/javascript;base64,'+Buffer.from(code+'\n//cache'+serial++).toString('base64'));
 return {api,calls,events,auth:(...args)=>authCallback(...args),rawThread};
}

test('guests never issue content API requests through the data module',async()=>{
 const {api,calls}=await fixture({user:null});assert.equal(await api.getCurrentUser(),null);
 for(const fn of [()=>api.refreshData(),()=>api.loadThreadPage(),()=>api.loadThreadDetail(id),()=>api.loadProfile(id),()=>api.loadAdminReplies()])await assert.rejects(fn,/đăng nhập/);
 assert.deepEqual(calls,[]);
});

test('anonymous Auth users cannot initialize member content',async()=>{
 const {api,calls}=await fixture({user:{id,is_anonymous:true}});
 assert.equal(await api.getCurrentUser(),null);await assert.rejects(api.refreshData(),/đăng nhập/);assert.deepEqual(calls,[]);
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
 assert.equal(await reading,null);await assert.rejects(f.api.refreshData(),/đăng nhập/);
});

test('expiry clears cached content when the SDK cannot refresh a session',async()=>{
 const {api,auth,events}=await fixture();await api.getCurrentUser();await api.loadThreadDetail(id);
 auth('TOKEN_REFRESHED',{user:{id},expires_at:Date.now()/1000+.015});
 await new Promise(r=>setTimeout(r,35));assert.equal(api.getThreadById(id),undefined);assert.ok(events.includes('bz-auth-cleared'));
});
