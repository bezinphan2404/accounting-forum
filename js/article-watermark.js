// Visual deterrent only: no screenshot blocking, telemetry or persistent storage.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const xml = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const graphemes = value => typeof Intl.Segmenter === 'function'
  ? [...new Intl.Segmenter('vi', {granularity:'grapheme'}).segment(value)].map(part => part.segment)
  : Array.from(value);

function nameLines(name) {
  const lines = [];
  let line = '';
  for (const word of name.split(' ')) {
    if (line && graphemes(line + ' ' + word).length > 30) { lines.push(line); line = ''; }
    const letters = graphemes(word);
    while (letters.length > 30) { lines.push(letters.splice(0,30).join('')); }
    if (letters.length) line += (line ? ' ' : '') + letters.join('');
  }
  if (line) lines.push(line);
  return lines;
}

export function watermarkForViewer(viewer, at = new Date()) {
  if (!UUID.test(viewer?.id || '') || !(at instanceof Date) || Number.isNaN(at.getTime())) return null;
  const normalized = typeof viewer.name === 'string' ? viewer.name.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f]/g,' ').replace(/\s+/gu,' ').trim() : '';
  const memberName = Array.from(normalized).slice(0,100).join('') || 'Thành viên';
  const lines = nameLines(memberName);
  const height = Math.max(170, 132 + lines.length * 18);
  const brandY = 65 + (height - 170) / 2 - (lines.length - 1) * 9;
  const nameText = lines.map((line,index) => `<text x="160" y="${brandY + 21 + index * 18}" font-size="13" font-weight="600" textLength="${Math.min(250,graphemes(line).length * 7.2).toFixed(1)}" lengthAdjust="spacingAndGlyphs">${xml(line)}</text>`).join('');
  const parts = new Intl.DateTimeFormat('vi-VN', {
    timeZone:'Asia/Ho_Chi_Minh', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hourCycle:'h23',
  }).formatToParts(at);
  const field = type => parts.find(part => part.type === type).value;
  const timeLabel = `${field('day')}/${field('month')}/${field('year')} ${field('hour')}:${field('minute')} (UTC+7)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="${height}" viewBox="0 0 320 ${height}"><g transform="rotate(-18 160 ${height / 2})" fill="#1d3557" fill-opacity="0.13" text-anchor="middle" font-family="Arial,sans-serif"><text x="160" y="${brandY}" font-size="17" font-weight="700">BZ Forum</text>${nameText}<text x="160" y="${brandY + 21 + lines.length * 18 + 2}" font-size="12">${xml(timeLabel)}</text></g></svg>`;
  return {memberName, timeLabel, backgroundSize:`320px ${height}px`, image:`url("data:image/svg+xml,${encodeURIComponent(svg)}")`};
}

export function mountArticleWatermark(surface, viewer, at = new Date()) {
  if (!surface) return false;
  surface.querySelector(':scope > .article-watermark')?.remove();
  surface.classList.remove('article-watermark-surface');
  const mark = watermarkForViewer(viewer, at);
  if (!mark) return false;
  const overlay = surface.ownerDocument.createElement('div');
  overlay.className = 'article-watermark';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.dataset.memberName = mark.memberName;
  overlay.dataset.viewedAt = mark.timeLabel;
  overlay.style.backgroundImage = mark.image;
  overlay.style.backgroundSize = mark.backgroundSize;
  surface.classList.add('article-watermark-surface');
  surface.append(overlay);
  return true;
}
