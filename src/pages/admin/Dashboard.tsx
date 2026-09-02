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
    { label:'कुल लेख', value: stats.total, icon: FileText },
    { label:'प्रकाशित लेख', value: stats.published, icon: Eye },
    { label:'ड्राफ्ट लेख', value: stats.draft, icon: Clock },
    { label:'शेड्यूल्ड लेख', value: stats.scheduled, icon: Clock },
    { label:'ब्रेकिंग न्यूज़', value: stats.breaking, icon: Zap },
    { label:'ई-पेपर संस्करण', value: stats.epapers, icon: Newspaper },
    { label:'कुल पाठक व्यूज', value: stats.views.toLocaleString('hi-IN'), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards - Black & White High Contrast */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map(c=>{
          const Icon=c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border-2 border-black p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center mb-2.5">
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-black leading-none">{c.value}</p>
              <p className="text-[11px] font-bold text-neutral-800 mt-2 font-devanagari tracking-wide">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Articles Table - Crisp Black & White */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-black p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
            <h3 className="font-black text-base text-black flex items-center gap-2 font-devanagari">
              <BarChart3 className="w-5 h-5 text-black" /> हाल ही में जोड़े गए समाचार
            </h3>
            <Link to="/admin/articles" className="text-xs font-bold text-black hover:underline font-devanagari">
              सभी देखें →
            </Link>
          </div>

          <div className="space-y-2">
            {recent.length ? recent.map(r=>(
              <Link
                key={r.id}
                to={`/admin/articles/${r.id}/edit`}
                className="flex items-center justify-between p-3 rounded-xl border border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all"
              >
                <div className="flex-1 pr-3 min-w-0">
                  <p className="font-bold text-sm text-black line-clamp-1 font-devanagari">{r.title}</p>
                  <p className="text-xs text-neutral-700 font-medium mt-0.5">
                    {r.status === 'published' ? '🟢 प्रकाशित' : r.status === 'draft' ? '🟡 ड्राफ्ट' : '🔵 शेड्यूल्ड'} • {r.published_at ? new Date(r.published_at).toLocaleDateString('hi-IN') : 'अप्रकाशित'} • <span className="font-mono font-bold text-black">{r.views_count || 0}</span> व्यूज
                  </p>
                </div>
                <span className="text-[11px] font-black px-2.5 py-1 rounded-full border border-black bg-black text-white shrink-0">
                  संपादित करें
                </span>
              </Link>
            )) : (
              <div className="text-center py-10">
                <p className="text-sm font-bold text-neutral-700 font-devanagari">अभी कोई लेख उपलब्ध नहीं है</p>
                <Link to="/admin/articles/new" className="inline-block mt-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-black">
                  + पहला समाचार लेख लिखें
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-sm">
            <h3 className="font-black text-base text-black mb-3 border-b border-neutral-200 pb-2 font-devanagari">
              त्वरित कार्य (Quick Actions)
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link to="/admin/articles/new" className="bg-black hover:bg-neutral-800 text-white p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span className="font-devanagari">नया समाचार लिखें</span>
              </Link>
              <Link to="/admin/epaper" className="bg-white hover:bg-neutral-100 text-black border-2 border-black p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <Upload className="w-5 h-5 text-black" />
                <span className="font-devanagari">ई-पेपर अपलोड</span>
              </Link>
              <Link to="/admin/breaking-news" className="bg-white hover:bg-neutral-100 text-black border-2 border-black p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="font-devanagari">ब्रेकिंग न्यूज़</span>
              </Link>
              <Link to="/admin/media" className="bg-white hover:bg-neutral-100 text-black border-2 border-black p-3.5 rounded-xl text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-colors">
                <FileText className="w-5 h-5 text-black" />
                <span className="font-devanagari">मीडिया लाइब्रेरी</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-sm">
            <p className="font-black text-sm text-black flex items-center gap-1.5 font-devanagari mb-2">
              <CheckCircle2 className="w-4 h-4 text-black" /> दैनिक न्यूज़रूम चेकलिस्ट
            </p>
            <ul className="space-y-2 text-xs font-bold text-neutral-900 font-devanagari">
              <li className="flex items-center gap-2 p-2 bg-neutral-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-black shrink-0"></span>
                <span>आज का ई-पेपर पीडीएफ अपलोड करें</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-neutral-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-black shrink-0"></span>
                <span>सुबह की प्रमुख खबरें प्रकाशित करें</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-neutral-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-black shrink-0"></span>
                <span>ब्रेकिंग न्यूज़ टिकर अपडेट करें</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
