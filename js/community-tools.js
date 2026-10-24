import {escapeHtml} from './safe-markdown.js';

const requests = new WeakMap();
export function renderCommunityToolsShell(logoUrl) {
  return `<aside id="community-tools" class="community-tools" aria-label="Trợ giúp BZ Forum">
  <section id="community-panel" class="community-panel" role="dialog" aria-modal="false" aria-labelledby="community-panel-title" hidden>
    <header class="community-panel-header"><img src="${escapeHtml(logoUrl)}" alt=""><h2 id="community-panel-title">Trợ giúp BZ Forum</h2><button type="button" class="community-close" data-action="community-close" aria-label="Đóng khung trợ giúp">×</button></header><div class="community-panel-body"></div>
  </section>
  <div class="community-launchers"><span class="community-hint">Hỏi AI từ kiến thức diễn đàn ✨</span>
    <button type="button" class="community-ai-launcher" data-action="community-ai" aria-label="Mở trợ lý AI" aria-controls="community-panel" aria-expanded="false"><img src="${escapeHtml(logoUrl)}" alt=""><span>AI</span></button>
    <button type="button" class="community-feedback-launcher" data-action="community-feedback" aria-label="Mở khung góp ý" aria-controls="community-panel" aria-expanded="false"><span aria-hidden="true">💬</span> Góp ý</button>
  </div></aside>`;
}

export function closeCommunityToolsPanel(root, restoreFocus = true) {
  if (!root) return;
  const panel=root.querySelector('.community-panel');
  const kind=panel.dataset.kind;
  panel.hidden=true;
  requests.delete(root);
  root.querySelectorAll('[aria-expanded]').forEach(button=>button.setAttribute('aria-expanded','false'));
  if(restoreFocus) root.querySelector(`[data-action="community-${kind}"]`)?.focus({preventScroll:true});
}

