import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { articlesService, DbArticle } from '../../services/articles';
import { Search, Plus, Edit, Trash2, Eye, Copy, CheckSquare, FileText } from 'lucide-react';

export const ArticlesList: React.FC = () => {
  const [params] = useSearchParams();
  const statusFilter = params.get('status') || '';
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await articlesService.list({ status: statusFilter as any || undefined, search: search || undefined, limit: 50, order: 'updated_at' });
      setArticles(data);
    } catch {}
    setLoading(false);
  };
  useEffect(()=>{ fetch(); }, [statusFilter]);

  const toggleSelect = (id:string)=>{ const n=new Set(selected); if(n.has(id)) n.delete(id); else n.add(id); setSelected(n); };
  const bulkPublish = async ()=>{ if(!selected.size) return; if(!confirm(`क्या आप ${selected.size} समाचारों को प्रकाशित करना चाहते हैं?`)) return; await articlesService.bulkUpdate([...selected], { status: 'published', published_at: new Date().toISOString() } as any); setSelected(new Set()); fetch(); };
  const bulkDelete = async ()=>{ if(!selected.size) return; if(!confirm(`क्या आप ${selected.size} समाचारों को हमेशा के लिए हटाना चाहते हैं?`)) return; for(const id of selected) await articlesService.remove(id); setSelected(new Set()); fetch(); };
  const duplicate = async (a:DbArticle)=>{ const payload={...a, id:undefined, slug: a.slug+'-copy-'+Date.now(), title: a.title+' (प्रतिलिपि)', status:'draft' as const, published_at: undefined} as any; delete payload.id; delete payload.created_at; delete payload.updated_at; await articlesService.create(payload); fetch(); };
  const del = async (id:string)=>{ if(!confirm('क्या आप इस समाचार को हटाना चाहते हैं?')) return; await articlesService.remove(id); fetch(); };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar - Black & White */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between bg-white p-3.5 rounded-2xl border-2 border-black shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&fetch()}
              placeholder="समाचार शीर्षक खोजें..."
              className="pl-9 pr-3 py-2 rounded-xl border-2 border-black bg-white text-black text-xs font-bold w-60 sm:w-72 focus:outline-none"
            />
          </div>
          <button onClick={fetch} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors">
            खोजें
          </button>
          <select
            value={statusFilter}
            onChange={e=>window.location.href=`/admin/articles${e.target.value?`?status=${e.target.value}`:''}`}
            className="px-3 py-2 border-2 border-black rounded-xl bg-white text-black text-xs font-bold focus:outline-none"
          >
            <option value="">सभी स्थिति (All)</option>
            <option value="published">प्रकाशित (Published)</option>
            <option value="draft">ड्राफ्ट (Draft)</option>
            <option value="scheduled">शेड्यूल्ड (Scheduled)</option>
            <option value="archived">आर्काइव्ड (Archived)</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {selected.size > 0 && (
            <>
              <button onClick={bulkPublish} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow">
                प्रकाशित करें ({selected.size})
              </button>
              <button onClick={bulkDelete} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow">
                हटाएं ({selected.size})
              </button>
            </>
          )}
          <Link
            to="/admin/articles/new"
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow transition-colors font-devanagari"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>नया समाचार लिखें</span>
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i=><div key={i} className="h-16 bg-white rounded-xl border-2 border-black animate-pulse" />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-black p-12 text-center shadow-sm">
          <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <p className="font-black text-black text-base font-devanagari">कोई समाचार लेख नहीं मिला</p>
          <p className="text-xs text-neutral-600 mt-1 font-devanagari">न्यूज़रूम से अपना पहला समाचार लेख लिखें।</p>
          <Link to="/admin/articles/new" className="mt-3 inline-block bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black font-devanagari">
            + नया समाचार जोड़ें
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-neutral-100 text-[11px] uppercase tracking-wider font-black text-black border-b-2 border-black">
                <tr>
                  <th className="p-3 text-center"><CheckSquare className="w-4 h-4 mx-auto" /></th>
                  <th className="p-3 text-left font-devanagari">समाचार शीर्षक</th>
                  <th className="p-3 text-center font-devanagari">श्रेणी</th>
                  <th className="p-3 text-center font-devanagari">स्थिति</th>
                  <th className="p-3 text-center font-devanagari">व्यूज</th>
                  <th className="p-3 text-center font-devanagari">प्रकाशन तिथि</th>
                  <th className="p-3 text-center font-devanagari">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(a.id)}
                        onChange={()=>toggleSelect(a.id)}
                        className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={a.hero_image_url || '/assets/logo.jpg'}
                          alt=""
                          className="w-14 h-10 object-cover rounded border-2 border-black shrink-0 bg-white"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-black line-clamp-1 font-devanagari">{a.title}</p>
                          <p className="text-[11px] text-neutral-600 line-clamp-1 font-mono mt-0.5">
                            {a.slug} • {a.is_breaking ? '🔴 ब्रेकिंग' : ''} {a.is_featured ? '⭐ मुख्य खबर' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-black font-devanagari">
                      {(a as any).categories?.name_hi || (a as any).categories?.name || 'सामान्य'}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${
                        a.status === 'published'
                          ? 'border-black bg-black text-white'
                          : a.status === 'draft'
                          ? 'border-neutral-400 bg-neutral-200 text-black'
                          : 'border-blue-600 bg-blue-100 text-blue-900'
                      }`}>
                        {a.status === 'published' ? 'प्रकाशित' : a.status === 'draft' ? 'ड्राफ्ट' : 'शेड्यूल्ड'}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold font-mono text-black">{a.views_count || 0}</td>
                    <td className="p-3 text-center text-[11px] font-bold text-neutral-800">
                      {a.published_at ? new Date(a.published_at).toLocaleDateString('hi-IN') : 'अप्रकाशित'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 justify-center">
                        <Link
                          to={`/article/${a.slug}`}
                          target="_blank"
                          className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg border border-neutral-300 text-black transition-colors"
                          title="देखें"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/articles/${a.id}/edit`}
                          className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg border border-neutral-300 text-black transition-colors"
                          title="संपादित करें"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={()=>duplicate(a)}
                          className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg border border-neutral-300 text-black transition-colors"
                          title="कॉपी बनाएं"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={()=>del(a.id)}
                          className="p-1.5 bg-white hover:bg-red-600 hover:text-white rounded-lg border border-red-300 text-red-600 transition-colors"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
