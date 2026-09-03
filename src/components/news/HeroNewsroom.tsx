import React from 'react';
import { useNews } from '../../context/NewsContext';
import { StoryCard } from './StoryCard';
import { TrendingUp, Flame, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroNewsroom: React.FC = () => {
  const { articles } = useNews();

  // Find lead hero story or fallback to first article
  const leadStory = articles.find(a => a.isLeadHero) || articles[0];
  const secondaryStories = articles.filter(a => a.id !== leadStory.id).slice(0, 4);

  if (!leadStory) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-900">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-red-700 dark:text-red-500" />
          <h2 className="font-serif-title font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            TOP HEADLINES & BREAKING NEWS
          </h2>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase hidden sm:inline">
          दैनिक डिजिटल संस्करण
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8 cols): Main Lead Breaking Story */}
        <div className="lg:col-span-8">
          <StoryCard article={leadStory} variant="lead" />
        </div>

        {/* Right Col (4 cols): Secondary Stories Stack */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-red-800 dark:text-red-400 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>KEY DEVELOPMENTS</span>
              </h3>
              <Link to="/latest" className="text-[11px] text-slate-500 hover:text-red-700 font-semibold flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-1">
              {secondaryStories.map(art => (
                <StoryCard key={art.id} article={art} variant="compact" />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 rounded text-center">
            <span className="text-xs font-serif-title font-semibold text-slate-700 dark:text-slate-300 block">
              Want real-time updates?
            </span>
            <Link
              to="/live"
              className="inline-flex items-center space-x-1 text-xs font-bold text-red-800 dark:text-red-400 hover:underline mt-1"
            >
              <span>Follow the Live Newsroom Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
