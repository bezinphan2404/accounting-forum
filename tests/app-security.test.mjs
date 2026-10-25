import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

test('UI renders without executable attributes or global handlers and delegated forms/navigation work',async()=>{
 const dom=new JSDOM('<div id="app"></div>',{url:'https://example.com/#/'});
 const w=dom.window;globalThis.window=w;globalThis.document=w.document;globalThis.location=w.location;globalThis.history=w.history;globalThis.sessionStorage=w.sessionStorage;
 const id='11111111-1111-4111-8111-111111111111';
 const cat={id:'cat-1',name:'<img src=x onerror=alert(1)>',icon:'<svg/onload=alert(1)>',color:'#123456'};
 const child={id:'cat-1-child',parent_id:'cat-1',name:'Chuyên mục con',sort_order:1,color:'#123456',icon:''};
 const categories=[cat,child,{id:'cat-6',name:'Hỏi đáp',sort_order:80,color:'#123456',icon:''}];
 const thread={id,authorId:id,categoryId:child.id,createdAt:new Date().toISOString(),title:'" onclick="alert(1)',content:'### Tiêu đề\nNội dung',tags:['<img src=x>'],likes:1,replyCount:0};
 const user={id,name:'<script>bad</script>',avatar:'BZ',role:'member',joinDate:new Date().toISOString()};
 const calls=[];
 let signedIn=true;let finishDetail;let loginSuccess=false;let aiReady=false;
 const api={getDB:()=>({replies:[]}),getCategories:()=>categories,getCategoryById:key=>categories.find(c=>c.id===key),getThreadCountByCategory:()=>1,getUsers:()=>[user],getUserById:()=>user,
 getThreads:()=>[thread],getThreadById:()=>thread,getReplies:()=>[],getReplyCount:()=>0,getStats:()=>({threads:1,replies:0,users:1,categories:1}),
 getCurrentUser:async()=>signedIn?user:null,clearForumData:()=>{},refreshData:async()=>calls.push(['refresh']),loadThreadPage:async o=>calls.push(['page',o]),loadThreadDetail:async()=>{calls.push(['detail']);return finishDetail?new Promise(r=>finishDetail=r):thread;},loadProfile:async()=>calls.push(['profile']),loadAdminReplies:async()=>calls.push(['admin']),getPageInfo:()=>({offset:0,total:1}),getAttachments:()=>[],downloadAttachment:async()=>{},
 isPasswordRecovery:()=>false,authCallbackError:'',signInWithGoogle:async()=>calls.push(['google']),
 authenticateUser:async()=>{if(loginSuccess){signedIn=true;return user;}throw Error('invalid login credentials');},createUser:async()=>({error:'email rate limit exceeded'}),
 getFeedbackPage:()=>({items:[{id,author_name:user.name,author_id:id,kind:'idea',status:'new',title:'<script>feedback</script>',content:'Public feedback <img src=x onerror=bad()>',admin_response:'',created_at:new Date().toISOString()}],total:1,offset:0}),loadFeedbackPage:async o=>calls.push(['feedback-page',o]),createFeedback:async o=>calls.push(['feedback-create',o]),updateFeedback:async(...o)=>calls.push(['feedback-update',...o]),
 getAIStatus:async()=>({ready:aiReady}),findAIArticles:async q=>{calls.push(['ai-search',q]);return [{id,title:'Source article'}];},askAI:async o=>{calls.push(['ai-ask',o]);return {generated:true,answer:'### Private AI draft\n<script>bad()</script>',sources:[{id,title:'Source article'}]};},
 signOut:async()=>{},updateThread:async()=>{},updateReply:async()=>{},sendPasswordReset:async()=>{},completePasswordReset:async()=>{},createThread:async()=>thread,incrementViews:()=>{},toggleLike:async()=>{},createReply:async()=>{}};
 globalThis.__appTestAPI=api;
 let code=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
 code=code.replace("import logoUrl from '../assets/logo.svg';","const logoUrl='/logo.svg';");
 code=code.replace(/import \{([^}]+)\} from '\.\/remote-data\.js';/g,'const {$1}=globalThis.__appTestAPI;');
 code=code.replace("'./safe-markdown.js'",JSON.stringify(new URL('../js/safe-markdown.js',import.meta.url).href));
 code=code.replace("'./article-watermark.js'",JSON.stringify(new URL('../js/article-watermark.js',import.meta.url).href));
 code=code.replace("'./article-protection.js'",JSON.stringify(new URL('../js/article-protection.js',import.meta.url).href));
 code=code.replace("'./attachments.js'",JSON.stringify(new URL('../js/attachments.js',import.meta.url).href));
 code=code.replace("'./published-series.js'",JSON.stringify(new URL('../js/published-series.js',import.meta.url).href));
 code=code.replace("'./community-tools.js'",JSON.stringify(new URL('../js/community-tools.js',import.meta.url).href));
 await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const settle=()=>new Promise(r=>setTimeout(r,20));await settle();
 assert.ok(w.document.querySelector('.thread-card'));assert.ok(w.document.body.textContent.includes(thread.title));
 assert.ok(w.document.getElementById('community-tools'));assert.equal(w.document.querySelector('.module-nav'),null);
 w.document.querySelector('[data-action="community-ai"]').click();await settle();
 assert.equal(w.location.hash,'#/');assert.equal(w.document.querySelector('.community-panel').hidden,false);
 w.document.getElementById('community-question').value='GTGT';
 w.document.querySelector('[data-tool="search"]').click();await settle();assert.ok(w.document.querySelector('.community-result a'));
 w.document.querySelector('[data-action="community-feedback"]').click();await settle();assert.ok(w.document.getElementById('community-feedback-content'));
 w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(w.document.querySelector('.community-panel').hidden,true);

 assert.equal(w.document.querySelectorAll('script,[onclick],[onsubmit],[onkeydown],svg[onload],img[onerror]').length,0);
 for(const name of ['handleLogin','handleReply','handleAdminReply','navigate','previewPost'])assert.equal(w[name],undefined);
 w.location.hash='#/login';await settle();
 const form=w.document.querySelector('form');form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();
 assert.ok(w.document.getElementById('login-error').textContent.includes('Email hoặc mật khẩu'));
 w.document.querySelector('[data-action="google"]').click();await settle();assert.equal(calls.filter(c=>c[0]==='google').length,1);
 w.location.hash='#/register';await settle();w.document.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();
 assert.ok(w.document.getElementById('reg-error').textContent.includes('Tiếp tục với Google'));
 w.location.hash='#/admin';await settle();assert.equal(w.location.hash,'#/');
 assert.ok(w.document.querySelector('.category-group:last-child').textContent.includes('Hỏi đáp'));
 w.location.hash='#/category/cat-1';await settle();assert.equal(calls.filter(c=>c[0]==='page').at(-1)[1].categoryId,'cat-1');
 w.location.hash='#/category/cat-1-child';await settle();assert.ok(w.document.querySelector('.category-group details').open);
 assert.ok(w.document.querySelector('.breadcrumb').textContent.includes('Chuyên mục con'));
 w.location.hash='#/new-thread';await settle();assert.equal(w.document.querySelectorAll('optgroup').length,2);assert.equal(w.document.querySelector('option[value="cat-1-child"]').textContent,'Chuyên mục con');
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.document.getElementById('thread-content').value=':::tabs\n:::tab Một\nNội dung một\n:::tab Hai\nNội dung hai\n:::endtabs';
 w.document.querySelector('[data-action="preview"]').click();const preview=w.document.querySelector('dialog');assert.ok(preview.open);assert.equal(preview.querySelectorAll('[role=tab]').length,2);preview.querySelectorAll('[role=tab]')[1].click();assert.equal(preview.querySelectorAll('[role=tabpanel]')[1].hidden,false);assert.equal(w.location.hash,'#/new-thread');preview.querySelector('.preview-close').click();assert.equal(w.document.querySelector('dialog'),null);
 w.location.hash='#/edit/'+id;await settle();assert.equal(w.document.querySelector('select[name="category"]').value,child.id);
 w.location.hash='#/feedback';await settle();assert.ok(w.document.body.textContent.includes('Public feedback <img'));
 assert.equal(w.document.querySelectorAll('.feedback-card script,.feedback-card img').length,0);
 w.document.getElementById('feedback-title').value='Suggestion';w.document.getElementById('feedback-content').value='Test feedback';
 w.document.querySelector('form[data-submit="handleFeedback"]').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();assert.equal(calls.filter(c=>c[0]==='feedback-create').length,1);
 w.location.hash='#/ai';await settle();assert.ok(w.document.body.textContent.includes('AI đang chờ kết nối'));assert.equal(w.document.querySelector('[data-mode="edit"]'),null);assert.ok(w.document.querySelector('button[type="submit"]').disabled);
 w.document.getElementById('ai-input').value='GTGT';w.document.querySelector('[data-action="ai-search"]').click();await settle();assert.ok(w.document.querySelector('.ai-sources a'));
 // A member reading the article cannot use ordinary copy; replies/editor stay editable.
 w.location.hash='#/thread/'+id;await settle();
 const protectedBody=w.document.querySelector('.article-copy-protected');assert.ok(protectedBody);
 const memberCopy=new w.Event('copy',{bubbles:true,cancelable:true});protectedBody.querySelector('p').dispatchEvent(memberCopy);assert.ok(memberCopy.defaultPrevented);
 const replyCopy=new w.Event('copy',{bubbles:true,cancelable:true});w.document.getElementById('reply-content').dispatchEvent(replyCopy);assert.equal(replyCopy.defaultPrevented,false);
 w.location.hash='#/edit/'+id;await settle();assert.equal(w.document.querySelector('.article-copy-protected'),null);
 user.role='admin';aiReady=true;w.location.hash='#/feedback';await settle();assert.ok(w.document.querySelector('.feedback-admin'));
 w.document.querySelector('select[name="status"]').value='planned';w.document.querySelector('textarea[name="response"]').value='Planned response';
 w.document.querySelector('form[data-submit="handleFeedbackAdmin"]').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();assert.equal(calls.filter(c=>c[0]==='feedback-update').at(-1)[2],'planned');
 w.location.hash='#/ai';await settle();w.document.querySelector('[data-mode="edit"]').click();await settle();
 w.document.getElementById('ai-input').value='Public editorial draft';w.document.getElementById('ai-consent').checked=true;
 w.document.querySelector('form[data-submit="handleAI"]').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();assert.equal(calls.filter(c=>c[0]==='ai-ask').at(-1)[1].mode,'edit');assert.ok(w.document.querySelector('.ai-answer'));assert.equal(w.document.querySelectorAll('.ai-answer script').length,0);
 // The reader mark exists on article content, not editor/AI input, and clears on navigation.
 w.location.hash='#/thread/'+id;await settle();
 assert.equal(w.document.querySelector('.article-watermark').dataset.memberName,user.name);
 assert.equal(w.document.querySelector('.article-watermark').dataset.memberCode,undefined);
 assert.equal(w.document.querySelector('.article-watermark').getAttribute('aria-hidden'),'true');
 assert.ok(w.document.querySelector('.article-copy-protected')); // Admin reading view is covered too.
 thread.content=':::tabs\n:::tab Phần một\nNội dung một.\n:::tab Phần hai\nNội dung hai.\n:::endtabs';
 w.location.hash='#/thread/'+id+'?part=2';await settle();
 assert.equal(w.document.querySelectorAll('[role=tab]').length,2);assert.equal(w.document.querySelectorAll('[role=tabpanel]')[1].hidden,false);
 w.document.querySelector('[role=tab]').click();assert.equal(w.location.hash,'#/thread/'+id);
 w.location.hash='#/new-thread';await settle();assert.equal(w.document.querySelector('.article-watermark'),null);
 // Signout drops member controls and re-renders the current public article.
 w.location.hash='#/thread/'+id;await settle();
 signedIn=false;w.dispatchEvent(new w.Event('bz-auth-cleared'));await settle();
 assert.equal(w.document.querySelector('#reply-content'),null);assert.ok(w.document.querySelector('.thread-detail'));
 assert.equal(w.document.querySelector('[data-route^="#/edit/"]'),null);
 for(const route of ['#/','#/thread/'+id,'#/category/cat-1','#/search?q=private']) {
  w.location.hash=route;await settle();assert.equal(w.location.hash,route);assert.ok(!w.document.querySelector('#reply-content'));
 }
 const before=calls.length;
 for(const route of ['#/profile/'+id,'#/edit/'+id,'#/new-thread','#/admin','#/ai','#/feedback']) {
  w.location.hash=route;await settle();assert.equal(w.location.hash,'#/login');assert.equal(w.document.querySelector('.thread-card'),null);
 }
 assert.equal(calls.length,before);
 for(const route of ['#/register','#/forgot-password','#/reset-password']){w.location.hash=route;await settle();assert.ok(w.document.querySelector('form'));}
 assert.equal(w.document.querySelector('#new-password'),null);
 loginSuccess=true;w.sessionStorage.setItem('bz_return_to','#/category/cat-1-child');w.location.hash='#/login';await settle();
 w.document.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();
 assert.equal(w.location.hash,'#/category/cat-1-child');assert.ok(w.document.querySelector('.thread-card'));
 dom.window.close();
});