export async function openCommunityToolsPanel(root, {kind,viewer,getViewer,api,renderMarkdown}) {
  if (!root || !viewer?.id || !['ai','feedback'].includes(kind)) return;
  const panel=root.querySelector('.community-panel');
  if (!panel.hidden && panel.dataset.kind===kind) {closeCommunityToolsPanel(root);return;}
  const state={viewerId:viewer.id,request:0,ready:false,busy:false};
  requests.set(root,state);
  const current=()=>root.isConnected && requests.get(root)===state && getViewer()?.id===state.viewerId;
  const body=root.querySelector('.community-panel-body');
  panel.dataset.kind=kind;
  panel.hidden=false;
  root.querySelector('#community-panel-title').textContent=kind==='ai'?'Trợ lý AI của BZ Forum':'Góp ý cho diễn đàn';
  root.querySelectorAll('[aria-expanded]').forEach(button=>button.setAttribute('aria-expanded',String(button.dataset.action===`community-${kind}`)));
  if(kind==='feedback') {
    body.innerHTML=`<p class="community-intro">Đề xuất tính năng, báo lỗi hoặc góp ý nội dung.</p><p class="community-note">Góp ý và phản hồi được các thành viên đã đăng nhập cùng xem. Không đưa thông tin riêng tư.</p>
    <form class="community-form"><label for="community-kind">Loại góp ý</label><select id="community-kind" name="kind" class="form-select"><option value="idea">Đề xuất tính năng</option><option value="bug">Báo lỗi</option><option value="content">Góp ý nội dung</option></select>
    <label for="community-title">Tiêu đề</label><input id="community-title" name="title" class="form-input" required maxlength="150" placeholder="Bạn muốn cải thiện điều gì?">
    <label for="community-feedback-content">Nội dung</label><textarea id="community-feedback-content" name="content" class="form-textarea" required maxlength="4000" placeholder="Mô tả ý tưởng hoặc các bước gặp lỗi…"></textarea>
    <button type="submit" class="btn btn-primary">Gửi góp ý</button><p class="community-message" role="status" aria-live="polite"></p></form><a class="community-more" href="#/feedback">Xem góp ý và phản hồi →</a>`;
    const form=body.querySelector('form');const button=form.querySelector('[type="submit"]');const message=form.querySelector('[role="status"]');
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!current() || state.busy)return;
      const payload={kind:form.elements.kind.value,title:form.elements.title.value.trim(),content:form.elements.content.value.trim()};
      if(!payload.title || !payload.content || payload.title.length>150 || payload.content.length>4000) {message.textContent='Nhập tiêu đề tối đa 150 ký tự và nội dung tối đa 4.000 ký tự.';return;}
      state.busy=true;button.disabled=true;message.textContent='Đang gửi góp ý…';
      try {await api.createFeedback(payload);if(current()){form.reset();message.textContent='Đã gửi góp ý. Bạn có thể xem phản hồi tại trang Góp ý.';}}
      catch(error){if(current())message.textContent=error.message || 'Chưa gửi được góp ý. Vui lòng thử lại.';}
      finally{state.busy=false;if(current())button.disabled=false;}
    });
    form.elements.title.focus({preventScroll:true});
    return;
  }
  body.innerHTML=`<p class="community-intro">Hỏi về kiến thức diễn đàn. Câu trả lời kèm bài viết để đối chiếu.</p><p class="community-availability" role="status">Đang kiểm tra trợ lý…</p>
  <form class="community-form"><label for="community-question">Câu hỏi hoặc từ khóa</label><textarea id="community-question" name="prompt" class="form-textarea" required maxlength="3000" placeholder="Đặt câu hỏi về nội dung diễn đàn…"></textarea>
  <p class="community-note">Enter để gửi, Shift+Enter để xuống dòng.</p><details class="community-data" hidden><summary>Dữ liệu gửi AI</summary><p>Câu hỏi và trích đoạn bài liên quan được gửi tới Google Gemini. Gói miễn phí có thể dùng nội dung để cải thiện sản phẩm. Không nhập dữ liệu cá nhân, công ty hoặc tài liệu nội bộ. <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Điều khoản dịch vụ</a>.</p></details>
  <label class="community-consent" hidden><input type="checkbox" name="consent"> Nội dung này phù hợp gửi tới dịch vụ AI miễn phí.</label>
  <div class="community-actions"><button type="button" class="btn btn-outline" data-tool="search">Tìm bài liên quan</button><button type="submit" class="btn btn-primary" disabled>Hỏi AI</button></div>
  <p class="community-message" role="status" aria-live="polite"></p></form><div class="community-result" aria-live="polite"></div><a class="community-more" href="#/ai">Mở trang trợ lý đầy đủ →</a>`;
  const form=body.querySelector('form');const prompt=form.elements.prompt;const submit=form.querySelector('[type="submit"]');const search=form.querySelector('[data-tool="search"]');const message=form.querySelector('.community-message');const result=body.querySelector('.community-result');
  const sources=rows=>(rows || []).length?`<section class="ai-sources"><h3>Bài viết để đối chiếu</h3><ul>${rows.map(row=>`<li><a href="#/thread/${escapeHtml(String(row.id))}">${escapeHtml(String(row.title))}</a></li>`).join('')}</ul></section>`:'';
  const question=()=>{const value=prompt.value.trim();if(!value || value.length>3000){message.textContent='Nhập câu hỏi hoặc từ khóa tối đa 3.000 ký tự.';return null;}return value;};
  const run=async action=>{
    if(!current() || state.busy)return;
    const value=question();if(!value)return;
    if(action==='ask' && !state.ready){message.textContent='AI đang chờ kết nối. Bạn vẫn có thể tìm bài liên quan.';return;}
    if(action==='ask' && !form.elements.consent.checked){message.textContent='Hãy xác nhận nội dung phù hợp trước khi gửi AI.';return;}
    const request=++state.request;
    state.busy=true;submit.disabled=true;search.disabled=true;message.textContent=action==='ask'?'AI đang đọc các nguồn liên quan…':'Đang tìm bài liên quan…';
    try {
      if(action==='search'){
        const rows=await api.findAIArticles(value);if(!current() || request!==state.request)return;
        result.innerHTML=sources(rows);message.textContent=rows.length?'Đã tìm thấy bài để đối chiếu.':'Chưa tìm thấy bài phù hợp. Thử từ khóa ngắn hơn.';
      } else {
        const answer=await api.askAI({mode:'ask',prompt:value,consent:true});if(!current() || request!==state.request)return;
        result.innerHTML=`<div class="content-body">${renderMarkdown(answer.answer || '')}</div>${sources(answer.sources)}<p class="community-note">Đối chiếu nguồn và thời điểm áp dụng trước khi dùng cho hồ sơ thực tế.</p>`;message.textContent='';
      }
    }catch(error){if(current())message.textContent=error.message || 'Chưa kết nối được. Vui lòng thử lại.';}
    finally{state.busy=false;if(current()){submit.disabled=!state.ready;search.disabled=false;}}
  };
  form.addEventListener('submit',event=>{event.preventDefault();void run('ask');});
  search.addEventListener('click',()=>void run('search'));
  prompt.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();void run('ask');}});
  prompt.focus({preventScroll:true});
  try {const status=await api.getAIStatus();if(!current())return;state.ready=!!status.ready;submit.disabled=!state.ready || state.busy;body.querySelector('.community-data').hidden=!state.ready;body.querySelector('.community-consent').hidden=!state.ready;body.querySelector('.community-availability').textContent=state.ready?'AI trả lời từ nguồn bài diễn đàn.':'AI đang chờ kết nối. Bạn vẫn có thể tìm bài liên quan.';}
  catch {if(current())body.querySelector('.community-availability').textContent='Chưa kết nối được AI. Bạn vẫn có thể tìm bài liên quan.';}
}
