import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

test('UI renders without executable attributes or global handlers and delegated forms/navigation work',async()=>{
 const dom=new JSDOM('<div id="app"></div>',{url:'https://example.com/#/'});
 const w=dom.window;globalThis.window=w;globalThis.document=w.document;globalThis.location=w.location;globalThis.history=w.history;globalThis.sessionStorage=w.sessionStorage;
 const id='11111111-1111-4111-8111-111111111111';
 const cat={id:'cat-1',name:'<img src=x onerror=alert(1)>',icon:'<svg/onload=alert(1)>',color:'#123456'};
 const thread={id,authorId:id,categoryId:'cat-1',createdAt:new Date().toISOString(),title:'" onclick="alert(1)',content:'### Tiêu đề\nNội dung',tags:['<img src=x>'],likes:1,replyCount:0};
 const user={id,name:'<script>bad</script>',avatar:'BZ',role:'member',joinDate:new Date().toISOString()};
 const calls=[];
 const api={getDB:()=>({replies:[]}),getCategories:()=>[cat],getCategoryById:key=>key===cat.id?cat:null,getThreadCountByCategory:()=>1,getUsers:()=>[user],getUserById:()=>user,
 getThreads:()=>[thread],getThreadById:()=>thread,getReplies:()=>[],getReplyCount:()=>0,getStats:()=>({threads:1,replies:0,users:1,categories:1}),
 getCurrentUser:async()=>null,refreshData:async()=>{},loadThreadPage:async o=>calls.push(['page',o]),loadThreadDetail:async()=>thread,loadProfile:async()=>{},loadAdminReplies:async()=>{},getPageInfo:()=>({offset:0,total:1}),
 isPasswordRecovery:()=>false,authCallbackError:'',signInWithGoogle:async()=>calls.push(['google']),
 authenticateUser:async()=>{throw Error('invalid login credentials');},createUser:async()=>({error:'email rate limit exceeded'}),
 signOut:async()=>{},updateThread:async()=>{},updateReply:async()=>{},sendPasswordReset:async()=>{},completePasswordReset:async()=>{},createThread:async()=>thread,incrementViews:()=>{},toggleLike:async()=>{},createReply:async()=>{}};
 globalThis.__appTestAPI=api;
 let code=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
 code=code.replace("import logoUrl from '../assets/logo.svg';","const logoUrl='/logo.svg';");
 code=code.replace(/import \{([^}]+)\} from '\.\/remote-data\.js';/g,'const {$1}=globalThis.__appTestAPI;');
 code=code.replace("'./safe-markdown.js'",JSON.stringify(new URL('../js/safe-markdown.js',import.meta.url).href));
 await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const settle=()=>new Promise(r=>setTimeout(r,20));await settle();
 assert.ok(w.document.querySelector('.thread-card'));assert.ok(w.document.body.textContent.includes(thread.title));
 assert.equal(w.document.querySelectorAll('script,[onclick],[onsubmit],[onkeydown],svg[onload],img[onerror]').length,0);
 for(const name of ['handleLogin','handleReply','handleAdminReply','navigate','previewPost'])assert.equal(w[name],undefined);
 w.location.hash='#/login';await settle();
 const form=w.document.querySelector('form');form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();
 assert.ok(w.document.getElementById('login-error').textContent.includes('Email hoặc mật khẩu'));
 w.document.querySelector('[data-action="google"]').click();await settle();assert.equal(calls.filter(c=>c[0]==='google').length,1);
 w.location.hash='#/register';await settle();w.document.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();
 assert.ok(w.document.getElementById('reg-error').textContent.includes('Tiếp tục với Google'));
 w.location.hash='#/admin';await settle();assert.equal(w.location.hash,'#/');
 dom.window.close();
});
