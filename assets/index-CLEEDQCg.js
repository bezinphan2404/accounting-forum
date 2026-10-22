(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const l={search:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',comment:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',back:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',logout:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'};let v=JSON.parse(sessionStorage.getItem("bz_current_user"))||null;function L(t,e="success"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",a.className="toast-container",document.body.appendChild(a));const n=document.createElement("div");n.className=`toast toast-${e}`,n.textContent=t,a.appendChild(n),setTimeout(()=>{n.remove()},3e3)}function x(t){const e=Date.now()-new Date(t).getTime(),a=Math.floor(e/6e4),n=Math.floor(e/36e5),s=Math.floor(e/864e5);return a<1?"vừa xong":a<60?`${a} phút trước`:n<24?`${n} giờ trước`:s<30?`${s} ngày trước`:new Date(t).toLocaleDateString("vi-VN")}function B(t){return new Date(t).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"})}function i(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function M(t){const e=/((?:^[ \t]*\|[^\n]+\|[ \t]*(?:\r?\n|$)){2,})/gm;return t.replace(e,a=>{const n=a.trim().split(/\r?\n/).map(d=>d.trim()).filter(Boolean);if(n.length<2||!/^\|[\s\-:|]+\|$/.test(n[1]))return a;const s=d=>d.replace(/^\|/,"").replace(/\|$/,"").split("|").map(p=>p.trim()),o=s(n[0]),c=s(n[1]).map(d=>{const h=d.startsWith(":"),p=d.endsWith(":");return h&&p?"center":p?"right":"left"});let r="<thead><tr>"+o.map((d,h)=>`<th style="text-align:${c[h]||"left"}">${d}</th>`).join("")+"</tr></thead>",b="<tbody>";for(let d=2;d<n.length;d++){const h=s(n[d]);b+="<tr>"+h.map((p,C)=>`<td style="text-align:${c[C]||"left"}">${p}</td>`).join("")+"</tr>"}return b+="</tbody>",`<div class="table-responsive"><table class="forum-table">${r}${b}</table></div>`})}function w(t){if(!t)return"";let e=i(t);e=e.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),e=e.replace(/`(.*?)`/g,'<code style="background:rgba(69,123,157,0.12); color:var(--color-navy); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:0.92em; font-weight:500;">$1</code>'),e=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\*(.*?)\*/g,"<em>$1</em>"),e=M(e);const a=[];return e=e.replace(/<div class="table-responsive">[\s\S]*?<\/div>/g,n=>(a.push(n),`__TABLE_PLACEHOLDER_${a.length-1}__`)),e=e.replace(/(?:^|\n)### (.*?)(?=\n|$)/g,'<h3 style="margin-top:1.5rem; margin-bottom:0.75rem; color:var(--color-navy); font-size:1.2rem; font-weight:700; border-bottom:2px solid var(--color-primary); padding-bottom:6px;">$1</h3>'),e=e.replace(/(?:^|\n)#### (.*?)(?=\n|$)/g,'<h4 style="margin-top:1.2rem; margin-bottom:0.5rem; color:var(--color-text); font-size:1.05rem; font-weight:600;">$1</h4>'),e=e.replace(/(?:^|\n)---(?=\n|$)/g,'<hr style="margin:1.75rem 0; border:none; border-top:1px dashed var(--color-border); opacity:0.8;">'),e=e.replace(/\n- /g,`
<span style="color:var(--color-primary); font-weight:bold; margin-right:4px;">•</span> `),e=e.replace(/\n  \+ /g,`
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--color-accent); font-weight:bold;">▸</span> `),e=e.replace(/\n    \* /g,`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▫ `),e=e.replace(/\n/g,"<br>"),a.forEach((n,s)=>{e=e.replace(`__TABLE_PLACEHOLDER_${s}__`,n)}),e}let I="newest";function y(){return window.location.hash||"#/"}function $(t){window.location.hash=t}function T(){const t=y();if(document.getElementById("app"),t==="#/"||t==="")f();else if(t.startsWith("#/category/")){const e=t.replace("#/category/","");f(e)}else if(t.startsWith("#/thread/")){const e=t.replace("#/thread/","");j(e)}else if(t==="#/new-thread")D();else if(t==="#/login")H();else if(t==="#/register")S();else if(t.startsWith("#/search")){const e=new URLSearchParams(t.split("?")[1]||"");q(e.get("q")||"")}else if(t.startsWith("#/profile/")){const e=t.replace("#/profile/","");z(e)}else f()}window.addEventListener("hashchange",T);function m(){const t=y().startsWith("#/search")?decodeURIComponent(y().split("q=")[1]||""):"";return`
    <header class="header">
      <div class="header-inner">
        <a class="header-logo" onclick="navigate('#/')">
          <img src="assets/logo.svg" alt="BZ Logo">
          <div class="header-logo-text">
            <span class="header-logo-title">BZ Forum</span>
            <span class="header-logo-subtitle">Kế toán Tài chính</span>
          </div>
        </a>

        <div class="search-container">
          <span class="search-icon">${l.search}</span>
          <input type="text" class="search-input" id="search-input"
                 placeholder="Tìm kiếm bài viết, chủ đề..."
                 value="${i(t)}"
                 onkeydown="if(event.key==='Enter') handleSearch()">
        </div>

        <div class="header-actions">
          ${v?N():E()}
        </div>
      </div>
    </header>
  `}function E(){return`
    <button class="btn btn-outline btn-sm" onclick="navigate('#/login')">Đăng nhập</button>
    <button class="btn btn-primary btn-sm" onclick="navigate('#/register')">Đăng ký</button>
  `}function N(){return`
    <div class="user-menu" id="user-menu" onclick="toggleDropdown()">
      <div class="user-menu-avatar">${i(v.avatar)}</div>
      <span class="user-menu-name">${i(v.name)}</span>
      ${l.chevronDown}
      <div class="dropdown-menu" id="user-dropdown">
        <button class="dropdown-item" onclick="navigate('#/profile/${v.id}')">
          ${l.user} Trang cá nhân
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" onclick="handleLogout()">
          ${l.logout} Đăng xuất
        </button>
      </div>
    </div>
  `}document.addEventListener("click",t=>{const e=document.getElementById("user-dropdown"),a=document.getElementById("user-menu");e&&a&&!a.contains(t.target)&&e.classList.remove("open")});function u(t){const e=getCategories();return`
    <aside class="sidebar">
      <div class="sidebar-new-thread">
        <button class="btn btn-primary" onclick="${v?"navigate('#/new-thread')":"navigate('#/login'); showToast('Vui lòng đăng nhập để đăng bài', 'info')"}">
          ${l.plus} Tạo bài viết mới
        </button>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Danh mục</div>
        <ul class="category-list">
          <li class="category-item ${t?"":"active"}" onclick="navigate('#/')">
            <span class="category-dot" style="background: var(--color-navy)"></span>
            Tất cả
            <span class="category-count">${getStats().threads}</span>
          </li>
          ${e.map(a=>`
            <li class="category-item ${t===a.id?"active":""}" onclick="navigate('#/category/${a.id}')">
              <span class="category-dot" style="background: ${a.color}"></span>
              ${i(a.name)}
              <span class="category-count">${getThreadCountByCategory(a.id)}</span>
            </li>
          `).join("")}
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
  `}function g(){return`
    <footer class="footer">
      <p>© 2024 <strong>BZ Forum</strong> – Cộng đồng Kế toán Tài chính Việt Nam</p>
      <p style="margin-top:0.3rem;">Được tạo bởi <a href="#">Bezin</a> với ❤️</p>
    </footer>
  `}function f(t){const e=getThreads({categoryId:t,sortBy:I}),a=t?getCategoryById(t):null,n=getStats(),s=document.getElementById("app");s.innerHTML=`
    ${m()}
    <div class="main-layout">
      ${u(t)}
      <main class="content animate-fadeIn">
        ${t?`
          <div class="breadcrumb">
            <a onclick="navigate('#/')">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            <span>${i(a.icon+" "+a.name)}</span>
          </div>
        `:`
          <div class="welcome-banner">
            <h2>👋 Chào mừng đến với BZ Forum!</h2>
            <p>Cộng đồng chia sẻ kiến thức, kinh nghiệm và tài liệu kế toán tài chính.</p>
          </div>
          <div class="stats-bar">
            <div class="stat-card card">
              <div class="stat-value">${n.threads}</div>
              <div class="stat-label">Bài viết</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${n.replies}</div>
              <div class="stat-label">Bình luận</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${n.users}</div>
              <div class="stat-label">Thành viên</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${n.categories}</div>
              <div class="stat-label">Danh mục</div>
            </div>
          </div>
        `}

        <div class="content-header">
          <h3 class="content-title">${a?i(a.name):"Bài viết mới nhất"}</h3>
          <div class="sort-options">
            <button class="btn btn-sm btn-secondary" onclick="changeSort('newest')">Mới nhất</button>
            <button class="btn btn-sm btn-ghost" onclick="changeSort('popular')">Xem nhiều</button>
            <button class="btn btn-sm btn-ghost" onclick="changeSort('most-liked')">Yêu thích</button>
          </div>
        </div>

        <div class="thread-list">
          ${e.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
              <div class="empty-state-text">Hãy là người đầu tiên đăng bài trong danh mục này!</div>
              <button class="btn btn-primary" onclick="navigate('#/new-thread')">Tạo bài viết</button>
            </div>
          `:e.map(o=>k(o)).join("")}
        </div>
      </main>
    </div>
    ${g()}
  `}function k(t){const e=getUserById(t.authorId),a=getCategoryById(t.categoryId),n=getReplyCount(t.id);return`
    <article class="thread-card card card-elevated ${t.pinned?"thread-pinned":""}" onclick="navigate('#/thread/${t.id}')">
      <div class="thread-card-header">
        <div class="thread-avatar" style="background: ${a?a.color:"var(--color-navy)"}">${i((e==null?void 0:e.avatar)||"?")}</div>
        <div class="thread-meta">
          <span class="thread-author">${i((e==null?void 0:e.name)||"Ẩn danh")}</span>
          ${(e==null?void 0:e.role)==="admin"?'<span class="badge badge-admin">Admin</span>':""}
          ${(e==null?void 0:e.role)==="moderator"?'<span class="badge badge-mod">Mod</span>':""}
          <span class="thread-time">${x(t.createdAt)}</span>
          ${t.pinned?'<span style="color:var(--color-peach); font-size:0.8rem; margin-left:0.3rem;">📌 Ghim</span>':""}
        </div>
      </div>
      <h3 class="thread-title">${i(t.title)}</h3>
      <p class="thread-excerpt">${i(t.content.substring(0,150))}...</p>
      <div class="thread-footer">
        ${a?`<span class="thread-tag" style="background:${a.color}">${i(a.icon+" "+a.name)}</span>`:""}
        ${t.tags.slice(0,3).map(s=>`<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${i(s)}</span>`).join("")}
        <div style="flex:1"></div>
        <span class="thread-stat">${l.eye} ${t.views}</span>
        <span class="thread-stat">${l.heart} ${t.likes}</span>
        <span class="thread-stat">${l.comment} ${n}</span>
      </div>
    </article>
  `}function j(t){const e=getThreadById(t);if(!e){$("#/");return}incrementViews(t);const a=getUserById(e.authorId),n=getCategoryById(e.categoryId),s=getReplies(t),o=document.getElementById("app");o.innerHTML=`
    ${m()}
    <div class="main-layout">
      ${u()}
      <main class="content animate-fadeIn">
        <div class="thread-detail">
          <a class="back-link" onclick="history.back()">${l.back} Quay lại</a>

          <div class="breadcrumb">
            <a onclick="navigate('#/')">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            ${n?`<a onclick="navigate('#/category/${n.id}')">${i(n.icon+" "+n.name)}</a><span class="breadcrumb-sep">›</span>`:""}
            <span style="color:var(--color-text);">${i(e.title.substring(0,50))}...</span>
          </div>

          <div class="thread-detail-header">
            <h1 class="thread-detail-title">${i(e.title)}</h1>
            <div class="thread-detail-meta">
              <div class="thread-avatar" style="background: ${(n==null?void 0:n.color)||"var(--color-navy)"}; cursor:pointer;" onclick="navigate('#/profile/${a==null?void 0:a.id}')">${i((a==null?void 0:a.avatar)||"?")}</div>
              <div>
                <span class="thread-author" style="cursor:pointer;" onclick="navigate('#/profile/${a==null?void 0:a.id}')">${i((a==null?void 0:a.name)||"Ẩn danh")}</span>
                ${(a==null?void 0:a.role)==="admin"?'<span class="badge badge-admin">Admin</span>':""}
                ${(a==null?void 0:a.role)==="moderator"?'<span class="badge badge-mod">Mod</span>':""}
                <br><span class="thread-time">${B(e.createdAt)}</span>
              </div>
              <div style="flex:1"></div>
              <span class="thread-stat">${l.eye} ${e.views} lượt xem</span>
              <button class="vote-btn" onclick="handleLike('${e.id}')">${l.heart} ${e.likes}</button>
            </div>
          </div>

          <div class="thread-detail-content card card-elevated">
            <div class="content-body">${w(e.content)}</div>
            <div style="margin-top: var(--space-lg); display:flex; gap:var(--space-sm); flex-wrap:wrap;">
              ${e.tags.map(c=>`<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${i(c)}</span>`).join("")}
            </div>
          </div>

          <div class="replies-section">
            <div class="replies-title">${l.comment} ${s.length} bình luận</div>

            ${s.map(c=>{const r=getUserById(c.authorId);return`
                <div class="reply-card card">
                  <div class="reply-header">
                    <div class="reply-avatar" style="cursor:pointer;" onclick="navigate('#/profile/${r==null?void 0:r.id}')">${i((r==null?void 0:r.avatar)||"?")}</div>
                    <span class="reply-author" style="cursor:pointer;" onclick="navigate('#/profile/${r==null?void 0:r.id}')">${i((r==null?void 0:r.name)||"Ẩn danh")}</span>
                    ${(r==null?void 0:r.role)==="admin"?'<span class="badge badge-admin">Admin</span>':""}
                    ${(r==null?void 0:r.role)==="moderator"?'<span class="badge badge-mod">Mod</span>':""}
                    <span class="reply-time">${x(c.createdAt)}</span>
                  </div>
                  <div class="reply-content">${w(c.content)}</div>
                </div>
              `}).join("")}

            ${v?`
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md);">
                <h4 style="margin-bottom: var(--space-md); color: var(--color-navy);">Viết bình luận</h4>
                <form onsubmit="handleReply(event, '${e.id}')">
                  <textarea class="form-textarea" id="reply-content" placeholder="Nhập nội dung bình luận..." required style="min-height:100px;"></textarea>
                  <div style="margin-top: var(--space-md); text-align:right;">
                    <button type="submit" class="btn btn-primary">Gửi bình luận</button>
                  </div>
                </form>
              </div>
            `:`
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md); text-align:center;">
                <p style="color: var(--color-text-light); margin-bottom: var(--space-md);">Đăng nhập để tham gia thảo luận</p>
                <button class="btn btn-primary" onclick="navigate('#/login')">Đăng nhập</button>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>
    ${g()}
  `}function D(){if(!v){$("#/login"),L("Vui lòng đăng nhập để đăng bài","info");return}const t=getCategories(),e=document.getElementById("app");e.innerHTML=`
    ${m()}
    <div class="main-layout-full">
      <div class="new-thread-form animate-fadeIn">
        <a class="back-link" onclick="history.back()">${l.back} Quay lại</a>
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
                ${t.map(a=>`<option value="${a.id}">${a.icon} ${i(a.name)}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Nội dung *</label>
              <textarea class="form-textarea" id="thread-content" placeholder="Viết nội dung bài viết...

Mẹo: Dùng **chữ đậm** và - để tạo danh sách" required style="min-height:200px;"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Thẻ tags</label>
              <input type="text" class="form-input" id="thread-tags" placeholder="Nhập các tag cách nhau bởi dấu phẩy (VD: thuế, TNCN, hướng dẫn)">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" onclick="history.back()">Hủy</button>
              <button type="submit" class="btn btn-primary btn-lg">Đăng bài viết</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    ${g()}
  `}function H(){const t=document.getElementById("app");t.innerHTML=`
    ${m()}
    <div class="main-layout-full">
      <div class="form-container animate-fadeIn">
        <div class="form-card card card-elevated">
          <div style="text-align:center; margin-bottom: var(--space-lg);">
            <img src="assets/logo.svg" alt="BZ" style="width:60px; height:60px;">
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
              <input type="password" class="form-input" id="login-password" placeholder="Nhập mật khẩu" required>
            </div>
            <div id="login-error" class="form-error" style="display:none;"></div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">Đăng nhập</button>
            </div>
          </form>

          <div class="form-link">
            Chưa có tài khoản? <a onclick="navigate('#/register')">Đăng ký ngay</a>
          </div>

          <div style="margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--border-color);">
            <p style="font-size: 0.8rem; color: var(--color-text-lighter); text-align: center; margin-bottom: var(--space-sm);">Tài khoản demo:</p>
            <div style="font-size: 0.8rem; color: var(--color-text-light); text-align: center;">
              <strong>Admin:</strong> bezin@bzforum.vn / bezin123<br>
              <strong>Member:</strong> huong@example.com / demo123
            </div>
          </div>
        </div>
      </div>
    </div>
    ${g()}
  `}function S(){const t=document.getElementById("app");t.innerHTML=`
    ${m()}
    <div class="main-layout-full">
      <div class="form-container animate-fadeIn">
        <div class="form-card card card-elevated">
          <div style="text-align:center; margin-bottom: var(--space-lg);">
            <img src="assets/logo.svg" alt="BZ" style="width:60px; height:60px;">
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
              <input type="password" class="form-input" id="reg-password" placeholder="Tối thiểu 6 ký tự" required minlength="6">
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
    ${g()}
  `}function q(t){const e=getThreads({search:t}),a=document.getElementById("app");a.innerHTML=`
    ${m()}
    <div class="main-layout">
      ${u()}
      <main class="content animate-fadeIn">
        <a class="back-link" onclick="navigate('#/')">${l.back} Quay lại trang chủ</a>
        <div class="content-header">
          <h3 class="content-title">Kết quả tìm kiếm: "${i(t)}"</h3>
          <span style="color: var(--color-text-light); font-size:0.9rem;">${e.length} kết quả</span>
        </div>
        <div class="thread-list">
          ${e.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">Không tìm thấy kết quả</div>
              <div class="empty-state-text">Thử tìm với từ khóa khác hoặc duyệt theo danh mục</div>
            </div>
          `:e.map(n=>k(n)).join("")}
        </div>
      </main>
    </div>
    ${g()}
  `}function z(t){const e=getUserById(t);if(!e){$("#/");return}const a=getUserThreads(t),n=document.getElementById("app");n.innerHTML=`
    ${m()}
    <div class="main-layout">
      ${u()}
      <main class="content animate-fadeIn">
        <a class="back-link" onclick="history.back()">${l.back} Quay lại</a>

        <div class="profile-header card card-elevated">
          <div class="profile-avatar">${i(e.avatar)}</div>
          <div class="profile-info">
            <h2>${i(e.name)}
              ${e.role==="admin"?'<span class="badge badge-admin" style="margin-left:0.5rem;">Admin</span>':""}
              ${e.role==="moderator"?'<span class="badge badge-mod" style="margin-left:0.5rem;">Mod</span>':""}
            </h2>
            <p>${i(e.bio||"Chưa có giới thiệu")}</p>
            <p style="font-size:0.8rem; color:var(--color-text-lighter); margin-top:0.3rem;">Tham gia: ${B(e.joinDate)}</p>
          </div>
        </div>

        <div class="content-header">
          <h3 class="content-title">Bài viết của ${i(e.name)}</h3>
          <span style="color: var(--color-text-light); font-size:0.9rem;">${a.length} bài</span>
        </div>

        <div class="thread-list">
          ${a.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
            </div>
          `:a.map(s=>k(s)).join("")}
        </div>
      </main>
    </div>
    ${g()}
  `}document.addEventListener("DOMContentLoaded",()=>{getDB(),T()});
