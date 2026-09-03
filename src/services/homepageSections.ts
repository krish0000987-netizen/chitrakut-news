import { supabase } from '../lib/supabase';
export interface DbSection { id:string; title:string; title_hi?:string; slug:string; section_type:string; layout_type:string; category_id?:string|null; display_order:number; is_enabled:boolean; item_count:number; settings?:any; created_at:string; updated_at?:string; }
const LS='cj_homepage_db';
const seed:DbSection[]=[
  {id:'sec-hero',title:'Hero',title_hi:'मुखपृष्ठ',slug:'hero',section_type:'hero',layout_type:'hero_grid',display_order:1,is_enabled:true,item_count:5,created_at:new Date().toISOString()},
  {id:'sec-latest',title:'Latest News',title_hi:'ताजा खबरें',slug:'latest',section_type:'latest',layout_type:'three_column',display_order:2,is_enabled:true,item_count:6,created_at:new Date().toISOString()},
  {id:'sec-pradesh',title:'State News',title_hi:'प्रदेश',slug:'pradesh',section_type:'regional',layout_type:'three_column',display_order:3,is_enabled:true,item_count:4,created_at:new Date().toISOString()},
];
function getLocal():DbSection[]{ try{const r=localStorage.getItem(LS); if(r) return JSON.parse(r); localStorage.setItem(LS,JSON.stringify(seed)); return seed;}catch{return seed} }
function setLocal(d:DbSection[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
export const homepageService={
  async list(){ return trySupabase(async()=>{const {data,error}=await supabase.from('homepage_sections').select('*').order('display_order'); if(error) throw error; return data as DbSection[];}, getLocal().sort((a,b)=>a.display_order-b.display_order)); },
  async listEnabled(){ const all=await homepageService.list(); return all.filter(x=>x.is_enabled); },
  async create(payload:Partial<DbSection>){ return trySupabase(async()=>{const {data,error}=await supabase.from('homepage_sections').insert(payload).select().single(); if(error) throw error; return data as DbSection;}, (()=>{
    const l=getLocal(); const n:DbSection={id:'sec-'+Date.now(), title:payload.title||'New Section', slug:payload.slug||'sec-'+Date.now(), section_type:(payload.section_type as any)||'latest', layout_type:(payload.layout_type as any)||'three_column', display_order:l.length+1, is_enabled:true, item_count:4, created_at:new Date().toISOString(), ...payload} as DbSection; l.push(n); setLocal(l); return n;
  })()); },
  async update(id:string,payload:Partial<DbSection>){ return trySupabase(async()=>{const {data,error}=await supabase.from('homepage_sections').update({...payload, updated_at:new Date().toISOString()} as any).eq('id',id).select().single(); if(error) throw error; return data as DbSection;}, (()=>{
    const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i]={...l[i],...payload} as DbSection; setLocal(l); return l[i]; } throw new Error('Not found');
  })()); },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('homepage_sections').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async reorder(ids:string[]){ return trySupabase(async()=>{ for(let i=0;i<ids.length;i++){ await supabase.from('homepage_sections').update({display_order:i+1} as any).eq('id',ids[i]); }}, (()=>{
    const l=getLocal(); const map=new Map(l.map(x=>[x.id,x])); const ordered:DbSection[]=[]; ids.forEach((id,i)=>{ const it=map.get(id); if(it){ it.display_order=i+1; ordered.push(it); }}); l.forEach(x=>{ if(!ids.includes(x.id)) ordered.push(x); }); setLocal(ordered);
  })() as any); },
  async toggle(id:string, enabled:boolean){ return homepageService.update(id,{is_enabled:enabled}); }
};
