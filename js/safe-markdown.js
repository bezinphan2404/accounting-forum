import createDOMPurify from 'dompurify';
import { Marked, Renderer } from 'marked';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function expandArticleReferences(value) {
  const refs=new Map();
  const text=String(value ?? '').replace(/\r\n/g,'\n').replace(/^:::references\n([\s\S]*?)\n:::endreferences\s*$/gm,(block,lines)=>{
    const pending=[];
    for(const line of lines.split('\n')){
      const match=/^([a-z][a-z0-9-]{0,39}) (https:\/\/\S+)$/.exec(line.trim());
      if(!match)return block;
      try{const url=new URL(match[2]);if(url.protocol!=='https:' || url.username || url.password)return block;pending.push([match[1],url.href]);}catch{return block;}
    }
    for(const [id,url] of pending)refs.set(id,url);
    return '';
  });
  return text.replace(/\]\(bzref:([a-z][a-z0-9-]{0,39})(#[a-z0-9=,&._%-]+)?\)/gi,(full,id,fragment)=>refs.has(id)?']('+refs.get(id).split('#')[0]+(fragment || '')+')':']()');
}

export function splitArticleTabs(value) {
  const match=/(?:^|\n):::tabs\n([\s\S]*?)\n:::endtabs(?:\n|$)/.exec(value);
  if(!match)return null;
  const raw=match[1].split(/^:::tab /m);
  if(raw[0].trim() || raw.length<2 || raw.length>31)return null;
  const parts=raw.slice(1).map(part=>{const at=part.indexOf('\n');return {title:part.slice(0,at).trim(),body:part.slice(at+1).trim()};});
  if(parts.some(p=>!p.title || p.title.length>250 || !p.body || /^:::tabs$/m.test(p.body)))return null;
  return {before:value.slice(0,match.index),parts,after:value.slice(match.index+match[0].length)};
}

export function articleExcerpt(value) {
  return expandArticleReferences(value).replace(/^:::(?:tabs|tab .*|endtabs)\s*$/gm,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[*#`]/g,'').replace(/\s+/g,' ').trim().slice(0,150);
}

export function mountArticleTabs(surface,{initialPart=1,onSelect=()=>{}}={}) {
  if(!surface)return;
  for(const widget of surface.querySelectorAll('.article-tabbed')){
    const tabs=[...widget.querySelectorAll('[role=tab]')];
    const panels=[...widget.querySelectorAll('[role=tabpanel]')];
    if(!tabs.length || tabs.length!==panels.length)continue;
    let active=0;
    const choose=(index,{focus=false,announce=true}={})=>{
      active=Math.max(0,Math.min(index,tabs.length-1));
      tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===active));tab.tabIndex=i===active?0:-1;panels[i].hidden=i!==active;});
      if(focus){tabs[active].focus({preventScroll:true});tabs[active].scrollIntoView?.({block:'nearest',inline:'nearest'});}
      if(announce)onSelect(active+1);
    };
    choose(Number.isInteger(initialPart)?initialPart-1:0,{announce:false});
    widget.addEventListener('click',event=>{const tab=event.target.closest('[role=tab]');const step=event.target.closest('[data-tab-step]');if(tab && tabs.includes(tab))choose(tabs.indexOf(tab));else if(step && widget.contains(step))choose(active+Number(step.dataset.tabStep),{focus:true});});
    widget.addEventListener('keydown',event=>{if(!tabs.includes(event.target))return;const next=event.key==='ArrowRight'?(active+1)%tabs.length:event.key==='ArrowLeft'?(active+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;if(next!==null){event.preventDefault();choose(next,{focus:true});}});
  }
}

export function createMarkdownRenderer(window) {
  const purifier = createDOMPurify(window);
  const renderer = new Renderer();
  renderer.html = ({text}) => /^<br\s*\/?\s*>$/i.test(text.trim()) ? '<br>' : escapeHtml(text);
  renderer.link = function({href, tokens}) {
    const label = this.parser.parseInline(tokens);
    try {
      const url = new URL(href);
      if (url.protocol !== 'https:' || url.username || url.password) return label;
      return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
    } catch { return label; }
  };
  renderer.image = ({href, text}) => {
    // Only reviewed PNG assets hosted by this forum may be embedded.
    const allowed = /^https:\/\/accounting-forum\.vercel\.app\/article-images\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.png$/;
    if (typeof href !== 'string' || !allowed.test(href)) return escapeHtml(text);
    const src = escapeHtml(href);
    const label = escapeHtml(text || 'Biểu mẫu minh họa');
    return `<a class="article-image-link" href="${src}" target="_blank" rel="noopener noreferrer"><img class="article-inline-image" src="${src}" alt="${label}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="article-image-caption">${label} · Xem ảnh lớn ↗</span></a>`;
  };
  const baseTable = Renderer.prototype.table;
  renderer.table = function(token) { return `<div class="table-responsive">${baseTable.call(this, token).replace('<table>', '<table class="forum-table">')}</div>`; };
  const parser = new Marked({renderer, gfm:true, breaks:true});
  const parse = text => parser.parse(text);
  let tabSerial=0;
  function renderOrdinary(value) {
    const text = String(value ?? '');
    let html = '', start = 0;
    // Render fragments directly: no user-collidable HTML placeholders.
    for (const match of text.matchAll(/:::columns\s*\n([\s\S]*?)\n:::endcolumns/g)) {
      html += parse(text.slice(start, match.index));
      const columns = match[1].split(/^### /m).filter(s=>s.trim());
      html += '<section class="article-columns" aria-label="So sánh theo nhóm">' + columns.map((column,index)=>{
        const [title,...lines] = column.trim().split('\n');
        return `<article class="explain-column explain-column-${index%3}"><header><span class="explain-number">${index+1}</span><h3>${escapeHtml(title)}</h3></header><div class="explain-steps">${lines.join('\n').split(/^#### /m).filter(part=>part.trim()).map(step=>{const [label,...detail]=step.trim().split('\n');return `<section class="explain-step"><h4>${escapeHtml(label)}</h4><div>${parse(detail.join('\n'))}</div></section>`;}).join('')}</div></article>`;
      }).join('') + '</section>';
      start = match.index + match[0].length;
    }
    html += parse(text.slice(start));
    return purifier.sanitize(html, {
      ALLOWED_TAGS:['p','br','strong','em','del','code','pre','h1','h2','h3','h4','h5','h6','hr','a','span','div','section','article','header','table','thead','tbody','tr','th','td','ul','ol','li','blockquote','img'],
      ALLOWED_ATTR:['href','target','rel','class','aria-label','align','start','src','alt','loading','decoding','referrerpolicy'],
      ALLOW_DATA_ATTR:false,
    });
  }
  return function renderMarkdown(value) {
    const text=expandArticleReferences(value);
    const tabs=splitArticleTabs(text);
    if(!tabs)return renderOrdinary(text);
    const id='article-tabs-'+(++tabSerial);
    const buttons=tabs.parts.map((part,i)=>`<button type="button" role="tab" id="${id}-tab-${i}" aria-controls="${id}-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">Phần ${i+1}</button>`).join('');
    const panels=tabs.parts.map((part,i)=>`<section class="article-tab-panel" role="tabpanel" id="${id}-panel-${i}" aria-labelledby="${id}-tab-${i}" tabindex="0" ${i?'hidden':''}><h3 class="article-part-title">${escapeHtml(part.title)}</h3>${renderOrdinary(part.body)}<nav class="article-tab-pager" aria-label="Chuyển phần">${i?'<button type="button" class="btn btn-outline" data-tab-step="-1">← Phần trước</button>':'<span></span>'}<span>Phần ${i+1}/${tabs.parts.length}</span>${i<tabs.parts.length-1?'<button type="button" class="btn btn-outline" data-tab-step="1">Phần tiếp →</button>':'<span></span>'}</nav></section>`).join('');
    return renderOrdinary(tabs.before)+`<div class="article-tabbed"><div class="article-tab-list" role="tablist" aria-label="Các phần trong bài viết">${buttons}</div>${panels}</div>`+renderOrdinary(tabs.after);
  };
}
