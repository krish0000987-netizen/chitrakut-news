import React, { useEffect, useState } from 'react';
import { breakingNewsService } from '../../services/breakingNews';
import { Plus, Trash2, Edit, Zap, CheckCircle2 } from 'lucide-react';

export const BreakingManager: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ headline:'', link_url:'', priority:0, is_active:true });
  const [editing, setEditing] = useState<string|null>(null);

  const fetch = async ()=>{ const r = await breakingNewsService.listAll(); setList(r); };
  useEffect(()=>{ fetch(); },[]);

  const save = async ()=>{
    if(!form.headline.trim()) return alert('कृपया ब्रेकिंग न्यूज़ हेडलाइन दर्ज करें');
    if(editing) await breakingNewsService.update(editing, form as any);
    else await breakingNewsService.create(form as any);
    setForm({ headline:'', link_url:'', priority:0, is_active:true });
    setEditing(null);
    fetch();
  };

  const remove = async (id:string)=>{
    if(!confirm('क्या आप इस ब्रेकिंग न्यूज़ को हटाना चाहते हैं?')) return;
    await breakingNewsService.remove(id);
    fetch();
  };

  return (
    <div className="space-y-4">
      {/* Form - Black & White High Contrast */}
      <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-sm">
        <h3 className="font-black text-base text-black mb-3 pb-2 border-b border-neutral-200 flex items-center gap-2 font-devanagari">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>{editing ? 'ब्रेकिंग न्यूज़ संपादित करें' : 'नई ब्रेकिंग न्यूज़ जोड़ें'}</span>
        </h3>

        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-black mb-1 font-devanagari">ब्रेकिंग न्यूज़ हेडलाइन *</label>
            <input
              value={form.headline}
              onChange={e=>setForm({...form, headline:e.target.value})}
              placeholder="उदा. मुख्यमंत्री ने भोपाल-चित्रकूट कॉरिडोर का किया शिलान्यास"
              className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-medium text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1 font-devanagari">संबंधित लिंक / यूआरएल</label>
            <input
              value={form.link_url}
              onChange={e=>setForm({...form, link_url:e.target.value})}
              placeholder="/article/chitrakoot-news"
              className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-mono text-xs focus:outline-none"
            />
          </div>

          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-xs font-bold text-black mb-1 font-devanagari">प्राथमिकता</label>
              <input
                type="number"
                value={form.priority}
                onChange={e=>setForm({...form, priority: parseInt(e.target.value)||0})}
                className="w-20 px-3 py-2 rounded-xl border-2 border-black bg-white text-black font-bold text-xs focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-black cursor-pointer pb-2.5 font-devanagari">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e=>setForm({...form, is_active:e.target.checked})}
                className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer"
              />
              <span>सक्रिय</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={save}
            className="px-6 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black shadow transition-colors font-devanagari"
          >
            {editing ? 'अपडेट करें (Update)' : 'सहेजें एवं लाइव करें (Save)'}
          </button>
          {editing && (
            <button
              onClick={()=>{ setEditing(null); setForm({ headline:'', link_url:'', priority:0, is_active:true }); }}
              className="px-4 py-2 border-2 border-black bg-white text-black rounded-xl text-xs font-bold font-devanagari hover:bg-neutral-100"
            >
              रद्द करें
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
        <div className="p-3.5 bg-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-between font-devanagari">
          <span>सक्रिय ब्रेकिंग न्यूज़ सूची ({list.length})</span>
          <span className="text-[11px] text-neutral-300 font-normal">वेबसाइट पर लाइव टिकर</span>
        </div>

        <table className="w-full text-xs">
          <thead className="bg-neutral-100 text-[11px] uppercase font-black text-black border-b-2 border-black">
            <tr>
              <th className="p-3 text-left font-devanagari">हेडलाइन</th>
              <th className="p-3 text-center font-devanagari">प्राथमिकता</th>
              <th className="p-3 text-center font-devanagari">स्थिति</th>
              <th className="p-3 text-center font-devanagari">कार्य (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {list.map(b=>(
              <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                <td className="p-3 font-bold text-black font-devanagari text-sm">
                  {b.headline}
                  {b.link_url && <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{b.link_url}</p>}
                </td>
                <td className="p-3 text-center font-bold text-black font-mono">{b.priority}</td>
                <td className="p-3 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${
                    b.is_active ? 'border-black bg-black text-white' : 'border-neutral-300 bg-neutral-200 text-neutral-700'
                  }`}>
                    {b.is_active ? 'सक्रिय (Live)' : 'निष्क्रिय'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1.5 justify-center">
                    <button
                      onClick={()=>{ setForm({ headline:b.headline, link_url:b.link_url||'', priority:b.priority, is_active:b.is_active}); setEditing(b.id); }}
                      className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg border border-neutral-300 text-black transition-colors"
                      title="संपादित करें"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={()=>remove(b.id)}
                      className="p-1.5 bg-white hover:bg-red-600 hover:text-white rounded-lg border border-red-300 text-red-600 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-neutral-600 font-medium font-devanagari">
        सक्रिय ब्रेकिंग न्यूज़ वेबसाइट के शीर्ष टिकर पर तुरंत स्क्रॉल होने लगेगी।
      </p>
    </div>
  );
};
