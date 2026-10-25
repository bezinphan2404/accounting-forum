import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {mountArticleProtection} from '../js/article-protection.js';

function fixture(){
  const dom=new JSDOM('<header>Header <input id="search"></header><div class="thread-detail-content"><div class="content-body"><p>Kiến thức GTGT</p><a href="https://chinhphu.vn">Nguồn chính thức</a><img src="/article-images/form.png"></div></div><textarea id="reply"></textarea><p id="outside">Outside</p>');
  const doc=dom.window.document;
  const surface=doc.querySelector('.thread-detail-content');
  mountArticleProtection(surface);
  return {dom,doc,surface};
}
function event(dom,type,options={}){return new dom.window.Event(type,{bubbles:true,cancelable:true,...options});}
function select(doc,node){const range=doc.createRange();range.selectNodeContents(node);const selection=doc.getSelection();selection.removeAllRanges();selection.addRange(range);}

test('copy and cut of article selections, including a whole-page range, are canceled',()=>{
  const {dom,doc,surface}=fixture();
  for(const node of [surface.querySelector('p'),doc.body]){
    select(doc,node);
    for(const type of ['copy','cut']){
      const e=event(dom,type);doc.dispatchEvent(e);assert.ok(e.defaultPrevented,type);
    }
  }
  select(doc,doc.querySelector('#outside'));
  const e=event(dom,'copy');doc.querySelector('#outside').dispatchEvent(e);assert.equal(e.defaultPrevented,false);
});

test('selection, dragging and text context menus are blocked; source link actions remain usable',()=>{
  const {dom,doc,surface}=fixture();
  for(const type of ['selectstart','dragstart','contextmenu']){
    const e=event(dom,type);surface.querySelector('p').dispatchEvent(e);assert.ok(e.defaultPrevented,type);
  }
  const link=surface.querySelector('a');
  for(const type of ['click','contextmenu']){
    const e=event(dom,type);link.dispatchEvent(e);assert.equal(e.defaultPrevented,false,type);
  }
  assert.equal(link.href,'https://chinhphu.vn/');
});

test('Ctrl/Cmd+A and ordinary copy shortcuts are restricted on the reading page',()=>{
  const {dom,doc,surface}=fixture();select(doc,surface);
  for(const key of ['c','x','Insert']){
    const e=new dom.window.KeyboardEvent('keydown',{key,ctrlKey:true,bubbles:true,cancelable:true});
    doc.dispatchEvent(e);assert.ok(e.defaultPrevented,key);
  }
  const all=new dom.window.KeyboardEvent('keydown',{key:'a',metaKey:true,bubbles:true,cancelable:true});doc.dispatchEvent(all);
  assert.ok(all.defaultPrevented);assert.equal(doc.getSelection().rangeCount,0);
  const find=new dom.window.KeyboardEvent('keydown',{key:'f',ctrlKey:true,bubbles:true,cancelable:true});doc.dispatchEvent(find);assert.equal(find.defaultPrevented,false);
});

test('search, replies and editable fields retain selection, copy, cut and shortcuts',()=>{
  const {dom,doc,surface}=fixture();
  for(const field of [doc.querySelector('#search'),doc.querySelector('#reply')]){
    select(doc,surface);field.focus();
    for(const type of ['copy','cut','selectstart','contextmenu']){
      const e=event(dom,type);field.dispatchEvent(e);assert.equal(e.defaultPrevented,false,type);
    }
    for(const key of ['a','c','x']){
      const e=new dom.window.KeyboardEvent('keydown',{key,ctrlKey:true,bubbles:true,cancelable:true});field.dispatchEvent(e);assert.equal(e.defaultPrevented,false,key);
    }
  }
});

test('remounting is safe, notices do not spam and navigation removes restrictions',()=>{
  const {dom,doc,surface}=fixture();let notices=0;
  mountArticleProtection(surface,{onBlocked:()=>notices++});mountArticleProtection(surface,{onBlocked:()=>notices++});
  const original=surface.innerHTML;
  for(let i=0;i<5;i++)surface.querySelector('p').dispatchEvent(event(dom,'copy'));
  assert.equal(notices,1);assert.equal(surface.innerHTML,original);
  surface.remove();
  for(const type of ['copy','cut','selectstart','contextmenu']){
    const e=event(dom,type);doc.body.dispatchEvent(e);assert.equal(e.defaultPrevented,false,type);
  }
  const all=new dom.window.KeyboardEvent('keydown',{key:'a',ctrlKey:true,bubbles:true,cancelable:true});doc.dispatchEvent(all);assert.equal(all.defaultPrevented,false);
});