test('guest deep links show public article and sign-in prompts, not member forms',async()=>{
 const id='11111111-1111-4111-8111-111111111111';
 const dom=new JSDOM('<div id="app"></div>',{url:'https://example.com/#/thread/'+id});
 const w=dom.window;globalThis.window=w;globalThis.document=w.document;globalThis.location=w.location;globalThis.history=w.history;globalThis.sessionStorage=w.sessionStorage;
 let reads=0;
 const t={id,authorId:id,categoryId:'cat-1',title:'Guest-readable knowledge',content:'### Hướng dẫn\nPublic knowledge',tags:[],createdAt:new Date().toISOString(),likes:0,replyCount:2,has_attachments:true};
 globalThis.__appTestAPI={getCurrentUser:async()=>null,isPasswordRecovery:()=>false,authCallbackError:'',refreshData:async()=>reads++,loadThreadDetail:async()=>reads++,clearForumData:()=>{},getThreadById:()=>t,getUserById:()=>({id,name:'Author'}),getCategoryById:key=>key==='cat-1'?({id:'cat-1',name:'Thuế'}):null,getCategories:()=>[{id:'cat-1',name:'Thuế'}],getStats:()=>({threads:1,replies:2,users:1}),getThreadCountByCategory:()=>1,getReplies:()=>[],getAttachments:()=>[],incrementViews:()=>{}};
 let code=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
 code=code.replace("import logoUrl from '../assets/logo.svg';","const logoUrl='/logo.svg';").replace(/import \{([^}]+)\} from '\.\/remote-data\.js';/g,'const {$1}=globalThis.__appTestAPI;');
 for(const name of ['safe-markdown','article-watermark','article-protection','attachments','published-series','community-tools'])code=code.replace("'./"+name+".js'",JSON.stringify(new URL('../js/'+name+'.js',import.meta.url).href));
 await import('data:text/javascript;base64,'+Buffer.from(code+'\n//guest').toString('base64'));
 const settle=()=>new Promise(r=>setTimeout(r,20));w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await settle();
 assert.equal(reads,2);assert.equal(w.location.hash,'#/thread/'+id);assert.equal(w.document.querySelector('h1').textContent,t.title);
 assert.ok(w.document.querySelector('.article-copy-protected'));assert.ok(w.document.querySelector('#search-input'));
 assert.equal(w.document.querySelector('#reply-content'),null);assert.equal(w.document.querySelector('[data-action="more-replies"]'),null);
 assert.equal(w.document.querySelector('[data-action="attachment-download"]'),null);assert.ok(w.document.querySelector('.thread-attachments'));
 w.document.querySelector('.thread-attachments [data-action="member-register"]').click();await settle();
 assert.equal(w.location.hash,'#/register');assert.equal(w.sessionStorage.getItem('bz_return_to'),'#/thread/'+id);
 dom.window.close();
});
