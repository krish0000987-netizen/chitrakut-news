import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Clock, Share2, AlertCircle, ChevronDown } from 'lucide-react';
import { mockLiveUpdates } from '../data/mockNewsData';

export const LivePage: React.FC = () => {
  const [updates, setUpdates] = useState(mockLiveUpdates);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  useEffect(() => {
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Live Header */}
      <div className="bg-red-950 text-white p-6 rounded-xl border border-red-900 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-red-800">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            <div>
              <h1 className="font-serif-title font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
                LIVE NEWS DESK & REAL-TIME BLOG
              </h1>
              <p className="text-xs text-red-200 mt-1">
                Continuous real-time coverage from national and international correspondents
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded font-bold transition-colors ${
                autoRefresh ? 'bg-red-800 text-white border border-red-700' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {autoRefresh ? 'Auto-Update ON' : 'Auto-Update OFF'}
            </button>
            <button
              onClick={handleManualRefresh}
              className="p-2 rounded bg-red-900 hover:bg-red-800 text-white"
              title="Refresh feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-red-300 font-mono">
          <span>Live Editor in Charge: Chitrakoot Jyoti Central Desk</span>
          <span>Last Feed Sync: {lastRefreshed}</span>
        </div>
      </div>

      {/* Main Feed & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Timeline Updates Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative border-l-2 border-red-900 ml-4 pl-6 space-y-8">
            {updates.map((item) => (
              <div key={item.id} className="relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-red-900 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>

                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <span className="font-bold text-red-800 dark:text-red-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.timestamp}</span>
                  </span>
                  {item.isKeyDevelopment && (
                    <span className="bg-red-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      KEY DEVELOPING STORY
                    </span>
                  )}
                </div>

                <h3 className="font-serif-title font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 leading-snug">
                  {item.title}
                </h3>

                <p className="font-serif-body text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.body}
                </p>

                {item.image && (
                  <div className="mt-4 rounded-lg overflow-hidden aspect-video bg-black">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Bureau Source: Verified Feed</span>
                  <button className="hover:text-red-800 flex items-center space-x-1 font-bold">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Update</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info & Important Bulletin */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-xl">
            <h3 className="font-serif-title font-bold text-sm uppercase text-amber-900 dark:text-amber-400 mb-2 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>KEY HIGHLIGHTS SUMMARY</span>
            </h3>
            <ul className="space-y-2 text-xs font-serif-body text-slate-800 dark:text-slate-200">
              <li className="flex items-start space-x-2">
                <span className="text-red-800 font-bold">•</span>
                <span>Parliament debate on technology bill passes second reading.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-800 font-bold">•</span>
                <span>Sensex and Nifty maintain record highs above 22,400 points.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-800 font-bold">•</span>
                <span>ISRO Lunar Mission telemetry test verified successfully.</span>
              </li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
};
