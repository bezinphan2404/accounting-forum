import logoUrl from '../assets/logo.svg';
// ====================================
// BZ Accounting Forum – Main Application
// SPA with hash-based routing
// ====================================

// ===== SVG Icons (inline) =====
const ICONS = {
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  comment: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  back: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
  pin: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16 2L14.5 3.5L18.5 7.5L20 6V2H16Z M12.5 5.5L7 11L9 13L4 18V20H6L11 15L13 17L18.5 11.5L12.5 5.5Z"/></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  logout: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
};

import { getDB, getCategories, getCategoryById, getThreadCountByCategory, getUsers, getUserById, createUser, authenticateUser, getThreads, getThreadById, createThread, incrementViews, toggleLike, getReplies, createReply, getReplyCount, getStats } from './remote-data.js';
import { refreshData, getCurrentUser, clearForumData, signInWithGoogle, signOut, updateThread, updateReply, isPasswordRecovery, authCallbackError, sendPasswordReset, completePasswordReset, loadThreadPage, loadThreadDetail, loadAdminReplies, loadProfile, getPageInfo, loadFeedbackPage, getFeedbackPage, createFeedback, updateFeedback, getAIStatus, askAI, findAIArticles } from './remote-data.js';
let currentUser = null;
let aiRequestNumber=0;let aiMode='ask';let aiStatus={ready:false};let aiResult=null;let aiRelated=[];let aiPrompt='';

function setCurrentUser(user) {
  currentUser = user;
  sessionStorage.removeItem('bz_current_user');
}

// ===== Toast =====
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// ===== Time helpers =====
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ===== Render helpers =====
import {escapeHtml, createMarkdownRenderer} from './safe-markdown.js';
const renderMarkdown=createMarkdownRenderer(window);

// ===== Router =====
let currentSort = 'newest';

function getRoute() {
  const hash = window.location.hash || '#/';
  return hash;
}

function navigate(hash) {
  window.location.hash = hash;
}

let routeVersion=0;
let listOffset=0;
let previousRoute='';
const publicRoutes=new Set(['#/login','#/register','#/forgot-password','#/reset-password']);
function rememberDestination(hash) {
  if(/^#\/(?:$|(?:category|thread|profile|edit)\/[a-z0-9-]+$|new-thread$|admin$|ai$|feedback$|search\?q=)/i.test(hash) && hash.length<=500)sessionStorage.setItem('bz_return_to',hash);
}
function loginDestination() {
  const saved=sessionStorage.getItem('bz_return_to');sessionStorage.removeItem('bz_return_to');
  return saved && /^#\//.test(saved) && !publicRoutes.has(saved)?saved:'#/';
}
function showMemberLogin() {
  if(!publicRoutes.has(getRoute()))rememberDestination(getRoute());
  history.replaceState(null,'',location.pathname+'#/login');renderLogin();
}
async function router() {
  const hash = getRoute();
  const version=++routeVersion;
  if(hash!==previousRoute){listOffset=0;previousRoute=hash;}
  try {
    if(!publicRoutes.has(hash)) {
      if(!currentUser){showMemberLogin();return;}
      document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><p role="status">Đang tải nội dung...</p></main>`;
      const user=await getCurrentUser();
      if(version!==routeVersion)return;
      setCurrentUser(user);
      if(!user){clearForumData();showMemberLogin();return;}
      await refreshData();
      if(version!==routeVersion)return;
    }
    if(hash.startsWith('#/thread/') || hash.startsWith('#/edit/')) {
      const id=hash.split('/')[2];if(!/^[0-9a-f-]{36}$/i.test(id))throw Error('Đường dẫn không hợp lệ.');
      await loadThreadDetail(id);
    } else if(hash.startsWith('#/profile/')) {
      const id=hash.split('/')[2];if(!/^[0-9a-f-]{36}$/i.test(id))throw Error('Đường dẫn không hợp lệ.');
      await loadThreadPage({authorId:id,offset:listOffset});await loadProfile(id);
    } else if(hash==='#/feedback') {
      await loadFeedbackPage(listOffset);
    } else if(hash==='#/ai') {
      aiStatus=await getAIStatus();
    } else if(hash==='#/admin') {
      if(currentUser?.role!=='admin'){navigate('#/');return;}
      await loadThreadPage({offset:listOffset});await loadAdminReplies();
    } else if(hash==='#/' || hash.startsWith('#/category/') || hash.startsWith('#/search')) {
      await loadThreadPage({categoryId:hash.startsWith('#/category/')?hash.split('/')[2]:null,search:hash.startsWith('#/search')?new URLSearchParams(hash.split('?')[1] || '').get('q'):null,sortBy:currentSort,offset:listOffset});
    }
  }catch(error){
    if(version!==routeVersion)return;
    if(error.code==='AUTH_REQUIRED' || error.status===401 || error.code==='PGRST301') {
      clearForumData();setCurrentUser(null);showMemberLogin();
    } else {
      document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-card card"><p role="alert">${escapeHtml(friendlyError(error))}</p><button class="btn btn-outline" data-action="retry">Thử lại</button></div></main>${renderFooter()}`;
    }
    return;
  }
  if(version!==routeVersion)return;
  const app = document.getElementById('app');

  if (hash === '#/' || hash === '') {
    renderHome();
  } else if (hash.startsWith('#/category/')) {
    const catId = hash.replace('#/category/', '');
    renderHome(catId);
  } else if (hash.startsWith('#/thread/')) {
    const threadId = hash.replace('#/thread/', '');
    renderThread(threadId);
  } else if (hash === '#/feedback') {
    renderFeedback();
  } else if (hash === '#/ai') {
    renderAI();
  } else if (hash === '#/admin') {
    renderAdmin();
  } else if (hash.startsWith('#/edit/')) {
    renderEditThread(hash.replace('#/edit/', ''));
  } else if (hash === '#/new-thread') {
    renderNewThread();
  } else if (hash === '#/forgot-password') {
    renderForgotPassword();
  } else if (hash === '#/reset-password') {
    renderResetPassword();
  } else if (hash === '#/login') {
    renderLogin();
  } else if (hash === '#/register') {
    renderRegister();
  } else if (hash.startsWith('#/search')) {
    const params = new URLSearchParams(hash.split('?')[1] || '');
    renderSearch(params.get('q') || '');
  } else if (hash.startsWith('#/profile/')) {
    const userId = hash.replace('#/profile/', '');
    renderProfile(userId);
  } else {
    renderHome();
  }
}

window.addEventListener('hashchange', ()=>{if(initialized)void router();});

// ===== Header =====
function renderHeader() {
  const searchVal = getRoute().startsWith('#/search')
    ? new URLSearchParams(getRoute().split('?')[1] || '').get('q') || ''
    : '';

  return `
    <header class="header">
      <div class="header-inner">
        <a class="header-logo" data-route="#/">
          <img src="${logoUrl}" alt="BZ Logo">
          <div class="header-logo-text">
            <span class="header-logo-title">BZ Forum</span>
            <span class="header-logo-subtitle">Kế toán Tài chính</span>
          </div>
        </a>

        ${currentUser ? `<div class="search-container">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" class="search-input" id="search-input"
                 placeholder="Tìm kiếm bài viết, chủ đề..."
                 value="${escapeHtml(searchVal)}"
                 data-search="true">
        </div>` : ''}

        <div class="header-actions">
          ${currentUser ? renderUserMenu() : renderAuthButtons()}
        </div>
      </div>
    </header>
    ${currentUser ? `<nav class="module-nav" aria-label="Tiện ích diễn đàn"><a href="#/">Kiến thức</a><a href="#/ai" ${getRoute()==='#/ai'?'aria-current="page"':''}>✦ Trợ lý AI</a><a href="#/feedback" ${getRoute()==='#/feedback'?'aria-current="page"':''}>Góp ý</a></nav>` : ''}
  `;
}

function renderAuthButtons() {
  return `
    <button class="btn btn-outline btn-sm" data-route="#/login">Đăng nhập</button>
    <button class="btn btn-primary btn-sm" data-route="#/register">Đăng ký</button>
  `;
}

function renderUserMenu() {
  return `
    <div class="user-menu" id="user-menu" data-action="menu">
      <div class="user-menu-avatar">${escapeHtml(currentUser.avatar)}</div>
      <span class="user-menu-name">${escapeHtml(currentUser.name)} ${currentUser.role === 'admin' ? ' · Admin' : ''}</span>
      ${ICONS.chevronDown}
      <div class="dropdown-menu" id="user-dropdown">
        ${currentUser.role === 'admin' ? `<button class="dropdown-item" data-route="#/admin">Quản trị diễn đàn</button>` : ''}
        <button class="dropdown-item" data-route="#/profile/${escapeHtml(currentUser.id)}">
          ${ICONS.user} Trang cá nhân
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" data-action="logout">
          ${ICONS.logout} Đăng xuất
        </button>
      </div>
    </div>
  `;
}

function toggleDropdown() {
  const dd = document.getElementById('user-dropdown');
  if (dd) dd.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dd = document.getElementById('user-dropdown');
  const menu = document.getElementById('user-menu');
  if (dd && menu && !menu.contains(e.target)) {
    dd.classList.remove('open');
  }
});

