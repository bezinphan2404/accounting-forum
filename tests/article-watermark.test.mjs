import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {watermarkForViewer, mountArticleWatermark} from '../js/article-watermark.js';

const viewer = {id:'12345678-abcd-4123-8123-123456789abc',name:'Phan Thị Bezin',email:'private@example.com'};
const at = new Date('2026-10-24T17:30:00Z');

test('viewer mark shows the profile display name and Vietnam time without account identifiers or email',()=>{
  const mark=watermarkForViewer(viewer,at);
  assert.equal(mark.memberName,viewer.name);
  assert.equal(mark.timeLabel,'25/10/2026 00:30 (UTC+7)');
  const image=decodeURIComponent(mark.image);
  assert.ok(image.includes(viewer.name));
  for(const privateValue of [viewer.id,viewer.email,'TV-12345678ABCD']) assert.ok(!image.includes(privateValue));
  assert.equal(watermarkForViewer({...viewer,name:'Nguyễn Minh Anh'},at).memberName,'Nguyễn Minh Anh');
});

test('blank names use a neutral label and untrusted names remain plain text in the SVG',()=>{
  for(const name of [undefined,null,'  \t\n',123]) assert.equal(watermarkForViewer({...viewer,name},at).memberName,'Thành viên');
  const name='Mai & Lan </text><script>x</script> "🙂"';
  const mark=watermarkForViewer({...viewer,name},at);
  const raw=decodeURIComponent(mark.image);
  const doc=new JSDOM(raw.slice(raw.indexOf('<svg'),raw.lastIndexOf(')')-1),{contentType:'image/svg+xml'}).window.document;
  assert.equal(doc.querySelectorAll('script,image,foreignObject,[onload]').length,0);
  const labels=[...doc.querySelectorAll('text')].slice(1,-1).map(e=>e.textContent).join(' ');
  assert.equal(labels,name);
});

test('long Vietnamese names wrap without dropping the stored name and control characters are normalized',()=>{
  const name='Nguyễn Thị Hoàng Minh Anh Phương Thanh Ngọc Bảo Trâm';
  const mark=watermarkForViewer({...viewer,name},at);
  assert.equal(mark.memberName,name);
  const raw=decodeURIComponent(mark.image);
  const doc=new JSDOM(raw.slice(raw.indexOf('<svg'),raw.lastIndexOf(')')-1),{contentType:'image/svg+xml'}).window.document;
  const labels=[...doc.querySelectorAll('text')].slice(1,-1);
  assert.ok(labels.length>1);
  assert.equal(labels.map(e=>e.textContent).join(' '),name);
  assert.ok(labels.every(e=>Number(e.getAttribute('textLength'))<=250));
  assert.equal(watermarkForViewer({...viewer,name:'  Phan\u0000 Thị\nBezin  '},at).memberName,viewer.name);
});

test('no viewer or malformed identifiers cannot become an active image or markup',()=>{
  for(const invalid of [null,{}, {id:'"/><script>alert(1)</script>'}, {id:viewer.email}]) assert.equal(watermarkForViewer(invalid,at),null);
  assert.equal(watermarkForViewer(viewer,new Date('invalid')),null);
});

test('replacing a viewer leaves one hidden mark, preserves the article and removes stale names on clearing',()=>{
  const doc=new JSDOM('<article><div class="content-body"><a href="https://chinhphu.vn">Nguồn</a><p>Kiến thức</p></div></article><textarea></textarea>').window.document;
  const surface=doc.querySelector('article');
  const original=surface.querySelector('.content-body').innerHTML;
  assert.equal(mountArticleWatermark(surface,viewer,at),true);
  const overlay=surface.querySelector('.article-watermark');
  assert.equal(overlay.getAttribute('aria-hidden'),'true');
  assert.equal(overlay.tabIndex,-1);
  assert.ok(overlay.style.backgroundImage.startsWith('url('));
  assert.equal(overlay.style.backgroundSize,'320px 170px');
  mountArticleWatermark(surface,{id:'abcdef12-3456-4123-8123-123456789abc',name:'Nguyễn Minh Anh'},at);
  assert.equal(surface.querySelectorAll('.article-watermark').length,1);
  assert.equal(surface.querySelector('.article-watermark').dataset.memberName,'Nguyễn Minh Anh');
  assert.equal(surface.querySelector('.article-watermark').dataset.memberCode,undefined);
  assert.ok(!surface.innerHTML.includes(viewer.name));
  assert.equal(surface.querySelector('.content-body').innerHTML,original);
  assert.equal(doc.querySelector('textarea').closest('.article-watermark-surface'),null);
  mountArticleWatermark(surface,null,at);
  assert.equal(surface.querySelector('.article-watermark'),null);
  assert.ok(!surface.classList.contains('article-watermark-surface'));
});
