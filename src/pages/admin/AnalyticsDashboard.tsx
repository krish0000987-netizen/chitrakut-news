import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics';
import { supabase } from '../../lib/supabase';
import { BarChart3, Eye, Newspaper, Search, MousePointer, TrendingUp, Calendar } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [range, setRange]=useState(7);
  const [summary, setSummary]=useState<any>(null);
  const [recent, setRecent]=useState<any[]>([]);
  const [top, setTop]=useState<any[]>([]);
  const [articleTitles, setArticleTitles]=useState<Record<string,string>>({});
  const [loading, setLoading]=useState(true);

  const fetchData=async()=>{
    setLoading(true);
    try{
      const [s, r, t]=await Promise.all([
        analyticsService.summary(range),
        analyticsService.listRecent(20),
        analyticsService.topArticles(5)
      ]);
      setSummary(s);
      setRecent(r);
      setTop(t as any);
      // fetch article titles for top
      if(t.length){
        const ids=(t as any[]).map(x=>x[0]);
        const { data }=await supabase.from('articles').select('id,title').in('id',ids);
        const map:Record<string,string>={};
        (data as any[])?.forEach(a=> map[a.id]=a.title);
        setArticleTitles(map);
      }
    }catch(e){ console.error(e); }
    setLoading(false);
  };
  useEffect(()=>{ fetchData(); },[range]);

  const total=s=> s||0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#8B0000]" />
        <div>
          <h1 className="font-black text-xl">Analytics</h1>
          <p className="text-xs text-slate-500">Page views, article views, e-paper views, searches, ad views/clicks from analytics_events. Real data — empty state shown when no events.</p>
        </div>
        <select value={range} onChange={e=>setRange(parseInt(e.target.value))} className="ml-auto px-3 py-2 border rounded-xl bg-white text-xs font-bold">
          <option value={1}>Today</option><option value={2}>Last 2 days</option><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option>
        </select>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label:'Total Views', value: summary?.total||0, icon: Eye, color:'bg-slate-900' },
              { label:'Page Views', value: summary?.byType?.page_view||0, icon: TrendingUp, color:'bg-[#8B0000]' },
              { label:'Article Views', value: summary?.byType?.article_view||0, icon: Newspaper, color:'bg-emerald-700' },
              { label:'E-Paper Views', value: summary?.byType?.epaper_view||0, icon: Eye, color:'bg-blue-700' },
              { label:'E-Paper DL', value: summary?.byType?.epaper_download||0, icon: Eye, color:'bg-violet-700' },
              { label:'Searches', value: summary?.byType?.search||0, icon: Search, color:'bg-amber-600' },
              { label:'Ad Clicks', value: summary?.byType?.ad_click||0, icon: MousePointer, color:'bg-amber-500' },
            ].map(c=>{
              const Icon=c.icon;
              return (
                <div key={c.label} className="bg-white dark:bg-slate-900 rounded-2xl border p-3">
                  <div className={`w-7 h-7 rounded-lg ${c.color} text-white flex items-center justify-center mb-1`}><Icon className="w-3.5 h-3.5"/></div>
                  <p className="text-xl font-black">{total(c.value)}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border p-4">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> Views by Day (last {range}d)</h3>
              {summary?.byDay && Object.keys(summary.byDay).length ? (
                <div className="space-y-1.5">
                  {Object.entries(summary.byDay).sort().map(([day, cnt]:any)=>(
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-[11px] font-mono w-24">{day}</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8B0000]" style={{ width: `${Math.min(100, (Number(cnt) / Math.max(...(Object.values(summary.byDay as Record<string, number>).map(Number)), 1))*100)}%` }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right">{cnt}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-500 py-6 text-center">No events in this range. Events are tracked via analyticsService.track() on article_view, epaper_view etc. Trigger by visiting public pages.</p>}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4">
              <h3 className="font-black text-sm mb-3">Top Articles (views)</h3>
              {top.length ? <ul className="space-y-2">
                {top.map(([aid, cnt]:any)=>(
                  <li key={aid} className="flex justify-between items-center p-2 border rounded-xl">
                    <span className="text-xs font-bold line-clamp-1 flex-1 pr-2">{articleTitles[aid]||aid.slice(0,8)}</span>
                    <span className="text-xs font-black bg-slate-900 text-white px-2 py-1 rounded-full">{cnt}</span>
                  </li>
                ))}
              </ul> : <p className="text-xs text-slate-500 py-6 text-center">No article views yet. Visit /article/:slug to generate events.</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4">
            <h3 className="font-black text-sm mb-3">Recent Events</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-2 text-left">Time</th><th className="p-2">Event</th><th className="p-2">Article</th><th className="p-2">E-Paper</th></tr></thead>
                <tbody>
                  {recent.length===0 ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">No events tracked yet.</td></tr>
                  : recent.map(r=>(
                    <tr key={r.id} className="border-t">
                      <td className="p-2 font-mono text-[11px]">{new Date(r.created_at).toLocaleString('en-IN')}</td>
                      <td className="p-2 text-center"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black uppercase">{r.event_type}</span></td>
                      <td className="p-2 font-mono text-[11px] text-center">{r.article_id?.slice(0,8)||'-'}</td>
                      <td className="p-2 font-mono text-[11px] text-center">{r.epaper_id?.slice(0,8)||'-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      }
    </div>
  );
};
