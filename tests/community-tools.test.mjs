import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createMarkdownRenderer} from '../js/safe-markdown.js';
import {renderCommunityToolsShell,openCommunityToolsPanel,closeCommunityToolsPanel} from '../js/community-tools.js';
const viewer={id:'11111111-1111-4111-8111-111111111111'};
const settle=()=>new Promise(r=>setTimeout(r,15));
function fixture(api={}) {
 const dom=new JSDOM('<main><h1>Bài đang đọc</h1></main>'+renderCommunityToolsShell('/logo.svg'),{url:'https://example.com/#/thread/test'});
 const root=dom.window.document.getElementById('community-tools');
 const options={viewer,getViewer:()=>viewer,api:{getAIStatus:async()=>({ready:false}),...api},renderMarkdown:createMarkdownRenderer(dom.window)};
 return {dom,root,options,open:kind=>openCommunityToolsPanel(root,{...options,kind})};
}

test('AI searches in place when disconnected and escapes source titles without sending a model request',async()=>{
 let searched=0,asked=0;
 const f=fixture({findAIArticles:async q=>{searched++;assert.equal(q,'GTGT');return [{id:viewer.id,title:'<img src=x onerror=bad()> Chính sách'}];},askAI:async()=>asked++});
 await f.open('ai');
 f.root.querySelector('textarea').value='GTGT';f.root.querySelector('[data-tool="search"]').click();await settle();
 assert.equal(searched,1);assert.equal(asked,0);
 assert.ok(f.root.querySelector('.community-result a').textContent.includes('<img'));
 assert.equal(f.root.querySelectorAll('.community-result img,.community-result script').length,0);
 assert.ok(f.dom.window.document.querySelector('main h1'));assert.equal(f.dom.window.location.hash,'#/thread/test');
 assert.equal(f.root.querySelector('[type="submit"]').disabled,true);
 f.dom.window.close();
});

test('AI requires consent, uses the existing ask mode, sanitizes answers and ignores a response after identity changes',async()=>{
 let asked=0,finish;
 const f=fixture({getAIStatus:async()=>({ready:true}),askAI:async p=>{asked++;assert.deepEqual(p,{mode:'ask',prompt:'Câu hỏi',consent:true});return {answer:'**Kết quả** <script>bad()</script>',sources:[]};}});
 await f.open('ai');const form=f.root.querySelector('form');form.elements.prompt.value='Câu hỏi';
 form.dispatchEvent(new f.dom.window.Event('submit',{cancelable:true}));await settle();assert.equal(asked,0);
 form.elements.consent.checked=true;form.dispatchEvent(new f.dom.window.Event('submit',{cancelable:true}));await settle();
 assert.equal(asked,1);assert.ok(f.root.querySelector('.community-result strong'));assert.equal(f.root.querySelectorAll('.community-result script').length,0);
 closeCommunityToolsPanel(f.root);
 let activeViewer=viewer;f.options.getViewer=()=>activeViewer;
 f.options.api.askAI=()=>new Promise(r=>finish=r);await f.open('ai');
 const next=f.root.querySelector('form');next.elements.prompt.value='Câu hỏi';next.elements.consent.checked=true;
 next.dispatchEvent(new f.dom.window.Event('submit',{cancelable:true}));await settle();
 activeViewer=null;finish({answer:'Private stale reply'});await settle();
 assert.ok(!f.root.textContent.includes('Private stale reply'));
 closeCommunityToolsPanel(f.root);
 f.dom.window.close();
});

test('feedback validates fields, prevents duplicate submits and gives confirmation without leaving the article',async()=>{
 let created=0,finish;
 const f=fixture({createFeedback:p=>{created++;assert.deepEqual(p,{kind:'bug',title:'Lỗi hiển thị',content:'Mô tả lỗi'});return new Promise(r=>finish=r);}});
 await f.open('feedback');const form=f.root.querySelector('form');
 form.dispatchEvent(new f.dom.window.Event('submit',{cancelable:true}));assert.equal(created,0);
 form.elements.kind.value='bug';form.elements.title.value='Lỗi hiển thị';form.elements.content.value='Mô tả lỗi';
 form.dispatchEvent(new f.dom.window.Event('submit',{cancelable:true}));form.dispatchEvent(new f.dom.window.Event('submit',{cancelable:true}));
 assert.equal(created,1);finish({});await settle();assert.ok(f.root.querySelector('[role="status"]').textContent.includes('Đã gửi'));
 assert.equal(f.dom.window.location.hash,'#/thread/test');assert.equal(form.elements.title.value,'');
 closeCommunityToolsPanel(f.root);assert.equal(f.root.querySelector('.community-panel').hidden,true);
 assert.equal(f.root.querySelector('[data-action="community-feedback"]').getAttribute('aria-expanded'),'false');
 f.dom.window.close();
});
