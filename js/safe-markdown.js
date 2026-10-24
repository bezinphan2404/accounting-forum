import createDOMPurify from 'dompurify';
import { Marked, Renderer } from 'marked';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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
  renderer.image = ({text}) => escapeHtml(text);
  const baseTable = Renderer.prototype.table;
  renderer.table = function(token) { return `<div class="table-responsive">${baseTable.call(this, token).replace('<table>', '<table class="forum-table">')}</div>`; };
  const parser = new Marked({renderer, gfm:true, breaks:true});
  const parse = text => parser.parse(text);
  return function renderMarkdown(value) {
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
      ALLOWED_TAGS:['p','br','strong','em','del','code','pre','h1','h2','h3','h4','h5','h6','hr','a','span','div','section','article','header','table','thead','tbody','tr','th','td','ul','ol','li','blockquote'],
      ALLOWED_ATTR:['href','target','rel','class','aria-label','align','start'],
      ALLOW_DATA_ATTR:false,
    });
  };
}
