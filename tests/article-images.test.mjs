import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createMarkdownRenderer} from '../js/safe-markdown.js';
const dom=new JSDOM();
const render=createMarkdownRenderer(dom.window);
const safe='https://accounting-forum.vercel.app/article-images/vat-tt89-2026/01-gtgt-to-khai.png';
function parse(markdown){const node=dom.window.document.createElement('div');node.innerHTML=render(markdown);return node;}

test('reviewed form PNGs render with a readable label and zoom link',()=>{
  const node=parse(`![Mẫu 01/GTGT & điều kiện](${safe})`);
  const img=node.querySelector('img');
  assert.equal(img.src,safe);
  assert.equal(img.alt,'Mẫu 01/GTGT & điều kiện');
  assert.equal(img.getAttribute('loading'),'lazy');
  assert.equal(img.getAttribute('referrerpolicy'),'no-referrer');
  assert.equal(img.parentElement.href,safe);
  assert.equal(img.parentElement.target,'_blank');
  assert.equal(img.parentElement.rel,'noopener noreferrer');
  assert.match(node.textContent,/Xem ảnh lớn/);
});

test('external images, executable formats and URL tricks stay text only',()=>{
  for(const href of [
    'https://tracking.example/form.png',
    safe.replace('https:','http:'),
    safe.replace('accounting-forum.vercel.app','accounting-forum.vercel.app.evil.example'),
    safe.replace('accounting-forum.vercel.app','accounting-forum.vercel.app@evil.example'),
    safe.replace('.png','.svg'),safe.replace('.png','.html'),
    safe+'?viewer=123',safe+'#fragment',
    safe.replace('/vat-tt89-2026/','/vat-tt89-2026/../../'),
    safe.replace('/vat-tt89-2026/','/%76at-tt89-2026/'),
    'data:image/svg+xml,%3Csvg/onload=alert(1)%3E',
    'javascript:alert(1)', '/article-images/vat-tt89-2026/form.png'
  ])assert.equal(parse(`![Biểu mẫu](${href})`).querySelectorAll('img').length,0,href);
});

test('image labels and raw HTML cannot introduce event handlers or extra elements',()=>{
  const node=parse(`![<img src=x onerror=alert(1)> " &](${safe})\n\n<img src="${safe}" onerror="alert(1)">`);
  assert.equal(node.querySelectorAll('img').length,1);
  assert.equal(node.querySelectorAll('script,svg,iframe,object,style').length,0);
  for(const element of node.querySelectorAll('*'))for(const attr of element.attributes)assert.ok(!/^on|^data-/i.test(attr.name));
  assert.match(node.querySelector('img').alt,/onerror/);
});