// ===== Sidebar =====
function renderSidebar(activeCatId) {
  const categories = sortedCategories();
  return `
    <aside class="sidebar">
      <div class="sidebar-new-thread">
        <button class="btn btn-primary" data-route="${currentUser ? '#/new-thread' : '#/login'}">
          ${ICONS.plus} Tạo bài viết mới
        </button>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Danh mục</div>
        <ul class="category-list">
          <li class="category-item ${!activeCatId ? 'active' : ''}" data-route="#/">
            <span class="category-dot" style="background: var(--color-navy)"></span>
            Tất cả
            <span class="category-count">${getStats().threads}</span>
          </li>
          ${categories.filter(c=>!c.parent_id).map(cat => `
            <li class="category-group">
              <details ${categoryTrail(activeCatId).some(c=>c.id===cat.id)?'open':''}>
                <summary><span class="category-dot" style="background:${escapeHtml(cat.color)}"></span><span>${escapeHtml(cat.name)}</span><span class="category-count">${getThreadCountByCategory(cat.id)}</span></summary>
                <ul class="category-children">
                  <li><a class="category-item ${activeCatId===cat.id?'active':''}" href="#/category/${escapeHtml(cat.id)}">Xem tất cả ${escapeHtml(cat.name)}<span class="category-count">${getThreadCountByCategory(cat.id)}</span></a></li>
                  ${categories.filter(c=>c.parent_id===cat.id).map(child=>`<li><a class="category-item ${activeCatId===child.id?'active':''}" href="#/category/${escapeHtml(child.id)}">${escapeHtml(child.name)}<span class="category-count">${getThreadCountByCategory(child.id)}</span></a></li>`).join('')}
                </ul>
              </details>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="sidebar-section card" style="padding: var(--space-md);">
        <div class="sidebar-title" style="padding:0; margin-bottom: var(--space-sm);">Thống kê</div>
        <div style="font-size:0.85rem; color: var(--color-text-light); display:flex; flex-direction:column; gap:0.3rem;">
          <div>📝 ${getStats().threads} bài viết</div>
          <div>💬 ${getStats().replies} bình luận</div>
          <div>👥 ${getStats().users} thành viên</div>
        </div>
      </div>
    </aside>
  `;
}

function sortedCategories() {
  return [...getCategories()].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0) || a.id.localeCompare(b.id));
}
function categoryTrail(id) {
  const trail=[];const seen=new Set();let cat=getCategoryById(id);
  while(cat && !seen.has(cat.id)){seen.add(cat.id);trail.unshift(cat);cat=getCategoryById(cat.parent_id);}
  return trail;
}
function renderCategoryTrail(id) {
  return categoryTrail(id).map(c=>`<a href="#/category/${escapeHtml(c.id)}">${escapeHtml(c.icon+' '+c.name)}</a><span class="breadcrumb-sep">›</span>`).join('');
}
function renderCategoryOptions(selected='') {
  const categories=sortedCategories();
  return categories.filter(c=>!c.parent_id).map(root=>`<optgroup label="${escapeHtml(root.name)}">${[root,...categories.filter(c=>c.parent_id===root.id)].map(c=>`<option value="${escapeHtml(c.id)}" ${c.id===selected?'selected':''}>${escapeHtml(c.name)}${c.id===root.id?' (chung)':''}</option>`).join('')}</optgroup>`).join('');
}

// ===== Footer =====
function renderFooter() {
  return `
    <footer class="footer">
      <p>© ${new Date().getFullYear()} <strong>BZ Forum</strong> – Cộng đồng Kế toán Tài chính Việt Nam</p>
      <p style="margin-top:0.3rem;">Được tạo bởi <a href="#">Bezin</a> với ❤️ · <a href="/privacy.html">Chính sách riêng tư</a></p>
    </footer>
  `;
}

// ====================================================================
//  PAGE: HOME
// ====================================================================
function renderHome(categoryId) {
  const threads = getThreads({ categoryId, sortBy: currentSort });
  const category = categoryId ? getCategoryById(categoryId) : null;
  if(categoryId && !category){navigate('#/');return;}
  const stats = getStats();

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout">
      ${renderSidebar(categoryId)}
      <main class="content animate-fadeIn">
        ${!categoryId ? `
          <div class="welcome-banner">
            <h2>👋 Chào mừng đến với BZ Forum!</h2>
            <p>Cộng đồng chia sẻ kiến thức, kinh nghiệm và tài liệu kế toán tài chính.</p>
          </div>
          <div class="stats-bar">
            <div class="stat-card card">
              <div class="stat-value">${stats.threads}</div>
              <div class="stat-label">Bài viết</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${stats.replies}</div>
              <div class="stat-label">Bình luận</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${stats.users}</div>
              <div class="stat-label">Thành viên</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${stats.categories}</div>
              <div class="stat-label">Danh mục</div>
            </div>
          </div>
        ` : `
          <div class="breadcrumb">
            <a data-route="#/">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            ${renderCategoryTrail(categoryId)}
          </div>
        `}

        <div class="content-header">
          <h3 class="content-title">${category ? escapeHtml(category.name) : 'Bài viết mới nhất'}</h3>
          <div class="sort-options">
            <button class="btn btn-sm ${currentSort === 'newest' ? 'btn-secondary' : 'btn-ghost'}" data-action="sort" data-sort="newest">Mới nhất</button>

            <button class="btn btn-sm ${currentSort === 'most-liked' ? 'btn-secondary' : 'btn-ghost'}" data-action="sort" data-sort="most-liked">Yêu thích</button>
          </div>
        </div>

        <div class="thread-list">
          ${category && !category.parent_id ? `<p class="category-hint">Gồm bài trong nhóm này và các chuyên mục con.</p>` : ''}
          ${threads.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
              <div class="empty-state-text">Hãy là người đầu tiên đăng bài trong danh mục này!</div>
              <button class="btn btn-primary" data-route="#/new-thread">Tạo bài viết</button>
            </div>
          ` : threads.map(t => renderThreadCard(t)).join('')}
          ${renderPagination()}
        </div>
      </main>
    </div>
    ${renderFooter()}
  `;
}

function renderThreadCard(thread) {
  const author = getUserById(thread.authorId);
  const category = getCategoryById(thread.categoryId);
  const replyCount = getReplyCount(thread.id);

  return `
    <article class="thread-card card card-elevated ${thread.pinned ? 'thread-pinned' : ''}" data-route="#/thread/${escapeHtml(thread.id)}">
      <div class="thread-card-header">
        <div class="thread-avatar" style="background: ${category ? category.color : 'var(--color-navy)'}">${escapeHtml(author?.avatar || '?')}</div>
        <div class="thread-meta">
          <span class="thread-author">${escapeHtml(author?.name || 'Ẩn danh')}</span>
          ${author?.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : ''}
          ${author?.role === 'moderator' ? '<span class="badge badge-mod">Mod</span>' : ''}
          <span class="thread-time">${timeAgo(thread.createdAt)}</span>
          ${thread.pinned ? `<span style="color:var(--color-peach); font-size:0.8rem; margin-left:0.3rem;">📌 Ghim</span>` : ''}
        </div>
      </div>
      <h3 class="thread-title">${escapeHtml(thread.title)}</h3>
      <p class="thread-excerpt">${escapeHtml(thread.content.substring(0, 150))}...</p>
      <div class="thread-footer">
        ${category ? `<span class="thread-tag" style="background:${escapeHtml(category.color)}">${escapeHtml(category.icon + ' ' + category.name)}</span>` : ''}
        ${thread.tags.slice(0, 3).map(tag => `<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${escapeHtml(tag)}</span>`).join('')}
        <div style="flex:1"></div>
        <span class="thread-stat"></span>
        <span class="thread-stat">${ICONS.heart} ${thread.likes}</span>
        <span class="thread-stat">${ICONS.comment} ${replyCount}</span>
      </div>
    </article>
  `;
}

function changeSort(sort) {
  currentSort = sort;
  listOffset=0;void router();
}

// ====================================================================
//  PAGE: THREAD DETAIL
// ====================================================================
function renderThread(threadId) {
  const thread = getThreadById(threadId);
  if (!thread) { navigate('#/'); return; }

  incrementViews(threadId);
  const author = getUserById(thread.authorId);
  const category = getCategoryById(thread.categoryId);
  const replies = getReplies(threadId);

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout">
      ${renderSidebar(thread.categoryId)}
      <main class="content animate-fadeIn">
        <div class="thread-detail">
          <a class="back-link" data-action="back">${ICONS.back} Quay lại</a>

          <div class="breadcrumb">
            <a data-route="#/">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            ${renderCategoryTrail(thread.categoryId)}
            <span style="color:var(--color-text);">${escapeHtml(thread.title.substring(0, 50))}...</span>
          </div>

          <div class="thread-detail-header">
            ${currentUser && (currentUser.role === 'admin' || currentUser.id === thread.authorId) ? `<button class="btn btn-outline" data-route="#/edit/${escapeHtml(thread.id)}">Sửa bài viết</button>` : ''}
            <h1 class="thread-detail-title">${escapeHtml(thread.title)}</h1>
            <div class="thread-detail-meta">
              <div class="thread-avatar" style="background: ${category?.color || 'var(--color-navy)'}; cursor:pointer;" data-route="#/profile/${escapeHtml(author?.id)}">${escapeHtml(author?.avatar || '?')}</div>
              <div>
                <span class="thread-author" style="cursor:pointer;" data-route="#/profile/${escapeHtml(author?.id)}">${escapeHtml(author?.name || 'Ẩn danh')}</span>
                ${author?.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : ''}
                ${author?.role === 'moderator' ? '<span class="badge badge-mod">Mod</span>' : ''}
                <br><span class="thread-time">${formatDate(thread.createdAt)}</span>
              </div>
              <div style="flex:1"></div>
              <span class="thread-stat">${ICONS.eye} Bài viết cộng đồng</span>
              <button class="vote-btn" data-action="like" data-id="${escapeHtml(thread.id)}">${ICONS.heart} ${thread.likes}</button>
            </div>
          </div>

          <div class="thread-detail-content card card-elevated">
            <div class="content-body">${renderMarkdown(thread.content)}</div>
            <div style="margin-top: var(--space-lg); display:flex; gap:var(--space-sm); flex-wrap:wrap;">
              ${thread.tags.slice(0,10).map(tag => `<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${escapeHtml(tag)}</span>`).join('')}
            </div>
          </div>

          <div class="replies-section">
            <div class="replies-title">${ICONS.comment} ${thread.replyCount} bình luận</div>

            ${replies.map(reply => {
              const rAuthor = getUserById(reply.authorId);
              return `
                <div class="reply-card card">
                  <div class="reply-header">
                    <div class="reply-avatar" style="cursor:pointer;" data-route="#/profile/${escapeHtml(rAuthor?.id)}">${escapeHtml(rAuthor?.avatar || '?')}</div>
                    <span class="reply-author" style="cursor:pointer;" data-route="#/profile/${escapeHtml(rAuthor?.id)}">${escapeHtml(rAuthor?.name || 'Ẩn danh')}</span>
                    ${rAuthor?.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : ''}
                    ${rAuthor?.role === 'moderator' ? '<span class="badge badge-mod">Mod</span>' : ''}
                    <span class="reply-time">${timeAgo(reply.createdAt)}</span>
                  </div>
                  <div class="reply-content">${renderMarkdown(reply.content)}</div>${currentUser?.role==='admin' ? `<form data-submit="handleAdminReply" data-id="${escapeHtml(reply.id)}"><label>Sửa bình luận<textarea class="form-textarea" name="content" required maxlength="10000">${escapeHtml(reply.content)}</textarea></label><button class="btn btn-outline" type="submit">Lưu bình luận</button></form>` : ''}
                </div>
              `;
            }).join('')}

            ${replies.length < thread.replyCount ? `<button class="btn btn-outline" data-action="more-replies" data-id="${escapeHtml(thread.id)}">Xem thêm bình luận</button>` : ''}
            ${currentUser ? `
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md);">
                <h4 style="margin-bottom: var(--space-md); color: var(--color-navy);">Viết bình luận</h4>
                <form data-submit="handleReply" data-id="${escapeHtml(thread.id)}">
                  <textarea class="form-textarea" id="reply-content" placeholder="Nhập nội dung bình luận..." required style="min-height:100px;"></textarea>
                  <div style="margin-top: var(--space-md); text-align:right;">
                    <button type="submit" class="btn btn-primary">Gửi bình luận</button>
                  </div>
                </form>
              </div>
            ` : `
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md); text-align:center;">
                <p style="color: var(--color-text-light); margin-bottom: var(--space-md);">Đăng nhập để tham gia thảo luận</p>
                <button class="btn btn-primary" data-route="#/login">Đăng nhập</button>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>
    ${renderFooter()}
  `;
}

// ====================================================================
//  PAGE: NEW THREAD
// ====================================================================
function renderNewThread() {
  if (!currentUser) { navigate('#/login'); showToast('Vui lòng đăng nhập để đăng bài', 'info'); return; }

  const categories = getCategories();
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout-full">
      <div class="new-thread-form animate-fadeIn">
        <a class="back-link" data-action="back">${ICONS.back} Quay lại</a>
        <div class="form-card card card-elevated">
          <h2 class="form-title">✏️ Tạo bài viết mới</h2>
          <p class="form-subtitle">Chia sẻ kiến thức, kinh nghiệm hoặc đặt câu hỏi</p>

          <form data-submit="handleNewThread">
            <div class="form-group">
              <label class="form-label">Tiêu đề *</label>
              <input type="text" class="form-input" id="thread-title" placeholder="Nhập tiêu đề bài viết..." required maxlength="300">
            </div>

            <div class="form-group">
              <label class="form-label">Danh mục *</label>
              <select class="form-select" id="thread-category" required>
                <option value="">-- Chọn danh mục --</option>
                ${renderCategoryOptions()}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Nội dung *</label>
              <textarea class="form-textarea" id="thread-content" placeholder="Viết nội dung bài viết...\n\nMẹo: Dùng **chữ đậm** và - để tạo danh sách" required maxlength="50000" style="min-height:200px;"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Thẻ tags</label>
              <input type="text" class="form-input" id="thread-tags" maxlength="2048" placeholder="Nhập các tag cách nhau bởi dấu phẩy (VD: thuế, TNCN, hướng dẫn)">
              <small class="form-hint">Tối đa 10 thẻ, mỗi thẻ tối đa 50 ký tự.</small>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" data-action="back">Hủy</button>
              <button type="button" class="btn btn-outline" data-action="preview">Xem trước</button>
              <button type="submit" class="btn btn-primary btn-lg">Đăng bài viết</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ====================================================================
//  PAGE: LOGIN
// ====================================================================
function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout-full">
      <div class="form-container animate-fadeIn">
        <div class="form-card card card-elevated">
          <div style="text-align:center; margin-bottom: var(--space-lg);">
            <img src="${logoUrl}" alt="BZ" style="width:60px; height:60px;">
          </div>
          <h2 class="form-title">Đăng nhập</h2>
          <p class="form-subtitle">Đăng nhập để xem bài viết, chuyên mục và tài liệu BZ Forum.</p>

          <button type="button" class="btn btn-outline btn-lg" style="width:100%;margin-bottom:16px" data-action="google">Tiếp tục với Google</button><p class="form-subtitle">Hoặc đăng nhập bằng email</p><form data-submit="handleLogin">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="login-email" placeholder="email@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-input" id="login-password" placeholder="Nhập mật khẩu" autocomplete="current-password" required>
            </div>
            <p class="form-link"><a href="#/forgot-password">Quên mật khẩu?</a></p>
            <div id="login-error" class="form-error" style="display:none;"></div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">Đăng nhập</button>
            </div>
          </form>

          <div class="form-link">
            Chưa có tài khoản? <a data-route="#/register">Đăng ký ngay</a>
          </div>

        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ====================================================================
//  PAGE: REGISTER
// ====================================================================
function renderRegister() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout-full">
      <div class="form-container animate-fadeIn">
        <div class="form-card card card-elevated">
          <div style="text-align:center; margin-bottom: var(--space-lg);">
            <img src="${logoUrl}" alt="BZ" style="width:60px; height:60px;">
          </div>
          <h2 class="form-title">Đăng ký</h2>
          <p class="form-subtitle">Tham gia cộng đồng kế toán BZ Forum</p>

          <button type="button" class="btn btn-outline btn-lg" style="width:100%;margin-bottom:16px" data-action="google">Tiếp tục với Google</button><p class="form-subtitle">Chọn Google để vào ngay, không cần email xác nhận. Đăng ký bằng email bên dưới có thể tạm hết hạn mức gửi thư.</p><form data-submit="handleRegister">
            <div class="form-group">
              <label class="form-label">Họ tên</label>
              <input type="text" class="form-input" id="reg-name" placeholder="Nhập họ tên" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="reg-email" placeholder="email@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-input" id="reg-password" placeholder="Tối thiểu 8 ký tự" autocomplete="new-password" required minlength="8">
            </div>
            <div class="form-group">
              <label class="form-label">Xác nhận mật khẩu</label>
              <input type="password" class="form-input" id="reg-confirm" placeholder="Nhập lại mật khẩu" required>
            </div>
            <div id="reg-error" class="form-error" style="display:none;"></div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">Đăng ký</button>
            </div>
          </form>

          <div class="form-link">
            Đã có tài khoản? <a data-route="#/login">Đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ====================================================================
//  PAGE: SEARCH
// ====================================================================
function renderSearch(query) {
  const threads = getThreads({ search: query });
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout">
      ${renderSidebar()}
      <main class="content animate-fadeIn">
        <a class="back-link" data-route="#/">${ICONS.back} Quay lại trang chủ</a>
        <div class="content-header">
          <h3 class="content-title">Kết quả tìm kiếm: "${escapeHtml(query)}"</h3>
          <span style="color: var(--color-text-light); font-size:0.9rem;">${threads.length} kết quả</span>
        </div>
        <div class="thread-list">
          ${threads.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">Không tìm thấy kết quả</div>
              <div class="empty-state-text">Thử tìm với từ khóa khác hoặc duyệt theo danh mục</div>
            </div>
          ` : threads.map(t => renderThreadCard(t)).join('')}
          ${renderPagination()}
        </div>
      </main>
    </div>
    ${renderFooter()}
  `;
}

// ====================================================================
//  PAGE: PROFILE
// ====================================================================
function renderProfile(userId) {
  const user = getUserById(userId);
  if (!user) { navigate('#/'); return; }
  const userThreads = getThreads().filter(t => t.authorId === userId);

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="main-layout">
      ${renderSidebar()}
      <main class="content animate-fadeIn">
        <a class="back-link" data-action="back">${ICONS.back} Quay lại</a>

        <div class="profile-header card card-elevated">
          <div class="profile-avatar">${escapeHtml(user.avatar)}</div>
          <div class="profile-info">
            <h2>${escapeHtml(user.name)}
              ${user.role === 'admin' ? '<span class="badge badge-admin" style="margin-left:0.5rem;">Admin</span>' : ''}
              ${user.role === 'moderator' ? '<span class="badge badge-mod" style="margin-left:0.5rem;">Mod</span>' : ''}
            </h2>
            <p>${escapeHtml(user.bio || 'Chưa có giới thiệu')}</p>
            <p style="font-size:0.8rem; color:var(--color-text-lighter); margin-top:0.3rem;">Tham gia: ${formatDate(user.joinDate)}</p>
          </div>
        </div>

        <div class="content-header">
          <h3 class="content-title">Bài viết của ${escapeHtml(user.name)}</h3>
          <span style="color: var(--color-text-light); font-size:0.9rem;">${getPageInfo().total} bài</span>
        </div>

        <div class="thread-list">
          ${userThreads.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
            </div>
          ` : userThreads.map(t => renderThreadCard(t)).join('')}
          ${renderPagination()}
        </div>
      </main>
    </div>
    ${renderFooter()}
  `;
}

// ====================================================================
//  EVENT HANDLERS
// ====================================================================
function handleSearch() {
  const input = document.getElementById('search-input');
  const q = input?.value.trim();
  if (q) navigate('#/search?q=' + encodeURIComponent(q));
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const user = await authenticateUser(email, password);
  if (user) {
    setCurrentUser(user);
    showToast(`Chào mừng ${user.name}! 👋`);
    navigate(loginDestination());
  } else {
    const err = document.getElementById('login-error');
    err.style.display = 'block';
    err.textContent = 'Email hoặc mật khẩu không đúng';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const err = document.getElementById('reg-error');

  if (password !== confirm) {
    err.style.display = 'block';
    err.textContent = 'Mật khẩu xác nhận không khớp';
    return;
  }

  const result = await createUser(name, email, password);
  if (result.error) {
    err.style.display = 'block';
    err.textContent = friendlyError({message:result.error});
    return;
  }

  if (result.confirmationRequired) { showToast('Vui lòng mở email xác nhận tài khoản rồi đăng nhập.', 'info'); navigate('#/login'); return; }
  setCurrentUser(result.user);
  showToast(`Đăng ký thành công! Chào mừng ${result.user.name} 🎉`);
  navigate(loginDestination());
}

async function handleLogout() {
  sessionStorage.removeItem('bz_return_to');
  await signOut();
  setCurrentUser(null);
  showToast('Đã đăng xuất', 'info');
  history.replaceState(null,'',location.pathname+'#/login');renderLogin();
}

async function handleNewThread(e) {
  e.preventDefault();
  const title = document.getElementById('thread-title').value.trim();
  const content = document.getElementById('thread-content').value.trim();
  const categoryId = document.getElementById('thread-category').value;
  const tagsRaw = document.getElementById('thread-tags').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!title || !content || !categoryId) {
    showToast('Vui lòng điền đầy đủ thông tin', 'error');
    return;
  }

  const thread = await createThread({ title, content, categoryId, tags, authorId: currentUser.id });
  showToast('Đăng bài thành công! 🎉');
  navigate('#/thread/' + thread.id);
}

async function handleReply(e, threadId) {
  e.preventDefault();
  const content = document.getElementById('reply-content').value.trim();
  if (!content) { showToast('Vui lòng nhập nội dung bình luận', 'error'); return; }

  await createReply({ threadId, content, authorId: currentUser.id });
  showToast('Bình luận đã được gửi! 💬');
  renderThread(threadId);
}

async function handleLike(threadId) {
  await toggleLike(threadId);
  renderThread(threadId);
}

// ===== INIT =====
let initialized=false;
window.addEventListener('bz-auth-cleared',()=>{
  ++routeVersion;++aiRequestNumber;setCurrentUser(null);aiPrompt='';aiResult=null;aiRelated=[];aiStatus={ready:false};aiMode='ask';
  document.querySelectorAll('.article-preview-dialog').forEach(dialog=>dialog.remove());
  if(initialized) {
    // Keep public recovery/registration pages usable; remove private DOM immediately.
    if(publicRoutes.has(getRoute()))void router();else showMemberLogin();
  }
});
window.addEventListener('bz-auth-changed',()=>{
  if(!initialized)return;
  setTimeout(async()=>{
    try {
      const previousId=currentUser?.id;const user=await getCurrentUser();
      if(!user)return;setCurrentUser(user);
      if(previousId!==user.id){navigate(loginDestination());await router();}
    }catch(error){showToast(friendlyError(error),'error');}
  },0);
});
window.addEventListener('bz-password-recovery',()=>{if(initialized)setTimeout(async()=>{currentUser=await getCurrentUser();history.replaceState(null,'',location.pathname+'#/reset-password');await router();},0);});
document.addEventListener('DOMContentLoaded', async () => {
  try {
    currentUser = await getCurrentUser();
    if(currentUser && getRoute()==='#/login' && !isPasswordRecovery()){history.replaceState(null,'',location.pathname+loginDestination());}
    if (authCallbackError) { history.replaceState(null,'',location.pathname+'#/forgot-password'); renderForgotPassword('Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu liên kết mới.'); }
    else if (isPasswordRecovery()) { history.replaceState(null,'',location.pathname+'#/reset-password'); renderResetPassword(); }
    else {
      if(currentUser && (getRoute()==='#/' || !getRoute().startsWith('#/')) && sessionStorage.getItem('bz_return_to'))history.replaceState(null,'',location.pathname+loginDestination());
      await router();
    }
    initialized=true;
  }
 catch (error) { clearForumData();setCurrentUser(null);initialized=true;renderLogin();showToast(friendlyError(error),'error'); }
});

function renderAdmin() {
 if(currentUser?.role !== 'admin') { navigate('#/'); return; }
 const stats=getStats();
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card"><h1>Quản trị diễn đàn</h1><p>${stats.users} thành viên · ${stats.threads} bài viết · ${stats.replies} bình luận</p><p>Quản trị viên: ${escapeHtml(currentUser.name)}</p><button class="btn btn-primary" data-route="#/new-thread">Tạo bài viết mới</button><h2>Bài viết</h2>${getThreads().map(t=>`<p>${escapeHtml(t.title)} <button class="btn btn-outline" data-route="#/edit/${escapeHtml(t.id)}">Sửa bài viết</button></p>`).join('') || '<p>Chưa có bài viết.</p>'}${renderPagination()}<h2>Bình luận gần đây (tối đa 50)</h2>${getDB().replies.map(reply=>`<form data-submit="handleAdminReply" data-id="${escapeHtml(reply.id)}"><p>${escapeHtml(getThreadById(reply.threadId)?.title || '')}</p><textarea class="form-textarea" name="content" required maxlength="10000">${escapeHtml(reply.content)}</textarea><button class="btn btn-outline" type="submit">Lưu bình luận</button></form>`).join('') || '<p>Chưa có bình luận.</p>'}</div></div></main>${renderFooter()}`;
}
function renderEditThread(id) {
 const t=getThreadById(id);
 if(!t || !currentUser || (currentUser.role!=='admin' && currentUser.id!==t.authorId)) {navigate('#/');return;}
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card"><h1>Sửa bài viết</h1><form data-submit="handleEditThread" data-id="${escapeHtml(t.id)}"><label>Tiêu đề<input class="form-input" name="title" required maxlength="300" value="${escapeHtml(t.title)}"></label><label>Danh mục<select class="form-input" name="category">${renderCategoryOptions(t.categoryId)}</select></label><label>Nội dung<textarea class="form-textarea" name="content" required maxlength="50000">${escapeHtml(t.content)}</textarea></label><button class="btn btn-primary" type="submit">Lưu bài viết</button></form></div></div></main>${renderFooter()}`;
}
async function handleEditThread(event,id) {
 event.preventDefault(); const form=event.target; const button=form.querySelector('button'); button.disabled=true;
 try {await updateThread(id,form.elements.title.value.trim(),form.elements.content.value.trim(),form.elements.category.value);showToast('Đã lưu bài viết');navigate('#/thread/'+id);} catch(e){showToast(e.message,'error');} finally {button.disabled=false;}
}
async function handleAdminReply(event,id) {
 event.preventDefault(); const form=event.target; const button=form.querySelector('button'); button.disabled=true;
 try {await updateReply(id,form.elements.content.value.trim());showToast('Đã lưu bình luận');await router();} catch(e){showToast(e.message,'error');} finally {button.disabled=false;}
}

