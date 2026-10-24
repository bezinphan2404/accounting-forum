import test from 'node:test';
import assert from 'node:assert/strict';
import {createAIHandler} from '../api/ai.js';
const member='11111111-1111-4111-8111-111111111111',article='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const key='test-only-provider-value';
const source={id:article,title:'GTGT nông sản',content:'Original knowledge'};
async function run({method='POST',authorization='Bearer synthetic-session',origin='https://accounting-forum.vercel.app',body={mode:'ask',prompt:'GTGT nông sản',consent:true},env={AI_ENABLED:'true',AI_FREE_TIER_CONFIRMED:'true',GEMINI_API_KEY:key},user={id:member},admin=false,context=[source],quota={allowed:true,remaining:4},upstreamStatus=200,upstream=null,networkError=false}={}) {
 const calls=[];
 const fetcher=async(url,options)=>{
  calls.push({url,options});
  if(networkError)throw Error('secret error '+key);
  const data=url.endsWith('/auth/v1/user')?user:url.endsWith('/is_forum_admin')?admin:url.endsWith('/forum_ai_context')?context:url.endsWith('/forum_ai_reserve')?quota:
   upstream || {status:'completed',steps:[{type:'thought',content:[{type:'text',text:'Private reasoning never returned'}]},{type:'model_output',content:[{type:'text',text:JSON.stringify({answer:'Theo bài hiện có. [giả](https://evil.example/) https://evil.example/',source_ids:[article,'ffffffff-ffff-4fff-8fff-ffffffffffff',article]})}]}]};
  return {ok:!url.includes('googleapis') || upstreamStatus<400,status:url.includes('googleapis')?upstreamStatus:200,json:async()=>data};
 };
 const res={headers:{},setHeader(n,v){this.headers[n]=v;},status(s){this.statusCode=s;return this;},json(v){this.value=v;return this;}};
 await createAIHandler({fetcher,env})({method,body,headers:{authorization,origin,'content-type':'application/json'}},res);
 return {res,calls};
}
test('AI endpoint rejects guests, anonymous identities, cross-origin requests and unsupported methods',async()=>{
 for(const [input,status] of [[{authorization:null},401],[{user:{id:member,is_anonymous:true}},401],[{origin:'https://evil.example'},403],[{method:'PUT'},405]]) {
  const {res,calls}=await run(input);assert.equal(res.statusCode,status);assert.ok(!calls.some(c=>c.url.includes('googleapis')));
 }
});
test('AI remains disabled until key, explicit enable flag and free-tier confirmation exist',async()=>{
 for(const env of [{},{AI_ENABLED:'true',GEMINI_API_KEY:key},{AI_FREE_TIER_CONFIRMED:'true',GEMINI_API_KEY:key}]) {
  const {res,calls}=await run({env});assert.equal(res.statusCode,503);assert.equal(calls.length,1);
 }
 const {res}=await run({method:'GET',env:{}});assert.equal(res.statusCode,200);assert.equal(res.value.ready,false);assert.ok(!JSON.stringify(res.value).includes(key));
});
test('members cannot invoke editor mode even by crafting a direct request',async()=>{
 const {res,calls}=await run({body:{mode:'edit',prompt:'Draft',consent:true}});assert.equal(res.statusCode,403);assert.equal(calls.length,2);
});
test('consent and input bounds are enforced on the server',async()=>{
 for(const body of [{mode:'ask',prompt:'Question',consent:false},{mode:'ask',prompt:'x'.repeat(3001),consent:true},{mode:'unknown',prompt:'Question',consent:true}]) {
  const {res,calls}=await run({body});assert.equal(res.statusCode,400);assert.equal(calls.length,1);
 }
});
test('missing sources do not fabricate an AI answer or consume provider quota',async()=>{
 const {res,calls}=await run({context:[]});assert.equal(res.statusCode,200);assert.equal(res.value.generated,false);assert.ok(!calls.some(c=>c.url.endsWith('forum_ai_reserve') || c.url.includes('googleapis')));
});
test('database quotas block the provider request',async()=>{
 const {res,calls}=await run({quota:{allowed:false,message:'Daily cap'}});assert.equal(res.statusCode,429);assert.ok(!calls.some(c=>c.url.includes('googleapis')));
});
test('provider uses stateless bounded requests; returned sources and links cannot be forged',async()=>{
 const {res,calls}=await run();assert.equal(res.statusCode,200);assert.equal(res.headers['Cache-Control'],'private, no-store');
 const provider=calls.find(c=>c.url.includes('googleapis'));const request=JSON.parse(provider.options.body);
 assert.equal(request.model,'gemini-3.5-flash-lite');assert.equal(request.store,false);assert.equal(request.generation_config.max_output_tokens,1600);assert.equal(request.tools,undefined);
 assert.deepEqual(res.value.sources,[{id:article,title:source.title}]);assert.ok(!res.value.answer.includes('https://'));assert.ok(!JSON.stringify(res.value).includes('Private reasoning'));assert.ok(!JSON.stringify(res.value).includes(key));
});
test('admin can request editorial suggestions without automatic publishing tools',async()=>{
 const {res,calls}=await run({admin:true,body:{mode:'edit',prompt:'A draft to review',consent:true},context:[]});assert.equal(res.statusCode,200);
 const payload=JSON.parse(calls.find(c=>c.url.includes('googleapis')).options.body);assert.match(payload.system_instruction,/Không tự duyệt hay đăng bài/);assert.equal(payload.tools,undefined);
});
test('free quota and eligibility errors never trigger a paid fallback or retry',async()=>{
 for(const status of [429,402,403]) {
  const {res,calls}=await run({upstreamStatus:status});assert.ok([429,503].includes(res.statusCode));assert.equal(calls.filter(c=>c.url.includes('googleapis')).length,1);assert.match(res.value.error,/miễn phí|trả phí/);
 }
});
test('network/malformed model output does not expose keys or private diagnostics',async()=>{
 for(const options of [{networkError:true},{upstream:{status:'completed',steps:[{type:'model_output',content:[{type:'text',text:'invalid JSON'}]}]}},{upstream:{status:'in_progress',steps:[]}}]) {
  const {res}=await run(options);assert.equal(res.statusCode,503);assert.ok(!JSON.stringify(res.value).includes(key));
 }
});
