import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const id='11111111-1111-4111-8111-111111111111';let serial=0;
async function fixture({signedIn=true,approved=true,delay=null}={}) {
 let callback;const calls=[];
 globalThis.window={location:{hash:''},dispatchEvent:()=>{}};
 globalThis.__downloadClient=()=>({auth:{getUser:async()=>({data:{user:signedIn?{id}:null},error:null}),onAuthStateChange:cb=>callback=cb},
 from:table=>{calls.push(['table',table]);const query={};for(const op of ['select','eq'])query[op]=(...args)=>{calls.push([op,...args]);return query;};query.maybeSingle=async()=>({data:table==='profiles'?{id,name:'Member'}:approved?{id,filename:'form.pdf',mime_type:'application/pdf',storage_path:id+'/'+id+'.pdf'}:null,error:null});query.then=(ok,bad)=>Promise.resolve({data:[],error:null}).then(ok,bad);return query;},
 storage:{from:bucket=>({download:path=>{calls.push(['download',bucket,path]);return delay?delay.promise:Promise.resolve({data:new Blob(['synthetic']),error:null});}})}});
 let code=await readFile(new URL('../js/remote-data.js',import.meta.url),'utf8');code=code.replace("'./published-series.js'",JSON.stringify(new URL('../js/published-series.js',import.meta.url).href)).replace("import { createClient } from '@supabase/supabase-js';",'const createClient=globalThis.__downloadClient;');
 const api=await import('data:text/javascript;base64,'+Buffer.from(code+'\n//download'+serial++).toString('base64'));
 return {api,calls,signout:()=>callback('SIGNED_OUT',null)};
}
test('guest downloads stop before metadata or Storage access',async()=>{const {api,calls}=await fixture({signedIn:false});await assert.rejects(api.downloadAttachment(id),/đăng nhập/);assert.deepEqual(calls,[]);});
test('member download rechecks approval then uses authenticated private-bucket download',async()=>{const {api,calls}=await fixture();const result=await api.downloadAttachment(id);assert.equal(result.filename,'form.pdf');assert.deepEqual(calls.at(-1),['download','forum-resources',id+'/'+id+'.pdf']);assert.ok(calls.some(c=>c[0]==='eq' && c[1]==='approved' && c[2]===true));});
test('withdrawn attachment never reaches Storage',async()=>{const {api,calls}=await fixture({approved:false});await assert.rejects(api.downloadAttachment(id),/không còn/);assert.ok(!calls.some(c=>c[0]==='download'));});
test('Storage response after signout is discarded',async()=>{let finish;const delay={promise:new Promise(r=>finish=r)};const {api,calls,signout}=await fixture({delay});const pending=api.downloadAttachment(id);await new Promise(r=>setTimeout(r,5));assert.ok(calls.some(c=>c[0]==='download'));signout();finish({data:new Blob(['synthetic']),error:null});await assert.rejects(pending,/đăng nhập/);});
