import {escapeHtml} from './safe-markdown.js';
const previewTypes=new Set(['application/pdf','image/png','image/jpeg']);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function renderAttachments({files=[],hasAttachments=false,viewer=null}={}) {
  if(!viewer) return hasAttachments ? `<section class="thread-attachments card"><h3>Tài liệu dành cho thành viên</h3><p>Đăng ký và đăng nhập để xem hoặc tải tài liệu đính kèm của bài viết.</p><div class="member-access-actions"><button class="btn btn-primary" data-action="member-login">Đăng nhập</button><button class="btn btn-outline" data-action="member-register">Đăng ký thành viên</button></div></section>` : '';
  if(!files.length)return '';
  return `<section class="thread-attachments card"><h3>Tài liệu đính kèm</h3>${files.filter(f=>UUID.test(f.id)).map(f=>`<div class="attachment-item"><strong>${escapeHtml(f.filename)}</strong><p>${Math.ceil(f.byte_size/1024)} KB · ${escapeHtml(f.license_text)}</p>${/^https:\/\//.test(f.source_url || '')?`<p><a href="${escapeHtml(f.source_url)}" target="_blank" rel="noopener noreferrer">Nguồn của tài liệu</a></p>`:''}<div class="attachment-actions">${previewTypes.has(f.mime_type)?`<button class="btn btn-outline" data-action="attachment-view" data-id="${f.id}">Xem tài liệu</button>`:''}<button class="btn btn-primary" data-action="attachment-download" data-id="${f.id}">Tải tài liệu</button></div></div>`).join('')}</section>`;
}
export async function openAttachment(button,{downloadAttachment,getViewer,showToast,preview=false}) {
  const viewer=getViewer();if(!viewer){showToast('Vui lòng đăng nhập để xem hoặc tải tài liệu.','info');return;}
  const id=button.dataset.id;if(!UUID.test(id) || button.disabled)return;
  // Reserve a tab in the trusted user click; never publish a storage/signed URL.
  const popup=preview ? window.open('about:blank','_blank') : null;
  if(preview && !popup){showToast('Cho phép mở tab mới để xem tài liệu hoặc dùng nút Tải tài liệu.','info');return;}
  if(popup)popup.opener=null;
  button.disabled=true;
  try {
    const file=await downloadAttachment(id);
    if(getViewer()?.id!==viewer.id)throw Error('Phiên đăng nhập đã thay đổi. Vui lòng thử lại.');
    if(preview && !previewTypes.has(file.mimeType))throw Error('Tệp này cần tải về để mở.');
    const blob=new Blob([file.blob],{type:file.mimeType});
    const url=URL.createObjectURL(blob);
    if(popup)popup.location.replace(url);
    else {const a=document.createElement('a');a.href=url;a.download=file.filename.replace(/[\\/\u0000-\u001f]/g,'_');a.click();}
    const timer=setTimeout(()=>URL.revokeObjectURL(url),60000);timer?.unref?.();
  }catch(error){popup?.close();showToast(error.message || 'Chưa tải được tài liệu. Vui lòng thử lại.','error');}
  finally {button.disabled=false;}
}
