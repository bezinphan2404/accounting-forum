import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {watermarkForViewer, mountArticleWatermark} from '../js/article-watermark.js';

const viewer = {id:'12345678-abcd-4123-8123-123456789abc',name:'Private Display Name',email:'private@example.com'};
const at = new Date('2026-10-24T17:30:00Z');

test('viewer mark uses a short code and Vietnam opening time without copying personal fields',()=>{
  const mark=watermarkForViewer(viewer,at);
  assert.equal(mark.memberCode,'TV-12345678ABCD');
  assert.equal(mark.timeLabel,'25/10/2026 00:30 (UTC+7)');
  const svg=decodeURIComponent(mark.image);
  for(const privateValue of [viewer.id,viewer.name,viewer.email]) assert.ok(!svg.includes(privateValue));
  assert.notEqual(watermarkForViewer({...viewer,id:'abcdef12-3456-4123-8123-123456789abc'},at).memberCode,mark.memberCode);
});

test('no viewer or malformed identifiers cannot become an active image or markup',()=>{
  for(const invalid of [null,{}, {id:'"/><script>alert(1)</script>'}, {id:viewer.email}]) assert.equal(watermarkForViewer(invalid,at),null);
  assert.equal(watermarkForViewer(viewer,new Date('invalid')),null);
});

test('replacing a viewer leaves one hidden mark, preserves the article and removes stale identity on clearing',()=>{
  const doc=new JSDOM('<article><div class="content-body"><a href="https://chinhphu.vn">Nguồn</a><p>Kiến thức</p></div></article><textarea></textarea>').window.document;
  const surface=doc.querySelector('article');
  const original=surface.querySelector('.content-body').innerHTML;
  assert.equal(mountArticleWatermark(surface,viewer,at),true);
  const overlay=surface.querySelector('.article-watermark');
  assert.equal(overlay.getAttribute('aria-hidden'),'true');
  assert.equal(overlay.tabIndex,-1);
  assert.ok(overlay.style.backgroundImage.startsWith('url('));
  mountArticleWatermark(surface,{id:'abcdef12-3456-4123-8123-123456789abc'},at);
  assert.equal(surface.querySelectorAll('.article-watermark').length,1);
  assert.equal(surface.querySelector('.article-watermark').dataset.memberCode,'TV-ABCDEF123456');
  assert.equal(surface.querySelector('.content-body').innerHTML,original);
  assert.equal(doc.querySelector('textarea').closest('.article-watermark-surface'),null);
  mountArticleWatermark(surface,null,at);
  assert.equal(surface.querySelector('.article-watermark'),null);
  assert.ok(!surface.classList.contains('article-watermark-surface'));
});
