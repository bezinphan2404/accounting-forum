import { createClient } from '@supabase/supabase-js';
const callbackHash = new URLSearchParams(window.location.hash.slice(1));
export const authCallbackError = callbackHash.get('error_code') || '';
let recoveryRequested = false;
let recoveryUserId = null;
let recoveryExpiresAt = 0;
export const client = createClient('https://ywmgvpffyymrmceosqkk.supabase.co', 'sb_publishable_D0xop95jNtFsaabwo8M7qQ_vf3wDnbM');
let activeProfile = null;
let db = { categories: [], users: [], threads: [], replies: [] };
let stats = {threads:0,replies:0,users:0,categories:0,categoryCounts:{}};
let pageInfo = {offset:0,total:0};
const details = new Map();
const check = ({data,error}) => { if(error) throw error; return data; };
const profile = p => ({...p, name:p.name || 'Thành viên', avatar:(p.name || 'TV').split(' ').map(s=>s[0]).join('').slice(0,2), role:p.role || 'member', joinDate:p.created_at});
const thread = t => ({...t,authorId:t.author_id,categoryId:t.category_id,createdAt:t.created_at,views:0,pinned:false,likes:Number(t.likes || 0),replyCount:Number(t.reply_count || 0)});
const reply = r => ({...r,threadId:r.thread_id,authorId:r.author_id,createdAt:r.created_at});
async function loadProfiles(ids) {
  const unique=[...new Set(ids.filter(Boolean))];
  if(!unique.length)return;
  const users=check(await client.rpc('forum_public_profiles',{p_ids:unique}));
  const merged=new Map(db.users.map(p=>[p.id,p]));users.map(profile).forEach(p=>{merged.delete(p.id);merged.set(p.id,p);});
  db.users=[...merged.values()].slice(-150);
}
export async function refreshData() {
  const [categories,counts]=await Promise.all([
    client.from('categories').select('id,name,icon,color').order('id').limit(100), client.rpc('forum_stats')
  ]);
  db.categories=check(categories).map(c=>({...c,color:/^#[0-9a-f]{6}$/i.test(c.color)?c.color:'#457b9d'}));
  stats=check(counts);
}
export async function loadThreadPage({categoryId=null,search=null,authorId=null,sortBy='newest',offset=0}={}) {
  const result=check(await client.rpc('forum_thread_page',{p_category:categoryId,p_search:search,p_author:authorId,p_sort:sortBy,p_offset:offset,p_limit:20}));
  const items=result.items.map(thread);
  await loadProfiles(items.map(t=>t.authorId).concat(authorId || []));
  db.threads=items;pageInfo={offset,total:Number(result.total)};
}
export async function loadThreadDetail(id,offset=0) {
  const [row,comments]=await Promise.all([
    client.rpc('forum_thread_detail',{p_id:id}),
    client.from('replies').select('id,thread_id,author_id,content,created_at').eq('thread_id',id).order('created_at').order('id').range(offset,offset+49)
  ]);
  const t=check(row);if(!t)return null;
  const rs=check(comments).map(reply);
  details.delete(id);details.set(id,thread(t));
  if(details.size>20)details.delete(details.keys().next().value);
  db.replies=offset===0 ? rs : [...db.replies.filter(r=>r.threadId===id),...rs];
  await loadProfiles([t.author_id,...rs.map(r=>r.authorId)]);
  return details.get(id);
}
export async function loadAdminReplies() {
  if(activeProfile?.role!=='admin') throw Error('Không có quyền quản trị.');
  db.replies=check(await client.from('replies').select('id,thread_id,author_id,content,created_at').order('created_at',{ascending:false}).order('id').limit(50)).map(reply);
}
export const getPageInfo=()=>pageInfo;
export async function loadProfile(id) {await loadProfiles([id]);}
export async function getCurrentUser() {
  const {data:{user},error} = await client.auth.getUser();
  if(error || !user) {activeProfile=null;return null;}
  const p=check(await client.from('profiles').select('id,name,bio,created_at').eq('id',user.id).maybeSingle());
  if(!p) throw Error('Hồ sơ chưa sẵn sàng. Vui lòng thử lại.');
  const roles=check(await client.from('forum_roles').select('role').eq('user_id',user.id));
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
  const user=await getCurrentUser();if(!user)throw Error('Vui lòng đăng nhập');
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
  check(await client.auth.signInWithPassword({email,password})); const user=await getCurrentUser(); await refreshData(); return user;
}
export async function signInWithGoogle() {
  check(await client.auth.signInWithOAuth({provider:'google', options:{redirectTo:window.location.origin + '/', queryParams:{prompt:'select_account'}}}));
}
export async function createUser(name,email,password) {
  const {data,error}=await client.auth.signUp({email,password,options:{data:{name}}});
  if(error) return {error:error.message};
  if(!data.session) return {confirmationRequired:true};
  const user=await getCurrentUser(); await refreshData(); return {user};
}
export async function signOut() {check(await client.auth.signOut()); activeProfile=null;recoveryRequested=false;recoveryUserId=null;recoveryExpiresAt=0;}

export async function updateThread(id, title, content, categoryId) {
  const rows=check(await client.from('threads').update({title,content,category_id:categoryId}).eq('id',id).select('id'));
  if(!rows.length) throw Error('Bạn không có quyền sửa bài viết này.');
  await Promise.all([refreshData(),loadThreadDetail(id)]);
}
export async function updateReply(id, content) {
  const rows=check(await client.from('replies').update({content}).eq('id',id).select('id'));
  if(!rows.length) throw Error('Bạn không có quyền sửa bình luận này.');
  await refreshData();
}

client.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') { recoveryRequested=false; recoveryUserId=null; recoveryExpiresAt=0; }
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
  await signOut();
}
