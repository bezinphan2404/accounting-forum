import { retiredPartIds, archivedMatches, adjustSeriesStats, visibleThreadPage } from './published-series.js';
import { createClient } from '@supabase/supabase-js';
const callbackHash = new URLSearchParams(window.location.hash.slice(1));
export const authCallbackError = callbackHash.get('error_code') || '';
let recoveryRequested = false;
let recoveryUserId = null;
let recoveryExpiresAt = 0;
export const client = createClient('https://ywmgvpffyymrmceosqkk.supabase.co', 'sb_publishable_D0xop95jNtFsaabwo8M7qQ_vf3wDnbM');
let activeProfile = null;
let memberId = null;
let dataEpoch = 0;
let profileRequest = null;
let interactiveAuth = false;
let expiryTimer;
let db = { categories: [], users: [], threads: [], replies: [] };
let stats = {threads:0,replies:0,users:0,categories:0,categoryCounts:{}};
let pageInfo = {offset:0,total:0};
let pageRequest = 0;
let feedbackPage={items:[],total:0,offset:0};
let feedbackRequest=0;
const details = new Map();
let archivedRows=null;let archivedRequest=null;let archiveLoadedAt=0;let visibleCursors=new Map();
const authRequired=()=>Object.assign(new Error('Vui lòng đăng nhập để xem nội dung.'),{code:'AUTH_REQUIRED'});
export function clearForumData() {
  dataEpoch++; activeProfile=null; memberId=null;
  db={categories:[],users:[],threads:[],replies:[]};
  stats={threads:0,replies:0,users:0,categories:0,categoryCounts:{}};
  pageInfo={offset:0,total:0}; details.clear();archivedRows=null;archivedRequest=null;archiveLoadedAt=0;visibleCursors.clear();
  feedbackPage={items:[],total:0,offset:0};
}
function memberEpoch() {if(!activeProfile)throw authRequired();return dataEpoch;}
function ensureEpoch(epoch) {if(epoch!==dataEpoch || !activeProfile)throw authRequired();}
function clearAccess() {
  clearForumData();clearTimeout(expiryTimer);
  window.dispatchEvent(new Event('bz-auth-cleared'));
}
const check = ({data,error}) => { if(error) throw error; return data; };
const profile = p => ({...p, name:p.name || 'Thành viên', avatar:(p.name || 'TV').split(' ').map(s=>s[0]).join('').slice(0,2), role:p.role || 'member', joinDate:p.created_at});
const thread = t => ({...t,authorId:t.author_id,categoryId:t.category_id,createdAt:t.created_at,views:0,pinned:false,likes:Number(t.likes || 0),replyCount:Number(t.reply_count || 0)});
const reply = r => ({...r,threadId:r.thread_id,authorId:r.author_id,createdAt:r.created_at});
async function loadProfiles(ids) {
  const epoch=memberEpoch();
  const unique=[...new Set(ids.filter(Boolean))];
  if(!unique.length)return;
  const users=check(await client.rpc('forum_public_profiles',{p_ids:unique}));
  ensureEpoch(epoch);
  const merged=new Map(db.users.map(p=>[p.id,p]));users.map(profile).forEach(p=>{merged.delete(p.id);merged.set(p.id,p);});
  db.users=[...merged.values()].slice(-150);
}
async function loadArchivedParts() {
  const epoch=memberEpoch();
  if(archivedRows && Date.now()-archiveLoadedAt<60000)return archivedRows;
  if(archivedRequest)return archivedRequest;
  const request=(async()=>{const rows=check(await client.from('threads').select('id,category_id,author_id,title,content,tags').in('id',retiredPartIds));ensureEpoch(epoch);archivedRows=rows;archiveLoadedAt=Date.now();return rows;})();
  archivedRequest=request;try{return await request;}finally{if(archivedRequest===request)archivedRequest=null;}
}
export async function refreshData() {
  const epoch=memberEpoch();
  const [categories,counts,archived]=await Promise.all([
    client.from('categories').select('id,name,icon,color,parent_id,sort_order').order('sort_order').order('id').limit(200), client.rpc('forum_stats'),loadArchivedParts()
  ]);
  ensureEpoch(epoch);
  db.categories=check(categories).map(c=>({...c,color:/^#[0-9a-f]{6}$/i.test(c.color)?c.color:'#457b9d'}));
  stats=adjustSeriesStats(check(counts),archived,db.categories);
}
export async function loadThreadPage({categoryId=null,search=null,authorId=null,sortBy='newest',offset=0}={}) {
  const epoch=memberEpoch();
  const request=++pageRequest;
  const hidden=await loadArchivedParts();ensureEpoch(epoch);
  const key=JSON.stringify([categoryId,search,authorId,sortBy]);
  const result=await visibleThreadPage(async rawOffset=>{const page=check(await client.rpc('forum_thread_page',{p_category:categoryId,p_search:search,p_author:authorId,p_sort:sortBy,p_offset:rawOffset,p_limit:50}));ensureEpoch(epoch);return page;},
    {offset,hiddenIds:new Set(hidden.map(r=>r.id)),hiddenCount:archivedMatches(hidden,{categoryId,search,authorId},db.categories).length,cursors:visibleCursors.get(key) || new Map([[0,0]])});
  ensureEpoch(epoch);

  const items=result.items.map(thread);
  await loadProfiles(items.map(t=>t.authorId).concat(authorId || []));
  ensureEpoch(epoch);
  if(request!==pageRequest)return;
  db.threads=items;pageInfo={offset,total:Number(result.total)};visibleCursors.set(key,result.cursors);if(visibleCursors.size>20)visibleCursors.delete(visibleCursors.keys().next().value);
}
export async function loadThreadDetail(id,offset=0) {
  const epoch=memberEpoch();
  const [row,comments]=await Promise.all([
    client.rpc('forum_thread_detail',{p_id:id}),
    client.from('replies').select('id,thread_id,author_id,content,created_at').eq('thread_id',id).order('created_at').order('id').range(offset,offset+49)
  ]);
  const t=check(row);if(!t)return null;
  const rs=check(comments).map(reply);
  ensureEpoch(epoch);
  await loadProfiles([t.author_id,...rs.map(r=>r.authorId)]);
  ensureEpoch(epoch);
  details.delete(id);details.set(id,thread(t));
  if(details.size>20)details.delete(details.keys().next().value);
  db.replies=offset===0 ? rs : [...db.replies.filter(r=>r.threadId===id),...rs];
  return details.get(id);
}
export async function loadAdminReplies() {
  const epoch=memberEpoch();
  if(activeProfile?.role!=='admin') throw Error('Không có quyền quản trị.');
  const rows=check(await client.from('replies').select('id,thread_id,author_id,content,created_at').order('created_at',{ascending:false}).order('id').limit(50));
  ensureEpoch(epoch);db.replies=rows.map(reply);
}
export const getPageInfo=()=>pageInfo;
export async function loadProfile(id) {await loadProfiles([id]);}
export function getCurrentUser() {
  if(profileRequest)return profileRequest;
  const request=readCurrentUser();profileRequest=request;
  return request.finally(()=>{if(profileRequest===request)profileRequest=null;});
}
async function readCurrentUser() {
  const startingEpoch=dataEpoch;
  const {data:{user},error} = await client.auth.getUser();
  if(startingEpoch!==dataEpoch)return null;
  if(error || !user || user.is_anonymous) {if(activeProfile)clearAccess();return null;}
  if(memberId!==user.id){clearForumData();memberId=user.id;}
  const epoch=dataEpoch;
  const p=check(await client.from('profiles').select('id,name,bio,created_at').eq('id',user.id).maybeSingle());
  if(!p) throw Error('Hồ sơ chưa sẵn sàng. Vui lòng thử lại.');
  const roles=check(await client.from('forum_roles').select('role').eq('user_id',user.id));
  if(epoch!==dataEpoch)return null;
  activeProfile={...profile(p),role:roles[0]?.role || 'member'};
  return activeProfile;
}
export const getDB=()=>db;
export const getCategories=()=>db.categories;
export const getCategoryById=id=>db.categories.find(c=>c.id===id);
export const getThreadCountByCategory=id=>stats.categoryCounts?.[id] || 0;
export const getUsers=()=>db.users;
export const getUserById=id=>activeProfile?.id===id?activeProfile:db.users.find(u=>u.id===id);
export const getThreads=()=>db.threads;
export const getThreadById=id=>details.get(id) || db.threads.find(t=>t.id===id);
export async function createThread({title,content,categoryId,tags}) {
  if(!Array.isArray(tags) || tags.length>10 || tags.some(tag=>typeof tag!=='string' || !tag.trim() || [...tag].length>50)) {
    throw Error('Mỗi bài được có tối đa 10 thẻ; mỗi thẻ từ 1 đến 50 ký tự.');
  }
  const user=await getCurrentUser();if(!user)throw Error('Vui lòng đăng nhập');
  visibleCursors.clear();
  const t=check(await client.from('threads').insert({title,content,category_id:categoryId,tags,author_id:user.id}).select('id').single());
  await refreshData();return t;
}
export const incrementViews=()=>{};
export async function toggleLike(threadId) {
  const user=await getCurrentUser();if(!user)throw Error('Vui lòng đăng nhập để yêu thích bài viết');
  const existing=check(await client.from('thread_likes').select('thread_id').eq('thread_id',threadId).eq('user_id',user.id).limit(1));
  check(existing.length?await client.from('thread_likes').delete().eq('thread_id',threadId).eq('user_id',user.id):await client.from('thread_likes').insert({thread_id:threadId,user_id:user.id}));
  await loadThreadDetail(threadId);
}
export const getReplies=id=>db.replies.filter(r=>r.threadId===id);
export async function createReply({threadId,content}) {
  const user=await getCurrentUser();if(!user)throw Error('Vui lòng đăng nhập');
  check(await client.from('replies').insert({thread_id:threadId,content,author_id:user.id}));
  await Promise.all([loadThreadDetail(threadId),refreshData()]);
}
export const getReplyCount=id=>getThreadById(id)?.replyCount || 0;
export const getStats=()=>stats;
export async function authenticateUser(email,password) {
  interactiveAuth=true;
  try {check(await client.auth.signInWithPassword({email,password})); const user=await getCurrentUser(); await refreshData(); return user;}
  finally {interactiveAuth=false;}
}
export async function signInWithGoogle() {
  check(await client.auth.signInWithOAuth({provider:'google', options:{redirectTo:window.location.origin + '/', queryParams:{prompt:'select_account'}}}));
}
export async function createUser(name,email,password) {
  interactiveAuth=true;
  try {
  const {data,error}=await client.auth.signUp({email,password,options:{data:{name}}});
  if(error) return {error:error.message};
  if(!data.session) return {confirmationRequired:true};
  const user=await getCurrentUser(); await refreshData(); return {user};
  } finally {interactiveAuth=false;}
}
export async function signOut({scope='local'}={}) {
  clearAccess();recoveryRequested=false;recoveryUserId=null;recoveryExpiresAt=0;
  check(await client.auth.signOut({scope}));
}

export async function updateThread(id, title, content, categoryId) {
  visibleCursors.clear();archivedRows=null;archiveLoadedAt=0;
  const rows=check(await client.from('threads').update({title,content,category_id:categoryId}).eq('id',id).select('id'));
  if(!rows.length) throw Error('Bạn không có quyền sửa bài viết này.');
  await Promise.all([refreshData(),loadThreadDetail(id)]);
}
export async function updateReply(id, content) {
  const rows=check(await client.from('replies').update({content}).eq('id',id).select('id'));
  if(!rows.length) throw Error('Bạn không có quyền sửa bình luận này.');
  await refreshData();
}

export const getFeedbackPage=()=>feedbackPage;
export async function loadFeedbackPage(offset=0) {
  const epoch=memberEpoch();const request=++feedbackRequest;
  const result=check(await client.rpc('forum_feedback_page',{p_offset:offset}));
  ensureEpoch(epoch);if(request!==feedbackRequest)return;
  feedbackPage={items:result.items,total:Number(result.total),offset};
}
export async function createFeedback({kind,title,content}) {
  const user=await getCurrentUser();if(!user)throw authRequired();
  const row=check(await client.from('forum_feedback').insert({author_id:user.id,kind,title,content}).select('id').single());
  await loadFeedbackPage();return row;
}
export async function updateFeedback(id,status,adminResponse) {
  const rows=check(await client.from('forum_feedback').update({status,admin_response:adminResponse}).eq('id',id).select('id'));
  if(!rows.length)throw Error('Chỉ admin được cập nhật phản hồi góp ý.');
  await loadFeedbackPage(feedbackPage.offset);
}
export async function findAIArticles(query) {
  const epoch=memberEpoch();const rows=check(await client.rpc('forum_ai_context',{p_query:query}));ensureEpoch(epoch);return rows;
}
async function aiRequest(body) {
  const epoch=memberEpoch();
  // The SDK supplies the session at runtime; never log or persist it here.
  const {data:{session},error}=await client.auth.getSession();
  if(error || !session || session.user.id!==activeProfile?.id)throw authRequired();
  ensureEpoch(epoch);
  const response=await fetch('/api/ai',{method:body?'POST':'GET',headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  ensureEpoch(epoch);
  if(response.status===401){clearAccess();throw authRequired();}
  let result;try{result=await response.json();}catch{throw Error('Chưa kết nối được trợ lý AI. Vui lòng thử lại sau.');}
  ensureEpoch(epoch);
  if(!response.ok)throw Error(result.error || 'AI chưa sẵn sàng. Vui lòng thử lại sau.');
  return result;
}
export const getAIStatus=()=>aiRequest();
export const askAI=body=>aiRequest(body);

client.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') { recoveryRequested=false; recoveryUserId=null; recoveryExpiresAt=0; clearAccess(); }
  if(session?.user?.id && ['INITIAL_SESSION','SIGNED_IN','TOKEN_REFRESHED','PASSWORD_RECOVERY'].includes(event)) {
    if(memberId && memberId!==session.user.id)clearAccess();
    clearTimeout(expiryTimer);
    if(session.expires_at) {
      expiryTimer=setTimeout(clearAccess,Math.max(0,Math.min(session.expires_at*1000-Date.now(),2147483647)));
      expiryTimer?.unref?.();
    }
    // Never await another Auth call inside the SDK callback (it holds a lock).
    if(event==='SIGNED_IN' && !interactiveAuth)setTimeout(()=>window.dispatchEvent(new Event('bz-auth-changed')),0);
  }
  if (event === 'PASSWORD_RECOVERY' && session?.user?.id && session.expires_at > Date.now()/1000) {
    recoveryRequested = true;
    recoveryUserId = session.user.id;
    recoveryExpiresAt = Math.min(session.expires_at,Date.now()/1000+900);
    window.dispatchEvent(new Event('bz-password-recovery'));
  }
});
export const isPasswordRecovery = () => recoveryRequested && recoveryExpiresAt > Date.now()/1000;
export async function sendPasswordReset(email) {
  check(await client.auth.resetPasswordForEmail(email, {redirectTo:'https://accounting-forum.vercel.app/?recovery=1'}));
}
export async function completePasswordReset(password) {
  const {data:{user},error} = await client.auth.getUser();
  if(error || !user || !isPasswordRecovery() || user.id !== recoveryUserId || authCallbackError) throw Error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.');
  check(await client.auth.updateUser({password}));
  recoveryRequested=false;
  await signOut({scope:'global'});
}
