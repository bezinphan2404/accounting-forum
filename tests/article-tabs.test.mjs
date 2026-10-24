import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createMarkdownRenderer,mountArticleTabs,expandArticleReferences,articleExcerpt} from '../js/safe-markdown.js';
import {RETIRED_PARTS,canonicalSeriesRoute,archivedMatches,adjustSeriesStats,visibleThreadPage} from '../js/published-series.js';

test('tabs switch within one article, hide inactive content and support keyboard and previous/next',()=>{
 const dom=new JSDOM('<main></main>');const w=dom.window;const root=w.document.querySelector('main');
 root.innerHTML=createMarkdownRenderer(w)('Chọn phần.\n\n:::tabs\n:::tab Một\n### Nội dung A\nBảng A.\n:::tab Hai\n### Nội dung B\n[Luật](https://chinhphu.vn)\n:::tab Ba\n### Nội dung C\nKết thúc.\n:::endtabs');
 const selections=[];mountArticleTabs(root,{initialPart:2,onSelect:p=>selections.push(p)});
 const tabs=[...root.querySelectorAll('[role=tab]')],panels=[...root.querySelectorAll('[role=tabpanel]')];
 assert.equal(tabs.length,3);assert.deepEqual(panels.map(p=>p.hidden),[true,false,true]);assert.equal(tabs[1].tabIndex,0);
 assert.equal(panels[1].querySelector('a').href,'https://chinhphu.vn/');
 tabs[1].dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true}));assert.equal(panels[2].hidden,false);assert.equal(w.document.activeElement,tabs[2]);
 panels[2].querySelector('[data-tab-step="-1"]').click();assert.equal(panels[1].hidden,false);
 tabs[0].click();assert.equal(panels[0].hidden,false);assert.deepEqual(selections,[3,2,1]);
 for(let i=0;i<3;i++){assert.equal(tabs[i].getAttribute('aria-controls'),panels[i].id);assert.equal(panels[i].getAttribute('aria-labelledby'),tabs[i].id);}
 dom.window.close();
});

test('source aliases expand into exact HTTPS links, keep page fragments and reject executable destinations',()=>{
 const text=':::tabs\n:::tab Phần một <img src=x onerror=bad()>\n[Nghị định số 254/2026/NĐ-CP](bzref:nguon-1#page=14)\n:::endtabs\n\n:::references\nnguon-1 https://datafiles.chinhphu.vn/test.pdf\n:::endreferences\n';
 const dom=new JSDOM();const holder=dom.window.document.createElement('div');holder.innerHTML=createMarkdownRenderer(dom.window)(text);
 assert.equal(holder.querySelector('a').href,'https://datafiles.chinhphu.vn/test.pdf#page=14');assert.equal(holder.querySelector('a').textContent,'Nghị định số 254/2026/NĐ-CP ↗');
 assert.equal(holder.querySelector('img,script'),null);assert.ok(!holder.textContent.includes(':::references'));
 assert.ok(expandArticleReferences('[x](bzref:missing)').includes('[x]()'));
 for(const bad of ['javascript:alert(1)','https://user:password@example.com/x']){holder.innerHTML=createMarkdownRenderer(dom.window)('[x](bzref:source)\n\n:::references\nsource '+bad+'\n:::endreferences');assert.equal(holder.querySelector('a'),null);}
 assert.ok(!articleExcerpt(text).includes(':::'));dom.window.close();
});

test('the 19 previous part URLs open their corresponding tab in one of four main articles',()=>{
 assert.equal(Object.keys(RETIRED_PARTS).length,19);assert.equal(new Set(Object.values(RETIRED_PARTS).map(p=>p.parent)).size,4);
 for(const [id,p] of Object.entries(RETIRED_PARTS))assert.equal(canonicalSeriesRoute('#/thread/'+id),'#/thread/'+p.parent+'?part='+p.part);
 assert.equal(canonicalSeriesRoute('#/thread/11111111-1111-4111-8111-111111111111'),'#/thread/11111111-1111-4111-8111-111111111111');
});

test('feed and search pagination exclude retained part records without empty pages, duplicates or wrong totals',async()=>{
 const rows=Array.from({length:82},(_,i)=>({id:String(i),title:'Bài '+i}));const hidden=new Set(['0','2','20','21','45','80']);
 const fetchPage=async offset=>({items:rows.slice(offset,offset+50),total:rows.length});
 let cursors=new Map([[0,0]]);const collected=[];
 for(const offset of [0,20,40,60]){const page=await visibleThreadPage(fetchPage,{offset,hiddenIds:hidden,hiddenCount:hidden.size,cursors});cursors=page.cursors;assert.equal(page.total,76);assert.equal(page.items.length,Math.min(20,76-offset));collected.push(...page.items.map(r=>r.id));}
 assert.deepEqual(collected,rows.filter(r=>!hidden.has(r.id)).map(r=>r.id));assert.equal(new Set(collected).size,76);
 const previous=await visibleThreadPage(fetchPage,{offset:20,hiddenIds:hidden,hiddenCount:hidden.size,cursors});assert.deepEqual(previous.items.map(r=>r.id),collected.slice(20,40));
});

test('counts respect parent categories, authors and the existing ILIKE search behavior',()=>{
 const cats=[{id:'tax'},{id:'invoice',parent_id:'tax'},{id:'finance'}];
 const rows=[{category_id:'invoice',author_id:'a',title:'Hóa đơn',content:'Mốc lập',tags:['điện tử']},{category_id:'finance',author_id:'b',title:'Vốn',content:'DuPont',tags:[]}];
 assert.equal(archivedMatches(rows,{categoryId:'tax'},cats).length,1);assert.equal(archivedMatches(rows,{authorId:'b',search:'du_ont'},cats).length,1);assert.equal(archivedMatches(rows,{search:'điện tử'},cats).length,1);assert.equal(archivedMatches(rows,{search:'['},cats).length,0);
 assert.deepEqual(adjustSeriesStats({threads:10,categoryCounts:{tax:7,invoice:4,finance:3}},rows,cats),{threads:8,categoryCounts:{tax:6,invoice:3,finance:2}});
});
