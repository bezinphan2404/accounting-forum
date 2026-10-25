// A client-side deterrent for ordinary copying, not DRM or screenshot protection.
// No clipboard reads/writes, telemetry, storage or network requests.
const installed = new WeakMap();
const editableSelector = 'input,textarea,select,[contenteditable=""],[contenteditable="true"]';
const asElement = node => node?.nodeType === 1 ? node : node?.parentElement;

function installForDocument(doc) {
  if (installed.has(doc)) return installed.get(doc);
  const state = {onBlocked:()=>{}, lastNotice:-Infinity};
  const surface = () => doc.querySelector('.thread-detail-content.article-copy-protected');
  const isEditable = event => Boolean(asElement(event.target)?.closest(editableSelector) || doc.activeElement?.closest(editableSelector));
  const inside = (node, area) => Boolean(node && (node === area || area.contains(node)));
  const selected = area => {
    const selection = doc.getSelection?.();
    if (!selection || selection.isCollapsed) return false;
    for (let i=0;i<selection.rangeCount;i++) {
      if (selection.getRangeAt(i).intersectsNode(area)) return true;
    }
    return false;
  };
  const block = event => {
    event.preventDefault();
    if (Date.now()-state.lastNotice>=3000) {
      state.lastNotice=Date.now();
      state.onBlocked();
    }
  };
  const copy = event => {
    const area=surface();
    if (area && !isEditable(event) && (inside(event.target,area) || selected(area))) block(event);
  };
  const selectOrDrag = event => {
    const area=surface();
    if (area && !isEditable(event) && inside(event.target,area)) block(event);
  };
  const context = event => {
    const area=surface();
    // Sources and form links still have the normal link menu and open normally.
    if (area && !isEditable(event) && inside(event.target,area) && !asElement(event.target)?.closest('a[href]')) block(event);
  };
  const keydown = event => {
    const area=surface();
    if (!area || isEditable(event) || event.altKey || !(event.ctrlKey || event.metaKey)) return;
    const key=event.key.toLowerCase();
    if (key==='a') {
      doc.getSelection?.()?.removeAllRanges();
      block(event);
    } else if (['c','x','insert'].includes(key) && !event.shiftKey && (inside(event.target,area) || selected(area))) block(event);
  };
  for(const type of ['copy','cut'])doc.addEventListener(type,copy,true);
  for(const type of ['selectstart','dragstart'])doc.addEventListener(type,selectOrDrag,true);
  doc.addEventListener('contextmenu',context,true);
  doc.addEventListener('keydown',keydown,true);
  installed.set(doc,state);
  return state;
}

export function mountArticleProtection(surface, {viewer=null,onBlocked=()=>{}}={}) {
  if (!surface) return false;
  // The caller supplies the current profile/role verified by the existing data layer.
  // Removing the class also disables installed document listeners on this reading surface.
  surface.classList.remove('article-copy-protected');
  if (viewer?.role==='admin') return false;
  surface.classList.add('article-copy-protected');
  installForDocument(surface.ownerDocument).onBlocked=onBlocked;
  return true;
}
