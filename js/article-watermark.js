// Visual deterrent only: no screenshot blocking, telemetry or persistent storage.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const xml = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

export function watermarkForViewer(viewer, at = new Date()) {
  if (!UUID.test(viewer?.id || '') || !(at instanceof Date) || Number.isNaN(at.getTime())) return null;
  const memberCode = 'TV-' + viewer.id.replaceAll('-', '').slice(0, 12).toUpperCase();
  const parts = new Intl.DateTimeFormat('vi-VN', {
    timeZone:'Asia/Ho_Chi_Minh', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hourCycle:'h23',
  }).formatToParts(at);
  const field = type => parts.find(part => part.type === type).value;
  const timeLabel = `${field('day')}/${field('month')}/${field('year')} ${field('hour')}:${field('minute')} (UTC+7)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="170" viewBox="0 0 320 170"><g transform="rotate(-18 160 85)" fill="#1d3557" fill-opacity="0.13" text-anchor="middle" font-family="Arial,sans-serif"><text x="160" y="65" font-size="17" font-weight="700">BZ Forum</text><text x="160" y="86" font-size="13" font-weight="600">${xml(memberCode)}</text><text x="160" y="106" font-size="12">${xml(timeLabel)}</text></g></svg>`;
  return {memberCode, timeLabel, image:`url("data:image/svg+xml,${encodeURIComponent(svg)}")`};
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
  overlay.dataset.memberCode = mark.memberCode;
  overlay.dataset.viewedAt = mark.timeLabel;
  overlay.style.backgroundImage = mark.image;
  surface.classList.add('article-watermark-surface');
  surface.append(overlay);
  return true;
}
