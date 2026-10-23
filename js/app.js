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
import { refreshData, getCurrentUser, signOut, updateThread, updateReply, isPasswordRecovery, authCallbackError, sendPasswordReset, completePasswordReset } from './remote-data.js';
let currentUser = null;

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
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function nl2br(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function parseMarkdownTables(text) {
  const tableRegex = /((?:^[ \t]*\|[^\n]+\|[ \t]*(?:\r?\n|$)){2,})/gm;
  return text.replace(tableRegex, (match) => {
    const lines = match.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return match;
    if (!/^\|[\s\-:|]+\|$/.test(lines[1])) return match;

    const parseRow = (line) => {
      const clean = line.replace(/^\|/, '').replace(/\|$/, '');
      return clean.split('|').map(c => c.trim());
    };

    const headers = parseRow(lines[0]);
    const alignments = parseRow(lines[1]).map(col => {
      const left = col.startsWith(':');
      const right = col.endsWith(':');
      if (left && right) return 'center';
      if (right) return 'right';
      return 'left';
    });

    let thead = '<thead><tr>' + headers.map((h, i) => {
      const align = alignments[i] || 'left';
      return `<th style="text-align:${align}">${h}</th>`;
    }).join('') + '</tr></thead>';

    let tbody = '<tbody>';
    for (let r = 2; r < lines.length; r++) {
      const cells = parseRow(lines[r]);
      tbody += '<tr>' + cells.map((cell, i) => {
        const align = alignments[i] || 'left';
        return `<td style="text-align:${align}">${cell}</td>`;
      }).join('') + '</tr>';
    }
    tbody += '</tbody>';

    return `<div class="table-responsive"><table class="forum-table">${thead}${tbody}</table></div>`;
  });
}

function renderMarkdown(text) {
  if (!text) return '';
  const columnBlocks = [];
  text = text.replace(/:::columns\s*\n([\s\S]*?)\n:::endcolumns/g, (_, body) => {
    const columns = body.split(/^### /m).filter(part => part.trim());
    const cards = columns.map((column, index) => {
      const [title, ...lines] = column.trim().split('\n');
      const steps = lines.join('\n').split(/^#### /m).filter(part => part.trim());
      return `<article class="explain-column explain-column-${index % 3}"><header><span class="explain-number">${index + 1}</span><h3>${escapeHtml(title)}</h3></header><div class="explain-steps">${steps.map(step => {
        const [label, ...detail] = step.trim().split('\n');
        return `<section class="explain-step"><h4>${escapeHtml(label)}</h4><div>${renderMarkdown(detail.join('\n'))}</div></section>`;
      }).join('')}</div></article>`;
    }).join('');
    const key = `BZCOLUMNBLOCK${columnBlocks.length}END`;
    columnBlocks.push(`<section class="article-columns" aria-label="So sánh chính sách theo nhóm hàng">${cards}</section>`);
    return key;
  });
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)<>]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');

  // Allow intentional line breaks inside table cells
  html = html.replace(/&lt;br\s*\/?&gt;/gi, '<br>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code style="background:rgba(69,123,157,0.12); color:var(--color-navy); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:0.92em; font-weight:500;">$1</code>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Parse Markdown Tables
  html = parseMarkdownTables(html);

  // Protect HTML table blocks from newline conversions
  const tables = [];
  html = html.replace(/<div class="table-responsive">[\s\S]*?<\/div>/g, (m) => {
    tables.push(m);
    return `__TABLE_PLACEHOLDER_${tables.length - 1}__`;
  });

  // Headings
  html = html.replace(/(?:^|\n)### (.*?)(?=\n|$)/g, '<h3 style="margin-top:1.5rem; margin-bottom:0.75rem; color:var(--color-navy); font-size:1.2rem; font-weight:700; border-bottom:2px solid var(--color-primary); padding-bottom:6px;">$1</h3>');
  html = html.replace(/(?:^|\n)#### (.*?)(?=\n|$)/g, '<h4 style="margin-top:1.2rem; margin-bottom:0.5rem; color:var(--color-text); font-size:1.05rem; font-weight:600;">$1</h4>');

  // Divider
  html = html.replace(/(?:^|\n)---(?=\n|$)/g, '<hr style="margin:1.75rem 0; border:none; border-top:1px dashed var(--color-border); opacity:0.8;">');

  // Bullets
  html = html.replace(/\n- /g, '\n<span style="color:var(--color-primary); font-weight:bold; margin-right:4px;">•</span> ');
  html = html.replace(/\n  \+ /g, '\n&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--color-accent); font-weight:bold;">▸</span> ');
  html = html.replace(/\n    \* /g, '\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▫ ');

  // Newlines outside tables
  html = html.replace(/\n/g, '<br>');

  // Restore Tables
  tables.forEach((tbl, idx) => {
    html = html.replace(`__TABLE_PLACEHOLDER_${idx}__`, () => tbl);
  });

  html = html.replace(/^(<strong>[\s\S]*?<\/strong>)(?:<br>\s*){2}/, '<p class="article-lead">$1</p>');
  columnBlocks.forEach((block, i) => {
    const pattern = new RegExp('(?:<br>\\s*)*BZCOLUMNBLOCK' + i + 'END(?:<br>\\s*)*');
    html = html.replace(pattern, () => block);
  });
  return html;
}

// ===== Router =====
let currentSort = 'newest';

function getRoute() {
  const hash = window.location.hash || '#/';
  return hash;
}

function navigate(hash) {
  window.location.hash = hash;
}

function router() {
  const hash = getRoute();
  const app = document.getElementById('app');

  if (hash === '#/' || hash === '') {
    renderHome();
  } else if (hash.startsWith('#/category/')) {
    const catId = hash.replace('#/category/', '');
    renderHome(catId);
  } else if (hash.startsWith('#/thread/')) {
    const threadId = hash.replace('#/thread/', '');
    renderThread(threadId);
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

window.addEventListener('hashchange', router);

// ===== Header =====
function renderHeader() {
  const searchVal = getRoute().startsWith('#/search')
    ? decodeURIComponent(getRoute().split('q=')[1] || '')
    : '';

  return `
    <header class="header">
      <div class="header-inner">
        <a class="header-logo" onclick="navigate('#/')">
          <img src="${logoUrl}" alt="BZ Logo">
          <div class="header-logo-text">
            <span class="header-logo-title">BZ Forum</span>
            <span class="header-logo-subtitle">Kế toán Tài chính</span>
          </div>
        </a>

        <div class="search-container">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" class="search-input" id="search-input"
                 placeholder="Tìm kiếm bài viết, chủ đề..."
                 value="${escapeHtml(searchVal)}"
                 onkeydown="if(event.key==='Enter') handleSearch()">
        </div>

        <div class="header-actions">
          ${currentUser ? renderUserMenu() : renderAuthButtons()}
        </div>
      </div>
    </header>
  `;
}

function renderAuthButtons() {
  return `
    <button class="btn btn-outline btn-sm" onclick="navigate('#/login')">Đăng nhập</button>
    <button class="btn btn-primary btn-sm" onclick="navigate('#/register')">Đăng ký</button>
  `;
}

function renderUserMenu() {
  return `
    <div class="user-menu" id="user-menu" onclick="toggleDropdown()">
      <div class="user-menu-avatar">${escapeHtml(currentUser.avatar)}</div>
      <span class="user-menu-name">${escapeHtml(currentUser.name)} ${currentUser.role === 'admin' ? ' · Admin' : ''}</span>
      ${ICONS.chevronDown}
      <div class="dropdown-menu" id="user-dropdown">
        ${currentUser.role === 'admin' ? `<button class="dropdown-item" onclick="navigate('#/admin')">Quản trị diễn đàn</button>` : ''}
        <button class="dropdown-item" onclick="navigate('#/profile/${currentUser.id}')">
          ${ICONS.user} Trang cá nhân
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" onclick="handleLogout()">
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
  const categories = getCategories();
  return `
    <aside class="sidebar">
      <div class="sidebar-new-thread">
        <button class="btn btn-primary" onclick="${currentUser ? "navigate('#/new-thread')" : "navigate('#/login'); showToast('Vui lòng đăng nhập để đăng bài', 'info')"}">
          ${ICONS.plus} Tạo bài viết mới
        </button>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Danh mục</div>
        <ul class="category-list">
          <li class="category-item ${!activeCatId ? 'active' : ''}" onclick="navigate('#/')">
            <span class="category-dot" style="background: var(--color-navy)"></span>
            Tất cả
            <span class="category-count">${getStats().threads}</span>
          </li>
          ${categories.map(cat => `
            <li class="category-item ${activeCatId === cat.id ? 'active' : ''}" onclick="navigate('#/category/${cat.id}')">
              <span class="category-dot" style="background: ${cat.color}"></span>
              ${escapeHtml(cat.name)}
              <span class="category-count">${getThreadCountByCategory(cat.id)}</span>
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

// ===== Footer =====
function renderFooter() {
  return `
    <footer class="footer">
      <p>© ${new Date().getFullYear()} <strong>BZ Forum</strong> – Cộng đồng Kế toán Tài chính Việt Nam</p>
      <p style="margin-top:0.3rem;">Được tạo bởi <a href="#">Bezin</a> với ❤️</p>
    </footer>
  `;
}

// ====================================================================
//  PAGE: HOME
// ====================================================================
function renderHome(categoryId) {
  const threads = getThreads({ categoryId, sortBy: currentSort });
  const category = categoryId ? getCategoryById(categoryId) : null;
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
            <a onclick="navigate('#/')">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            <span>${escapeHtml(category.icon + ' ' + category.name)}</span>
          </div>
        `}

        <div class="content-header">
          <h3 class="content-title">${category ? escapeHtml(category.name) : 'Bài viết mới nhất'}</h3>
          <div class="sort-options">
            <button class="btn btn-sm ${currentSort === 'newest' ? 'btn-secondary' : 'btn-ghost'}" onclick="changeSort('newest')">Mới nhất</button>

            <button class="btn btn-sm ${currentSort === 'most-liked' ? 'btn-secondary' : 'btn-ghost'}" onclick="changeSort('most-liked')">Yêu thích</button>
          </div>
        </div>

        <div class="thread-list">
          ${threads.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
              <div class="empty-state-text">Hãy là người đầu tiên đăng bài trong danh mục này!</div>
              <button class="btn btn-primary" onclick="navigate('#/new-thread')">Tạo bài viết</button>
            </div>
          ` : threads.map(t => renderThreadCard(t)).join('')}
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
    <article class="thread-card card card-elevated ${thread.pinned ? 'thread-pinned' : ''}" onclick="navigate('#/thread/${thread.id}')">
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
        ${category ? `<span class="thread-tag" style="background:${category.color}">${escapeHtml(category.icon + ' ' + category.name)}</span>` : ''}
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
  const hash = getRoute();
  if (hash.startsWith('#/category/')) {
    renderHome(hash.replace('#/category/', ''));
  } else {
    renderHome();
  }
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
      ${renderSidebar()}
      <main class="content animate-fadeIn">
        <div class="thread-detail">
          <a class="back-link" onclick="history.back()">${ICONS.back} Quay lại</a>

          <div class="breadcrumb">
            <a onclick="navigate('#/')">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            ${category ? `<a onclick="navigate('#/category/${category.id}')">${escapeHtml(category.icon + ' ' + category.name)}</a><span class="breadcrumb-sep">›</span>` : ''}
            <span style="color:var(--color-text);">${escapeHtml(thread.title.substring(0, 50))}...</span>
          </div>

          <div class="thread-detail-header">
            ${currentUser && (currentUser.role === 'admin' || currentUser.id === thread.authorId) ? `<button class="btn btn-outline" onclick="navigate('#/edit/${thread.id}')">Sửa bài viết</button>` : ''}
            <h1 class="thread-detail-title">${escapeHtml(thread.title)}</h1>
            <div class="thread-detail-meta">
              <div class="thread-avatar" style="background: ${category?.color || 'var(--color-navy)'}; cursor:pointer;" onclick="navigate('#/profile/${author?.id}')">${escapeHtml(author?.avatar || '?')}</div>
              <div>
                <span class="thread-author" style="cursor:pointer;" onclick="navigate('#/profile/${author?.id}')">${escapeHtml(author?.name || 'Ẩn danh')}</span>
                ${author?.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : ''}
                ${author?.role === 'moderator' ? '<span class="badge badge-mod">Mod</span>' : ''}
                <br><span class="thread-time">${formatDate(thread.createdAt)}</span>
              </div>
              <div style="flex:1"></div>
              <span class="thread-stat">${ICONS.eye} Bài viết cộng đồng</span>
              <button class="vote-btn" onclick="handleLike('${thread.id}')">${ICONS.heart} ${thread.likes}</button>
            </div>
          </div>

          <div class="thread-detail-content card card-elevated">
            <div class="content-body">${renderMarkdown(thread.content)}</div>
            <div style="margin-top: var(--space-lg); display:flex; gap:var(--space-sm); flex-wrap:wrap;">
              ${thread.tags.map(tag => `<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${escapeHtml(tag)}</span>`).join('')}
            </div>
          </div>

          <div class="replies-section">
            <div class="replies-title">${ICONS.comment} ${replies.length} bình luận</div>

            ${replies.map(reply => {
              const rAuthor = getUserById(reply.authorId);
              return `
                <div class="reply-card card">
                  <div class="reply-header">
                    <div class="reply-avatar" style="cursor:pointer;" onclick="navigate('#/profile/${rAuthor?.id}')">${escapeHtml(rAuthor?.avatar || '?')}</div>
                    <span class="reply-author" style="cursor:pointer;" onclick="navigate('#/profile/${rAuthor?.id}')">${escapeHtml(rAuthor?.name || 'Ẩn danh')}</span>
                    ${rAuthor?.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : ''}
                    ${rAuthor?.role === 'moderator' ? '<span class="badge badge-mod">Mod</span>' : ''}
                    <span class="reply-time">${timeAgo(reply.createdAt)}</span>
                  </div>
                  <div class="reply-content">${renderMarkdown(reply.content)}</div>
                </div>
              `;
            }).join('')}

            ${currentUser ? `
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md);">
                <h4 style="margin-bottom: var(--space-md); color: var(--color-navy);">Viết bình luận</h4>
                <form onsubmit="handleReply(event, '${thread.id}')">
                  <textarea class="form-textarea" id="reply-content" placeholder="Nhập nội dung bình luận..." required style="min-height:100px;"></textarea>
                  <div style="margin-top: var(--space-md); text-align:right;">
                    <button type="submit" class="btn btn-primary">Gửi bình luận</button>
                  </div>
                </form>
              </div>
            ` : `
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md); text-align:center;">
                <p style="color: var(--color-text-light); margin-bottom: var(--space-md);">Đăng nhập để tham gia thảo luận</p>
                <button class="btn btn-primary" onclick="navigate('#/login')">Đăng nhập</button>
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
        <a class="back-link" onclick="history.back()">${ICONS.back} Quay lại</a>
        <div class="form-card card card-elevated">
          <h2 class="form-title">✏️ Tạo bài viết mới</h2>
          <p class="form-subtitle">Chia sẻ kiến thức, kinh nghiệm hoặc đặt câu hỏi</p>

          <form onsubmit="handleNewThread(event)">
            <div class="form-group">
              <label class="form-label">Tiêu đề *</label>
              <input type="text" class="form-input" id="thread-title" placeholder="Nhập tiêu đề bài viết..." required>
            </div>

            <div class="form-group">
              <label class="form-label">Danh mục *</label>
              <select class="form-select" id="thread-category" required>
                <option value="">-- Chọn danh mục --</option>
                ${categories.map(c => `<option value="${c.id}">${c.icon} ${escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Nội dung *</label>
              <textarea class="form-textarea" id="thread-content" placeholder="Viết nội dung bài viết...\n\nMẹo: Dùng **chữ đậm** và - để tạo danh sách" required style="min-height:200px;"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Thẻ tags</label>
              <input type="text" class="form-input" id="thread-tags" placeholder="Nhập các tag cách nhau bởi dấu phẩy (VD: thuế, TNCN, hướng dẫn)">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" onclick="history.back()">Hủy</button>
              <button type="button" class="btn btn-outline" onclick="previewPost()">Xem trước</button>
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
          <p class="form-subtitle">Chào mừng quay lại BZ Forum</p>

          <form onsubmit="handleLogin(event)">
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
            Chưa có tài khoản? <a onclick="navigate('#/register')">Đăng ký ngay</a>
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

          <form onsubmit="handleRegister(event)">
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
            Đã có tài khoản? <a onclick="navigate('#/login')">Đăng nhập</a>
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
        <a class="back-link" onclick="navigate('#/')">${ICONS.back} Quay lại trang chủ</a>
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
        <a class="back-link" onclick="history.back()">${ICONS.back} Quay lại</a>

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
          <span style="color: var(--color-text-light); font-size:0.9rem;">${userThreads.length} bài</span>
        </div>

        <div class="thread-list">
          ${userThreads.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
            </div>
          ` : userThreads.map(t => renderThreadCard(t)).join('')}
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
    navigate('#/');
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
    err.textContent = result.error;
    return;
  }

  if (result.confirmationRequired) { showToast('Vui lòng mở email xác nhận tài khoản rồi đăng nhập.', 'info'); navigate('#/login'); return; }
  setCurrentUser(result.user);
  showToast(`Đăng ký thành công! Chào mừng ${result.user.name} 🎉`);
  navigate('#/');
}

async function handleLogout() {
  await signOut();
  setCurrentUser(null);
  showToast('Đã đăng xuất', 'info');
  navigate('#/');
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
document.addEventListener('DOMContentLoaded', async () => {
  try {
    currentUser = await getCurrentUser(); await refreshData();
    if (authCallbackError) { history.replaceState(null,'',location.pathname+'#/forgot-password'); renderForgotPassword('Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu liên kết mới.'); }
    else if (isPasswordRecovery()) { history.replaceState(null,'',location.pathname+'?recovery=1#/reset-password'); renderResetPassword(); }
    else router();
  }
  catch (error) { document.getElementById('app').innerHTML = '<p>Chưa kết nối được dữ liệu. Vui lòng tải lại trang.</p>'; console.error(error); }
});

// Expose handlers used by inline HTML attributes from this module.
Object.assign(window, { navigate, showToast, toggleDropdown, changeSort, handleSearch, handleLogin, handleRegister, handleLogout, handleNewThread, handleReply, handleLike });

// Keep async form failures visible without losing entered content.
for (const name of ['handleLogin','handleRegister','handleLogout','handleNewThread','handleReply','handleLike']) {
 const handler=window[name]; let pending=false; window[name]=async (...args)=>{ args[0]?.preventDefault?.(); if(pending) return; pending=true; try {await handler(...args);} catch(error){ const message = friendlyError(error); const box=document.getElementById(name==='handleLogin'?'login-error':name==='handleRegister'?'reg-error':''); if(box){box.style.display='block';box.textContent=message;} showToast(message,'error');} finally {pending=false;} };
}

function renderAdmin() {
 if(currentUser?.role !== 'admin') { navigate('#/'); return; }
 const stats=getStats();
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card"><h1>Quản trị diễn đàn</h1><p>${stats.users} thành viên · ${stats.threads} bài viết · ${stats.replies} bình luận</p><p>Quản trị viên: ${escapeHtml(currentUser.name)}</p><button class="btn btn-primary" onclick="navigate('#/new-thread')">Tạo bài viết mới</button><h2>Bài viết</h2>${getThreads().map(t=>`<p>${escapeHtml(t.title)} <button class="btn btn-outline" onclick="navigate('#/edit/${t.id}')">Sửa bài viết</button></p>`).join('') || '<p>Chưa có bài viết.</p>'}<h2>Bình luận</h2>${getDB().replies.map(reply=>`<form onsubmit="handleAdminReply(event,'${reply.id}')"><p>${escapeHtml(getThreadById(reply.threadId)?.title || '')}</p><textarea class="form-textarea" name="content" required maxlength="10000">${escapeHtml(reply.content)}</textarea><button class="btn btn-outline" type="submit">Lưu bình luận</button></form>`).join('') || '<p>Chưa có bình luận.</p>'}</div></div></main>${renderFooter()}`;
}
function renderEditThread(id) {
 const t=getThreadById(id);
 if(!t || !currentUser || (currentUser.role!=='admin' && currentUser.id!==t.authorId)) {navigate('#/');return;}
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card"><h1>Sửa bài viết</h1><form onsubmit="handleEditThread(event,'${t.id}')"><label>Tiêu đề<input class="form-input" name="title" required maxlength="300" value="${escapeHtml(t.title)}"></label><label>Danh mục<select class="form-input" name="category">${getCategories().map(c=>`<option value="${c.id}" ${c.id===t.categoryId?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select></label><label>Nội dung<textarea class="form-textarea" name="content" required maxlength="50000">${escapeHtml(t.content)}</textarea></label><button class="btn btn-primary" type="submit">Lưu bài viết</button></form></div></div></main>${renderFooter()}`;
}
async function handleEditThread(event,id) {
 event.preventDefault(); const form=event.target; const button=form.querySelector('button'); button.disabled=true;
 try {await updateThread(id,form.elements.title.value.trim(),form.elements.content.value.trim(),form.elements.category.value);showToast('Đã lưu bài viết');navigate('#/thread/'+id);} catch(e){showToast(e.message,'error');} finally {button.disabled=false;}
}
async function handleAdminReply(event,id) {
 event.preventDefault(); const form=event.target; const button=form.querySelector('button'); button.disabled=true;
 try {await updateReply(id,form.elements.content.value.trim());showToast('Đã lưu bình luận');} catch(e){showToast(e.message,'error');} finally {button.disabled=false;}
}
Object.assign(window,{handleEditThread,handleAdminReply});

function friendlyError(error) {
 const message=error?.message || '';
 if(/email not confirmed/i.test(message)) return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư và thư rác.';
 if(/invalid login credentials/i.test(message)) return 'Email hoặc mật khẩu không đúng.';
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
window.previewPost=previewPost;

function renderForgotPassword(message='') {
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card card-elevated"><h1>Quên mật khẩu</h1><p>Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p><form onsubmit="handleForgotPassword(event)"><label class="form-label" for="recovery-email">Email</label><input class="form-input" id="recovery-email" type="email" autocomplete="email" required><p id="recovery-message" role="status">${escapeHtml(message)}</p><button class="btn btn-primary" type="submit">Gửi liên kết đặt lại mật khẩu</button></form><p class="form-link"><a href="#/login">Quay lại đăng nhập</a></p></div></div></main>${renderFooter()}`;
}
function renderResetPassword() {
 if(!currentUser || !isPasswordRecovery() || authCallbackError) {renderForgotPassword('Hãy mở liên kết xác nhận trong email để đặt mật khẩu mới.');return;}
 document.getElementById('app').innerHTML=`${renderHeader()}<main class="main-layout-full"><div class="form-container"><div class="form-card card card-elevated"><h1>Đặt mật khẩu mới</h1><p>Chọn mật khẩu có ít nhất 8 ký tự.</p><form onsubmit="handleResetPassword(event)"><label class="form-label" for="new-password">Mật khẩu mới</label><input class="form-input" id="new-password" type="password" autocomplete="new-password" minlength="8" required><label class="form-label" for="new-password-confirm">Nhập lại mật khẩu mới</label><input class="form-input" id="new-password-confirm" type="password" autocomplete="new-password" minlength="8" required><p id="reset-message" role="alert"></p><button class="btn btn-primary" type="submit">Lưu mật khẩu mới</button></form></div></div></main>${renderFooter()}`;
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
Object.assign(window,{handleForgotPassword,handleResetPassword});