function friendlyError(error) {
 const message=error?.message || '';
 if(/email not confirmed/i.test(message)) return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư và thư rác.';
 if(/invalid login credentials/i.test(message)) return 'Email hoặc mật khẩu không đúng.';
 if(/email rate limit|over_email_send_rate_limit/i.test(message)) return 'Hệ thống đang hết hạn mức gửi email. Bạn có thể chọn Tiếp tục với Google để vào ngay.';
 if(/rate limit|too many requests/i.test(message)) return 'Bạn đã thử nhiều lần. Vui lòng chờ rồi thử lại.';
 if(/fetch|network|timeout/i.test(message)) return 'Kết nối chưa ổn định. Vui lòng thử lại.';
 return message || 'Không thực hiện được. Vui lòng thử lại.';
}

function previewPost() {
 const content=document.getElementById('thread-content')?.value || '';
 const title=document.getElementById('thread-title')?.value || 'Xem trước bài viết';
 const dialog=document.createElement('dialog'); dialog.className='article-preview-dialog';
 dialog.innerHTML=`<button type="button" class="btn btn-outline preview-close">Đóng xem trước</button><h1>${escapeHtml(title)}</h1><div class="content-body">${renderMarkdown(content)}</div>`;
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>dialog.remove()); document.body.appendChild(dialog); dialog.showModal();
}


