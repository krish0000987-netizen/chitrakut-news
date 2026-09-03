import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Clock, Zap, Newspaper, TrendingUp, BarChart3, PlusCircle, Upload, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ total:0, published:0, draft:0, scheduled:0, breaking:0, epapers:0, views:0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(()=>{
    (async()=>{
      const [{count: total}, {count: published}, {count: draft}, {count: scheduled}, {count: breaking}, {count: epapers}] = await Promise.all([
        supabase.from('articles').select('*', { count:'exact', head:true }),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('status','published'),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('status','draft'),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('status','scheduled'),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('is_breaking', true),
        supabase.from('epapers').select('*', { count:'exact', head:true }),
      ]);
      const { data: rec } = await supabase.from('articles').select('id,title,slug,status,published_at,views_count').order('updated_at',{ascending:false}).limit(6);
      const { data: agg } = await supabase.from('articles').select('views_count');
      const views = (agg as any[] | null)?.reduce((s,r)=>s+(r.views_count||0),0) || 0;
      setStats({ total: total||0, published: published||0, draft: draft||0, scheduled: scheduled||0, breaking: breaking||0, epapers: epapers||0, views });
      setRecent(rec || []);
    })();
  },[]);

  const cards = [
    { label:'कुल लेख', value: stats.total, icon: FileText, color: 'text-[#8B0000]', bg: 'bg-red-50' },
    { label:'प्रकाशित लेख', value: stats.published, icon: Eye, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label:'ड्राफ्ट लेख', value: stats.draft, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label:'शेड्यूल्ड लेख', value: stats.scheduled, icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label:'ब्रेकिंग न्यूज़', value: stats.breaking, icon: Zap, color: 'text-[#8B0000]', bg: 'bg-red-50' },
    { label:'ई-पेपर संस्करण', value: stats.epapers, icon: Newspaper, color: 'text-purple-700', bg: 'bg-purple-50' },
    { label:'कुल पाठक व्यूज', value: stats.views.toLocaleString('hi-IN'), icon: TrendingUp, color: 'text-[#8B0000]', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards - Red Themed */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map(c=>{
          const Icon=c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border-2 border-red-100 p-4 shadow-xs hover:border-[#8B0000] hover:shadow-md transition-all">
              <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-2.5 shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">{c.value}</p>
              <p className="text-[11px] font-bold text-slate-700 mt-2 font-devanagari tracking-wide">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Articles Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-red-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-[#8B0000] flex items-center gap-2 font-devanagari">
              <BarChart3 className="w-5 h-5 text-[#8B0000]" /> हाल ही में जोड़े गए समाचार
            </h3>
            <Link to="/admin/articles" className="text-xs font-bold text-[#8B0000] hover:underline font-devanagari">
              सभी देखें →
            </Link>
          </div>

          <div className="space-y-2">
            {recent.length ? recent.map(r=>(
              <Link
                key={r.id}
                to={`/admin/articles/${r.id}/edit`}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#8B0000] hover:bg-red-50/40 transition-all"
              >
                <div className="flex-1 pr-3 min-w-0">
                  <p className="font-bold text-sm text-slate-900 line-clamp-1 font-devanagari">{r.title}</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {r.status === 'published' ? '🟢 प्रकाशित' : r.status === 'draft' ? '🟡 ड्राफ्ट' : '🔵 शेड्यूल्ड'} • {r.published_at ? new Date(r.published_at).toLocaleDateString('hi-IN') : 'अप्रकाशित'} • <span className="font-mono font-bold text-[#8B0000]">{r.views_count || 0}</span> व्यूज
                  </p>
                </div>
                <span className="text-[11px] font-black px-2.5 py-1 rounded-full border border-[#8B0000] bg-[#8B0000] text-white shrink-0">
                  संपादित करें
                </span>
              </Link>
            )) : (
              <div className="text-center py-10">
                <p className="text-sm font-bold text-slate-600 font-devanagari">अभी कोई लेख उपलब्ध नहीं है</p>
                <Link to="/admin/articles/new" className="inline-block mt-2 px-4 py-2 bg-[#8B0000] hover:bg-[#700000] text-white rounded-xl text-xs font-black">
                  + पहला समाचार लेख लिखें
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs">
            <h3 className="font-black text-base text-slate-900 mb-3 border-b border-slate-100 pb-2 font-devanagari">
              त्वरित कार्य (Quick Actions)
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link to="/admin/articles/new" className="bg-[#8B0000] hover:bg-[#700000] text-white p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all shadow-xs hover:shadow">
                <PlusCircle className="w-5 h-5 text-amber-300" />
                <span className="font-devanagari">नया समाचार लिखें</span>
              </Link>
              <Link to="/admin/epaper" className="bg-red-50 hover:bg-red-100 text-[#8B0000] border border-red-200 p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <Upload className="w-5 h-5 text-[#8B0000]" />
                <span className="font-devanagari">ई-पेपर अपलोड</span>
              </Link>
              <Link to="/admin/breaking-news" className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="font-devanagari">ब्रेकिंग न्यूज़</span>
              </Link>
              <Link to="/admin/media" className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <FileText className="w-5 h-5 text-slate-700" />
                <span className="font-devanagari">मीडिया लाइब्रेरी</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs">
            <p className="font-black text-sm text-[#8B0000] flex items-center gap-1.5 font-devanagari mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B0000]" /> दैनिक न्यूज़रूम चेकलिस्ट
            </p>
            <ul className="space-y-2 text-xs font-bold text-slate-800 font-devanagari">
              <li className="flex items-center gap-2 p-2 bg-red-50/50 border border-red-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-[#8B0000] shrink-0"></span>
                <span>आज का ई-पेपर पीडीएफ अपलोड करें</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-red-50/50 border border-red-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-[#8B0000] shrink-0"></span>
                <span>सुबह की प्रमुख खबरें प्रकाशित करें</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-red-50/50 border border-red-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-[#8B0000] shrink-0"></span>
                <span>ब्रेकिंग न्यूज़ टिकर अपडेट करें</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
