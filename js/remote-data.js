import { createClient } from '@supabase/supabase-js';
const callbackHash = new URLSearchParams(window.location.hash.slice(1));
export const authCallbackError = callbackHash.get('error_code') || '';
let recoveryRequested = callbackHash.get('type') === 'recovery' || new URLSearchParams(window.location.search).get('recovery') === '1';
export const client = createClient('https://ywmgvpffyymrmceosqkk.supabase.co', 'sb_publishable_D0xop95jNtFsaabwo8M7qQ_vf3wDnbM');
let activeProfile = null;
let db = { categories: [], users: [], threads: [], replies: [] };
const check = ({data,error}) => { if(error) throw error; return data; };
const profile = p => ({...p, avatar:p.name.split(' ').map(s=>s[0]).join('').slice(0,2), role:'member', joinDate:p.created_at});
export async function refreshData() {
  const results = await Promise.all(['categories','profiles','threads','replies','thread_likes'].map(t=>client.from(t).select('*')));
  const [categories,users,threads,replies,likes] = results.map(check);
  db = {categories, users:users.map(profile), threads:threads.map(t=>({...t,authorId:t.author_id,categoryId:t.category_id,createdAt:t.created_at,views:0,pinned:false,likes:likes.filter(l=>l.thread_id===t.id).length})), replies:replies.map(r=>({...r,threadId:r.thread_id,authorId:r.author_id,createdAt:r.created_at}))};
}
export async function getCurrentUser() {
  const {data:{user},error} = await client.auth.getUser();
  if(error || !user) return null;
  let p = check(await client.from('profiles').select('*').eq('id',user.id).maybeSingle());
  if(!p) p = check(await client.from('profiles').insert({id:user.id,name:(user.user_metadata.name || 'Thành viên').slice(0,100)}).select().single());
  const roles = check(await client.from('forum_roles').select('role').eq('user_id', user.id));
  activeProfile = {...profile(p), role: roles[0]?.role || 'member'};
  return activeProfile;
}
export const getDB = ()=>db;
export const getCategories = ()=>db.categories;
export const getCategoryById = id=>db.categories.find(c=>c.id===id);
export const getThreadCountByCategory = id=>db.threads.filter(t=>t.categoryId===id).length;
export const getUsers = ()=>db.users;
export const getUserById = id=>activeProfile?.id === id ? activeProfile : db.users.find(u=>u.id===id);
export function getThreads({categoryId,sortBy='newest',search}={}) {
  return db.threads.filter(t=>(!categoryId||t.categoryId===categoryId)&&(!search||[t.title,t.content,...t.tags].join(' ').toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>sortBy==='most-liked'?b.likes-a.likes:new Date(b.createdAt)-new Date(a.createdAt));
}
export const getThreadById = id=>db.threads.find(t=>t.id===id);
export async function createThread({title,content,categoryId,tags}) {
  const user=await getCurrentUser(); if(!user) throw Error('Vui lòng đăng nhập');
  const t=check(await client.from('threads').insert({title,content,category_id:categoryId,tags,author_id:user.id}).select().single());
  await refreshData(); return t;
}
export const incrementViews = ()=>{};
export async function toggleLike(threadId) {
  const user=await getCurrentUser(); if(!user) throw Error('Vui lòng đăng nhập để yêu thích bài viết');
  const existing=check(await client.from('thread_likes').select('thread_id').eq('thread_id',threadId).eq('user_id',user.id));
  check(existing.length?await client.from('thread_likes').delete().eq('thread_id',threadId).eq('user_id',user.id):await client.from('thread_likes').insert({thread_id:threadId,user_id:user.id}));
  await refreshData();
}
export const getReplies = id=>db.replies.filter(r=>r.threadId===id).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
export async function createReply({threadId,content}) {
  const user=await getCurrentUser(); if(!user) throw Error('Vui lòng đăng nhập');
  check(await client.from('replies').insert({thread_id:threadId,content,author_id:user.id})); await refreshData();
}
export const getReplyCount = id=>getReplies(id).length;
export const getStats = ()=>({threads:db.threads.length,replies:db.replies.length,users:db.users.length,categories:db.categories.length});
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
export async function signOut() {check(await client.auth.signOut()); activeProfile=null;}

export async function updateThread(id, title, content, categoryId) {
  const rows=check(await client.from('threads').update({title,content,category_id:categoryId}).eq('id',id).select('id'));
  if(!rows.length) throw Error('Bạn không có quyền sửa bài viết này.');
  await refreshData();
}
export async function updateReply(id, content) {
  const rows=check(await client.from('replies').update({content}).eq('id',id).select('id'));
  if(!rows.length) throw Error('Bạn không có quyền sửa bình luận này.');
  await refreshData();
}

client.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    recoveryRequested = true;
    window.dispatchEvent(new Event('bz-password-recovery'));
  }
});
export const isPasswordRecovery = () => recoveryRequested;
export async function sendPasswordReset(email) {
  check(await client.auth.resetPasswordForEmail(email, {redirectTo:'https://accounting-forum.vercel.app/?recovery=1'}));
}
export async function completePasswordReset(password) {
  const {data:{user},error} = await client.auth.getUser();
  if(error || !user || !recoveryRequested || authCallbackError) throw Error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.');
  check(await client.auth.updateUser({password}));
  recoveryRequested=false;
  await signOut();
}