function renderForgotPassword(message='') {
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card card-elevated"><h1>Quên mật khẩu</h1><p>Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p><form data-submit="handleForgotPassword"><label class="form-label" for="recovery-email">Email</label><input class="form-input" id="recovery-email" type="email" autocomplete="email" required><p id="recovery-message" role="status">${escapeHtml(message)}</p><button class="btn btn-primary" type="submit">Gửi liên kết đặt lại mật khẩu</button></form><p class="form-link"><a href="#/login">Quay lại đăng nhập</a></p></div></div></main>${renderFooter()}`;
}
function renderResetPassword() {
 if(!currentUser || !isPasswordRecovery() || authCallbackError) {renderForgotPassword('Hãy mở liên kết xác nhận trong email để đặt mật khẩu mới.');return;}
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card card-elevated"><h1>Đặt mật khẩu mới</h1><p>Chọn mật khẩu có ít nhất 8 ký tự.</p><form data-submit="handleResetPassword"><label class="form-label" for="new-password">Mật khẩu mới</label><input class="form-input" id="new-password" type="password" autocomplete="new-password" minlength="8" required><label class="form-label" for="new-password-confirm">Nhập lại mật khẩu mới</label><input class="form-input" id="new-password-confirm" type="password" autocomplete="new-password" minlength="8" required><p id="reset-message" role="alert"></p><button class="btn btn-primary" type="submit">Lưu mật khẩu mới</button></form></div></div></main>${renderFooter()}`;
}
async function handleForgotPassword(event) {
 event.preventDefault();const button=event.target.querySelector('button');if(button.disabled)return;button.disabled=true;
 const box=document.getElementById('recovery-message');box.textContent='Đang gửi yêu cầu...';
 try {await sendPasswordReset(document.getElementById('recovery-email').value.trim());box.textContent='Nếu email đã đăng ký, bạn sẽ nhận được liên kết đặt lại mật khẩu. Hãy kiểm tra cả thư rác và mở liên kết mới nhất.';}
 catch(error){box.textContent=friendlyError(error);}finally{button.disabled=false;}
}
async function handleResetPassword(event) {
 event.preventDefault();const button=event.target.querySelector('button');if(button.disabled)return;
 const password=document.getElementById('new-password').value;const confirm=document.getElementById('new-password-confirm').value;const box=document.getElementById('reset-message');
 if(password.length<8){box.textContent='Mật khẩu cần ít nhất 8 ký tự.';return;}
 if(password!==confirm){box.textContent='Hai mật khẩu chưa khớp.';return;}
 button.disabled=true;
 try {await completePasswordReset(password);setCurrentUser(null);history.replaceState(null,'',location.pathname+'#/login');renderLogin();showToast('Đã đổi mật khẩu. Vui lòng đăng nhập bằng mật khẩu mới.');}
 catch(error){box.textContent=friendlyError(error);}finally{button.disabled=false;}
}

