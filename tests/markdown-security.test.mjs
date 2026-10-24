import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createMarkdownRenderer} from '../js/safe-markdown.js';
const dom=new JSDOM();
const render=createMarkdownRenderer(dom.window);
function parse(s){const el=dom.window.document.createElement('div');el.innerHTML=render(s);return el;}
test('malformed links and HTML cannot create executable nodes or app actions',()=>{
 for(const payload of ['<img src=x onerror=alert(1)>','<svg/onload=alert(1)>','<script>alert(1)</script>',
  '[go](javascript:alert(1))','[go](data:text/html,<script>alert(1)</script>)',
  '[go](https://example.com/" onmouseover="alert(1))','[go](https://example.com/**x**` onclick=`alert(1))',
  '<a href="javascript:alert(1)" data-action="logout">bad</a>',
  '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=alert(1)>">']){
  const el=parse(payload);
  assert.equal(el.querySelectorAll('script,img,svg,math,iframe,object,form,input,button,style').length,0,payload);
  for(const node of el.querySelectorAll('*'))for(const attr of node.attributes)assert.ok(!/^on|^data-/i.test(attr.name),payload);
  for(const a of el.querySelectorAll('a'))assert.ok(a.getAttribute('href').startsWith('https://'));
 }
});
test('formatting characters remain in URLs while link labels can use emphasis',()=>{
 const el=parse('[**nguồn**](https://example.com/a*b*c?x=%22&y=1)');const a=el.querySelector('a');
 assert.equal(a.getAttribute('href'),'https://example.com/a*b*c?x=%22&y=1');assert.equal(a.querySelector('strong').textContent,'nguồn');
 assert.equal(a.rel,'noopener noreferrer');assert.equal(a.target,'_blank');
});
test('tables, breaks, columns and literal old placeholders survive',()=>{
 const el=parse('BZCOLUMNBLOCK0END __TABLE_PLACEHOLDER_0__\n\n| Cột | Giá trị |\n| --- | --- |\n| **A** | 1<br>2 |\n\n:::columns\n### Một\n#### Nội dung\nĐầy đủ\n### Hai\n#### Công thức\n`a/b`\n### Ba\n#### Nguồn\n[Chính phủ](https://chinhphu.vn)\n:::endcolumns');
 assert.equal(el.querySelectorAll('table tbody tr').length,1);assert.equal(el.querySelectorAll('article').length,3);
 assert.equal(el.querySelector('td br').nextSibling.textContent,'2');assert.equal(el.querySelector('code').textContent,'a/b');
 assert.ok(el.textContent.includes('BZCOLUMNBLOCK0END'));assert.ok(el.textContent.includes('TABLE_PLACEHOLDER'));
});
