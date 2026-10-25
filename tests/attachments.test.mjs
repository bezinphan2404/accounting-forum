import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {renderAttachments,openAttachment} from '../js/attachments.js';
const id='11111111-1111-4111-8111-111111111111';
const file={id,filename:'<script>form.pdf',mime_type:'application/pdf',byte_size:1024,license_text:'Use & verify',source_url:'https://chinhphu.vn'};
test('guest prompt contains no path or download link; member display escapes metadata',()=>{
 const guest=renderAttachments({files:[{...file,storage_path:'private-secret'}],hasAttachments:true});assert.ok(!guest.includes('private-secret'));assert.ok(!guest.includes('attachment-download'));assert.match(guest,/member-register/);
 const node=new JSDOM(renderAttachments({files:[file],viewer:{id}})).window.document;
 assert.equal(node.querySelectorAll('script,[onclick]').length,0);assert.equal(node.querySelector('strong').textContent,file.filename);assert.ok(node.querySelector('[data-action="attachment-view"]'));assert.ok(node.querySelector('[data-action="attachment-download"]'));
 assert.equal(renderAttachments({files:[],viewer:{id}}),'');
});
test('guest action cannot request storage; failed download leaves the button usable',async()=>{
 let reads=0;const notices=[];const button={dataset:{id},disabled:false};
 await openAttachment(button,{downloadAttachment:async()=>reads++,getViewer:()=>null,showToast:s=>notices.push(s)});assert.equal(reads,0);assert.match(notices[0],/đăng nhập/);
 await openAttachment(button,{downloadAttachment:async()=>{throw Error('Denied');},getViewer:()=>({id}),showToast:s=>notices.push(s)});assert.equal(button.disabled,false);assert.equal(notices.at(-1),'Denied');
});
test('member download uses local Blob URL and safe filename, never a public or signed storage URL',async()=>{
 const dom=new JSDOM('<div></div>');const oldDoc=globalThis.document;globalThis.document=dom.window.document;
 const create=URL.createObjectURL;let clicked=null;dom.window.HTMLAnchorElement.prototype.click=function(){clicked={href:this.href,download:this.download};};URL.createObjectURL=()=> 'blob:local-file';
 try{await openAttachment({dataset:{id},disabled:false},{getViewer:()=>({id}),downloadAttachment:async()=>({blob:new Blob(['synthetic']),mimeType:'application/pdf',filename:'../form.pdf'}),showToast:()=>{}});assert.deepEqual(clicked,{href:'blob:local-file',download:'.._form.pdf'});}
 finally{URL.createObjectURL=create;globalThis.document=oldDoc;dom.window.close();}
});
test('a download completing after account change creates no Blob or link',async()=>{
 const create=URL.createObjectURL;let created=0;URL.createObjectURL=()=>{created++;return 'blob:test';};let current={id};let finish;const notices=[];
 try{const pending=openAttachment({dataset:{id},disabled:false},{getViewer:()=>current,downloadAttachment:()=>new Promise(r=>finish=r),showToast:s=>notices.push(s)});current=null;finish({blob:new Blob(['synthetic']),mimeType:'application/pdf',filename:'form.pdf'});await pending;assert.equal(created,0);assert.match(notices[0],/đăng nhập/);}
 finally{URL.createObjectURL=create;}
});