async function handleGoogleLogin(event) {
 const button=event.currentTarget;if(button.disabled)return;button.disabled=true;
 try {await signInWithGoogle();} catch(error){showToast(friendlyError(error),'error');button.disabled=false;}
};
function renderPagination() {
 const {offset,total}=getPageInfo();
 return `<nav aria-label="Phân trang" style="display:flex;gap:12px;margin-top:20px"><button class="btn btn-outline" data-action="previous-page" ${offset===0?'disabled':''}>Trang trước</button><span>Trang ${Math.floor(offset/20)+1} · ${total} bài</span><button class="btn btn-outline" data-action="next-page" ${offset+20>=total?'disabled':''}>Trang sau</button></nav>`;
}

// ===== Member modules =====
const feedbackKinds={idea:'Đề xuất tính năng',bug:'Báo lỗi',content:'Góp ý nội dung'};
const feedbackStatuses={new:'Mới gửi',reviewing:'Đang xem xét',planned:'Dự kiến thực hiện',done:'Đã xử lý',declined:'Chưa thực hiện',hidden:'Đã ẩn'};
function renderFeedback() {
 const {items,total,offset}=getFeedbackPage();
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="module-page"><div class="module-heading"><span class="module-kicker">Cùng xây dựng BZ Forum</span><h1>Góp ý cho diễn đàn</h1><p>Đề xuất tính năng, báo lỗi hoặc góp ý nội dung. Góp ý và phản hồi của admin được các thành viên đã đăng nhập cùng xem.</p></div>
 <section class="card module-card"><h2>Gửi góp ý</h2><form data-submit="handleFeedback"><div class="form-group"><label class="form-label" for="feedback-kind">Loại góp ý</label><select class="form-select" id="feedback-kind">${Object.entries(feedbackKinds).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></div>
 <div class="form-group"><label class="form-label" for="feedback-title">Tiêu đề</label><input class="form-input" id="feedback-title" required maxlength="150" placeholder="Bạn muốn cải thiện điều gì?"></div>
 <div class="form-group"><label class="form-label" for="feedback-content">Nội dung</label><textarea class="form-textarea" id="feedback-content" required maxlength="4000" placeholder="Mô tả rõ ý tưởng hoặc các bước gặp lỗi. Không đưa thông tin riêng tư lên góp ý công khai."></textarea></div><button class="btn btn-primary" type="submit">Gửi góp ý</button></form></section>
 <section aria-label="Các góp ý"><div class="content-header"><h2>${total} góp ý</h2><button class="btn btn-outline btn-sm" data-action="retry">Làm mới</button></div>${items.length?items.map(f=>`<article class="card module-card feedback-card"><div class="feedback-meta"><span>${escapeHtml(feedbackKinds[f.kind] || 'Góp ý')}</span><span class="feedback-status">${escapeHtml(feedbackStatuses[f.status] || f.status)}</span></div><h3>${escapeHtml(f.title)}</h3><p class="feedback-byline">${escapeHtml(f.author_name)} · ${formatDate(f.created_at)}</p><div class="feedback-body">${escapeHtml(f.content)}</div>${f.admin_response?`<div class="admin-response"><strong>Phản hồi từ BZ Forum</strong><p class="feedback-body">${escapeHtml(f.admin_response)}</p></div>`:''}
 ${currentUser?.role==='admin'?`<details class="feedback-admin"><summary>Cập nhật phản hồi</summary><form data-submit="handleFeedbackAdmin" data-id="${escapeHtml(f.id)}"><label class="form-label">Trạng thái<select class="form-select" name="status">${Object.entries(feedbackStatuses).map(([id,name])=>`<option value="${id}" ${id===f.status?'selected':''}>${name}</option>`).join('')}</select></label><label class="form-label">Phản hồi công khai<textarea class="form-textarea" name="response" maxlength="4000">${escapeHtml(f.admin_response)}</textarea></label><button type="submit" class="btn btn-outline">Lưu phản hồi</button></form></details>`:''}</article>`).join(''):'<div class="card module-card empty-state"><h3>Diễn đàn đang lắng nghe</h3><p>Gửi góp ý đầu tiên để cùng cải thiện BZ Forum.</p></div>'}
 <nav class="module-pagination" aria-label="Phân trang góp ý"><button class="btn btn-outline" data-action="previous-page" ${offset===0?'disabled':''}>Trang trước</button><span>Trang ${Math.floor(offset/20)+1}</span><button class="btn btn-outline" data-action="next-page" ${offset+20>=total?'disabled':''}>Trang sau</button></nav></section></main>${renderFooter()}`;
}
async function handleFeedback(event) {
 event.preventDefault();const form=event.target;const button=form.querySelector('button');button.disabled=true;
 const payload={kind:form.querySelector('#feedback-kind').value,title:form.querySelector('#feedback-title').value.trim(),content:form.querySelector('#feedback-content').value.trim()};
 if(!payload.title || !payload.content){button.disabled=false;showToast('Vui lòng nhập tiêu đề và nội dung.','error');return;}
 try{await createFeedback(payload);listOffset=0;if(getRoute()==='#/feedback')renderFeedback();showToast('Đã gửi góp ý. Cảm ơn bạn!');}finally{button.disabled=false;}
}
async function handleFeedbackAdmin(event,id) {
 event.preventDefault();const form=event.target;const button=form.querySelector('button');button.disabled=true;
 try{await updateFeedback(id,form.elements.status.value,form.elements.response.value.trim());if(getRoute()==='#/feedback')renderFeedback();showToast('Đã cập nhật phản hồi.');}finally{button.disabled=false;}
}
function renderAISources(rows) {
 return rows.length?`<section class="ai-sources"><h3>Bài viết để đối chiếu</h3><ul>${rows.map(s=>`<li><a href="#/thread/${escapeHtml(s.id)}">${escapeHtml(s.title)}</a></li>`).join('')}</ul></section>`:'';
}
function renderAI() {
 if(aiMode==='edit' && currentUser?.role!=='admin')aiMode='ask';
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="module-page ai-page"><div class="module-heading"><span class="module-kicker">Có nguồn để kiểm tra</span><h1>Trợ lý AI của BZ Forum</h1><p>Hỏi từ kiến thức đang có trên diễn đàn${currentUser?.role==='admin'?' hoặc cùng AI rà bản nháp trước khi đăng':''}.</p></div>
 <div class="ai-mode-tabs" role="group" aria-label="Chế độ AI"><button class="btn ${aiMode==='ask'?'btn-primary':'btn-outline'}" data-action="ai-mode" data-mode="ask">Hỏi đáp kiến thức</button>${currentUser?.role==='admin'?`<button class="btn ${aiMode==='edit'?'btn-primary':'btn-outline'}" data-action="ai-mode" data-mode="edit">Hỗ trợ biên tập</button>`:''}</div>
 ${!aiStatus.ready?`<div class="ai-notice" role="status"><strong>AI đang chờ kết nối dịch vụ miễn phí.</strong><p>Bạn vẫn có thể tìm bài liên quan ngay bên dưới.${currentUser?.role==='admin'?' Quản trị viên cần tự cấu hình khóa Gemini trên máy chủ để bật trả lời AI.':''}</p></div>`:''}
 <section class="card module-card"><form data-submit="handleAI"><label class="form-label" for="ai-input">${aiMode==='edit'?'Bản nháp và yêu cầu biên tập':'Câu hỏi hoặc từ khóa'}</label><textarea class="form-textarea ai-input" id="ai-input" required maxlength="${aiMode==='edit'?12000:3000}" placeholder="${aiMode==='edit'?'Dán bản nháp kiến thức chung và nêu điều muốn rà: cách diễn đạt, bố cục, các điểm cần kiểm chứng...':'Ví dụ: Thuế GTGT nông sản ở khâu thương mại được xử lý thế nào?'}">${escapeHtml(aiPrompt)}</textarea>
 <p class="ai-data-note">Khi chọn gửi AI, câu hỏi/bản nháp và trích đoạn bài liên quan được gửi tới Google Gemini. <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Gói miễn phí có thể sử dụng nội dung để cải thiện sản phẩm</a>. Không nhập dữ liệu cá nhân, công ty hoặc tài liệu nội bộ.</p>
 <label class="ai-consent"><input type="checkbox" id="ai-consent"> Nội dung này phù hợp gửi tới dịch vụ AI miễn phí.</label><div class="form-actions"><button type="button" class="btn btn-outline" data-action="ai-search">Tìm bài liên quan</button><button type="submit" class="btn btn-primary" ${aiStatus.ready?'':'disabled'}>${aiMode==='edit'?'Nhờ AI rà bản nháp':'Gửi câu hỏi cho AI'}</button></div><p class="ai-data-note">Hạn mức thử nghiệm: ${currentUser?.role==='admin'?10:5} yêu cầu/ngày cho tài khoản này; toàn diễn đàn tối đa 20 yêu cầu/ngày. Hạn mức của dịch vụ miễn phí có thể thấp hơn.</p><p id="ai-message" role="status"></p></form></section>
 ${aiResult?`<section class="card module-card ai-answer"><span class="module-kicker">${aiResult.generated?'Nội dung do AI gợi ý':'Kết quả tra cứu'}</span><div class="content-body">${renderMarkdown(aiResult.answer)}</div>${renderAISources(aiResult.sources || [])}<p class="ai-data-note">${aiMode==='edit'?'Đây là gợi ý biên tập. Zin cần kiểm tra nguồn và duyệt nội dung trước khi đăng.':'Đối chiếu nguồn trong bài và thời điểm áp dụng trước khi dùng cho hồ sơ thực tế.'}</p></section>`:renderAISources(aiRelated)}
 </main>${renderFooter()}`;
}
async function handleAISearch() {
 aiPrompt=document.getElementById('ai-input')?.value.trim() || '';
 if(!aiPrompt){showToast('Nhập câu hỏi hoặc từ khóa để tìm bài.','info');return;}
 const request=++aiRequestNumber;const related=await findAIArticles(aiPrompt);if(request!==aiRequestNumber)return;aiRelated=related;aiResult=null;
 if(getRoute()==='#/ai'){renderAI();if(!aiRelated.length)document.getElementById('ai-message').textContent='Chưa tìm thấy bài phù hợp. Thử từ khóa ngắn hơn hoặc gửi câu hỏi ở Hỏi đáp.';}
}
async function handleAI(event) {
 event.preventDefault();const form=event.target;const message=form.querySelector('#ai-message');
 aiPrompt=form.querySelector('#ai-input').value.trim();
 if(!aiPrompt){message.textContent='Vui lòng nhập nội dung.';return;}
 if(!form.querySelector('#ai-consent').checked){message.textContent='Hãy xác nhận nội dung phù hợp gửi tới dịch vụ AI miễn phí.';return;}
 const request=++aiRequestNumber;const button=form.querySelector('button[type="submit"]');button.disabled=true;message.textContent='AI đang đọc các nguồn liên quan...';
 try{const result=await askAI({mode:aiMode,prompt:aiPrompt,consent:true});if(getRoute()!=='#/ai' || request!==aiRequestNumber)return;aiResult=result;aiRelated=[];renderAI();}
 catch(error){if(getRoute()==='#/ai')message.textContent=friendlyError(error);}finally{button.disabled=false;}
}

const formHandlers={handleLogin,handleRegister,handleNewThread,handleReply,handleEditThread,handleAdminReply,handleForgotPassword,handleResetPassword,handleFeedback,handleFeedbackAdmin,handleAI};
const pending=new WeakSet();
async function perform(element,action) {
 if(pending.has(element))return;
 pending.add(element);
 try{await action();}catch(error){const message=friendlyError(error);const box=document.getElementById(element.dataset.submit==='handleLogin'?'login-error':element.dataset.submit==='handleRegister'?'reg-error':'');if(box){box.style.display='block';box.textContent=message;}showToast(message,'error');}
 finally{pending.delete(element);}
}
document.addEventListener('submit',event=>{
 const form=event.target;if(!Object.hasOwn(formHandlers,form.dataset.submit))return;const handler=formHandlers[form.dataset.submit];
 event.preventDefault();void perform(form,()=>handler(event,form.dataset.id));
});
document.addEventListener('keydown',event=>{if(event.key==='Enter' && event.target.matches('[data-search]')){event.preventDefault();handleSearch();}});
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action],[data-route]');if(!el || el.disabled)return;
 event.preventDefault();
 if(el.dataset.route){navigate(el.dataset.route);return;}
 const actions={'ai-mode':()=>{++aiRequestNumber;aiMode=el.dataset.mode==='edit' && currentUser?.role==='admin'?'edit':'ask';aiPrompt='';aiResult=null;aiRelated=[];renderAI();},'ai-search':handleAISearch,retry:()=>router(),back:()=>history.back(),menu:toggleDropdown,preview:previewPost,logout:handleLogout,google:()=>handleGoogleLogin({currentTarget:el}),sort:()=>changeSort(el.dataset.sort),like:()=>handleLike(el.dataset.id),
 'next-page':()=>{listOffset+=20;return router();},'previous-page':()=>{listOffset=Math.max(0,listOffset-20);return router();},
 'more-replies':async()=>{await loadThreadDetail(el.dataset.id,getReplies(el.dataset.id).length);renderThread(el.dataset.id);}};
 if(Object.hasOwn(actions,el.dataset.action))void perform(el,actions[el.dataset.action]);
});
