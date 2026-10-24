import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
let serial=0;
const validSession=()=>({user:{id:'test-user'},expires_at:Date.now()/1000+3600});
async function fixture({hash='',search='',user={id:'test-user'},updateError=null}={}) {
  const calls=[];
  globalThis.window={location:{hash,search},dispatchEvent(){}};
  globalThis.__testClient=()=>({auth:{
    onAuthStateChange(callback){calls.callback=callback;},
    async getUser(){return {data:{user},error:null};},
    async resetPasswordForEmail(email,options){calls.push(['reset',email,options]);return {data:{},error:null};},
    async updateUser(value){calls.push(['update',value]);return {data:{},error:updateError};},
    async signOut(options){calls.push(['signOut',options]);return {data:{},error:null};}
  }});
  let code=await readFile(new URL('../js/remote-data.js',import.meta.url),'utf8');
  code=code.replace("import { createClient } from '@supabase/supabase-js';",'const createClient=globalThis.__testClient;');
  const module=await import('data:text/javascript;base64,'+Buffer.from(code+'\n//'+serial++).toString('base64'));
  return {module,calls};
}
test('reset email returns to the approved production recovery route',async()=>{
  const {module,calls}=await fixture();await module.sendPasswordReset('sample@example.com');
  assert.deepEqual([...calls],[['reset','sample@example.com',{redirectTo:'https://accounting-forum.vercel.app/?recovery=1'}]]);
});
test('ordinary signed-in session cannot submit the recovery form',async()=>{
  const {module,calls}=await fixture();await assert.rejects(module.completePasswordReset('test-only-password'),/không hợp lệ/);assert.equal(calls.length,0);
});
test('recovery link without an authenticated session cannot change a password',async()=>{
  const {module,calls}=await fixture({hash:'#type=recovery',user:null});await assert.rejects(module.completePasswordReset('test-only-password'));assert.equal(calls.length,0);
});
test('valid recovery persists before signing out and consumes the recovery state',async()=>{
  const {module,calls}=await fixture({hash:'#type=recovery'});calls.callback('PASSWORD_RECOVERY',validSession());await module.completePasswordReset('test-only-password');
  assert.deepEqual([...calls],[['update',{password:'test-only-password'}],['signOut',{scope:'global'}]]);assert.equal(module.isPasswordRecovery(),false);
});
test('expired callback is rejected even with an existing signed-in session',async()=>{
  const {module,calls}=await fixture({hash:'#error_code=otp_expired',search:'?recovery=1'});await assert.rejects(module.completePasswordReset('test-only-password'));assert.equal(calls.length,0);
});
test('server rejection keeps the recovery state so the user can correct their password',async()=>{
  const {module,calls}=await fixture({hash:'#type=recovery',updateError:new Error('weak password')});calls.callback('PASSWORD_RECOVERY',validSession());await assert.rejects(module.completePasswordReset('test-only-password'),/weak password/);assert.equal(module.isPasswordRecovery(),true);assert.equal(calls.length,1);
});
test('PASSWORD_RECOVERY event is handled after the SDK consumes the URL fragment',async()=>{
  const {module,calls}=await fixture();calls.callback('PASSWORD_RECOVERY',validSession());assert.equal(module.isPasswordRecovery(),true);
});

for(const options of [{search:'?recovery=1'},{hash:'#type=recovery'},{search:'?recovery=1',hash:'#type=recovery'}])test('forged URL does not authorize recovery '+JSON.stringify(options),async()=>{
 const {module,calls}=await fixture(options);assert.equal(module.isPasswordRecovery(),false);
 await assert.rejects(module.completePasswordReset('synthetic-test-value'));assert.equal(calls.length,0);
});
test('missing, expired or different-user recovery sessions fail closed',async()=>{
 for(const session of [undefined,{user:{id:'test-user'}},{user:{id:'test-user'},expires_at:1}]){
  const {module,calls}=await fixture();calls.callback('PASSWORD_RECOVERY',session);assert.equal(module.isPasswordRecovery(),false);
 }
 const {module,calls}=await fixture({user:{id:'other'}});calls.callback('PASSWORD_RECOVERY',validSession());
 await assert.rejects(module.completePasswordReset('synthetic-test-value'));assert.equal(calls.length,0);
});
test('signout and successful update consume recovery authorization',async()=>{
 const {module,calls}=await fixture();calls.callback('PASSWORD_RECOVERY',validSession());calls.callback('SIGNED_OUT',null);
 await assert.rejects(module.completePasswordReset('synthetic-test-value'));assert.equal(module.isPasswordRecovery(),false);
 calls.callback('PASSWORD_RECOVERY',validSession());await module.completePasswordReset('synthetic-test-value');
 await assert.rejects(module.completePasswordReset('synthetic-test-value'));assert.equal(calls.length,2);
});
