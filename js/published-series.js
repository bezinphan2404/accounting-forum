export const RETIRED_PARTS = Object.freeze({
  "a68bb0d2-6ffe-4988-ada6-b12ce6404ccb": {
    "parent": "0af14145-39b8-416d-b230-4e884f64b7b0",
    "part": 2
  },
  "e6ce4456-d509-4289-8dcb-bf7f9765f9ca": {
    "parent": "0af14145-39b8-416d-b230-4e884f64b7b0",
    "part": 3
  },
  "e79e3cc4-bb24-4ec7-87ac-fce010bbae1d": {
    "parent": "40fcc5c5-73c4-4091-961e-366fff1fa746",
    "part": 2
  },
  "f8ad919b-2b35-401f-a4bf-1ecda9fd1a7e": {
    "parent": "40fcc5c5-73c4-4091-961e-366fff1fa746",
    "part": 3
  },
  "8bdd5836-7209-485e-a6e9-332ffd72ab9c": {
    "parent": "40fcc5c5-73c4-4091-961e-366fff1fa746",
    "part": 4
  },
  "851bd0da-883b-458b-8f19-30f67b6d9ced": {
    "parent": "40fcc5c5-73c4-4091-961e-366fff1fa746",
    "part": 5
  },
  "67a06d36-0107-4d64-ae4d-195eac688c58": {
    "parent": "97af79e1-15be-44c3-967b-0807c899e731",
    "part": 2
  },
  "9fd210f0-ff19-4d8e-83fe-be51c2d97d05": {
    "parent": "97af79e1-15be-44c3-967b-0807c899e731",
    "part": 3
  },
  "cedf79df-f12a-40c5-a845-86f3dbb97f47": {
    "parent": "97af79e1-15be-44c3-967b-0807c899e731",
    "part": 4
  },
  "39f36445-484b-4193-9ba9-dce7a869338a": {
    "parent": "97af79e1-15be-44c3-967b-0807c899e731",
    "part": 5
  },
  "94d2dd90-5bb2-4225-92ec-efa555c9d0ad": {
    "parent": "97af79e1-15be-44c3-967b-0807c899e731",
    "part": 6
  },
  "6c527b18-6cf8-438d-bb86-017a6a790263": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 2
  },
  "b0fffdb1-d0ae-4ff5-a5c5-4e1ad7dc220e": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 3
  },
  "50587396-26c1-4eef-b135-785857dae0de": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 4
  },
  "1130f38b-739a-4fe3-85b2-12c2c7745681": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 5
  },
  "48992f48-9b23-4a4c-b44e-c6af6abcbd91": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 6
  },
  "fd0c4d4c-40e6-40b9-aaad-a044075e3701": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 7
  },
  "9c5dc4b8-4581-4334-afe0-fee496da42bb": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 8
  },
  "c94480d1-e1ed-4c0f-88f6-60f6fbc69bb0": {
    "parent": "f07c86d4-f745-49ee-ac26-53e319a59a62",
    "part": 9
  }
});

export const retiredPartIds = Object.keys(RETIRED_PARTS);
export function canonicalSeriesRoute(hash) {
  const match=/^#\/thread\/([0-9a-f-]{36})(?:\?part=\d+)?$/i.exec(hash);
  const part=match && RETIRED_PARTS[match[1]];
  return part ? '#/thread/'+part.parent+'?part='+part.part : hash;
}
function inCategory(row,category,categories) {
  if(!category)return true;
  const seen=new Set();let id=row.category_id;
  while(id && !seen.has(id)){if(id===category)return true;seen.add(id);id=categories.find(c=>c.id===id)?.parent_id;}
  return false;
}
export function archivedMatches(rows,{categoryId=null,authorId=null,search=null}={},categories=[]) {
  // Match the existing RPC's PostgreSQL ILIKE pattern, including % and _.
  let pattern=null;
  if(search!==null){let source='';const chars=[...String(search).slice(0,200)];for(let i=0;i<chars.length;i++){
    const c=chars[i];if(c==='\\' && i+1<chars.length){source+=chars[++i].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
    else source+=c==='%'?'.*':c==='_'?'.':c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  }pattern=new RegExp(source,'isu');}
  return rows.filter(r=>inCategory(r,categoryId,categories) && (!authorId || r.author_id===authorId) && (!pattern || pattern.test([r.title,r.content,(r.tags || []).join(' ')].join(' '))));
}
export function adjustSeriesStats(raw,rows,categories) {
  const result={...raw,threads:Math.max(0,Number(raw.threads || 0)-rows.length),categoryCounts:{...raw.categoryCounts}};
  for(const category of categories)result.categoryCounts[category.id]=Math.max(0,Number(raw.categoryCounts?.[category.id] || 0)-archivedMatches(rows,{categoryId:category.id},categories).length);
  return result;
}
export async function visibleThreadPage(fetchPage,{offset=0,hiddenIds=new Set(),hiddenCount=0,cursors=new Map()}={}) {
  let rawOffset=cursors.get(offset) ?? 0;
  let skip=cursors.has(offset)?0:offset;
  const visible=[];let total=0;
  for(;;){const result=await fetchPage(rawOffset);total=Math.max(0,Number(result.total)-hiddenCount);
    for(const row of result.items){rawOffset++;if(hiddenIds.has(row.id))continue;if(skip){skip--;continue;}visible.push(row);if(visible.length===20)break;}
    if(visible.length===20 || !result.items.length || rawOffset>=Number(result.total))break;
  }
  const next=new Map(cursors);next.set(offset+visible.length,rawOffset);if(next.size>100)next.delete(next.keys().next().value);
  return {items:visible,total,cursors:next};
}
