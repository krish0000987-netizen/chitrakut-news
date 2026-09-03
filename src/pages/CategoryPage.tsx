import React, { useState } from 'react';
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { StoryCard } from '../components/news/StoryCard';
import { AdvertisementSlot } from '../components/common/AdvertisementSlot';
import { SlidersHorizontal, MapPin } from 'lucide-react';

interface CategoryPageProps { defaultCategory?: string; }

const mpCities = ['सभी शहर', 'भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर', 'सतना', 'सागर', 'हरदा', 'विदिशा', 'नरसिंहपुर'];

const hindiMap: Record<string, { en: string[], label: string }> = {
  'देश-विदेश': { en: ['india','world','national'], label: 'देश-विदेश' },
  'देश विदेश': { en: ['india','world'], label: 'देश-विदेश' },
  'प्रदेश': { en: ['state','city','madhya','bhopal','indore'], label: 'प्रदेश' },
  'खेल': { en: ['cricket','sports'], label: 'खेल' },
  'धर्म': { en: ['culture','festival','religion'], label: 'धर्म' },
  'मनोरंजन': { en: ['entertainment','bollywood'], label: 'मनोरंजन' },
  'विचार': { en: ['opinion','explainer','politics','editorial'], label: 'विचार' },
  'लाइफस्टाइल & हेल्थ': { en: ['lifestyle','health','wellness'], label: 'लाइफस्टाइल & हेल्थ' },
  'लाइफस्टाइल': { en: ['lifestyle','health'], label: 'लाइफस्टाइल & हेल्थ' },
  'टेक': { en: ['technology','tech','ai','automobile','startup'], label: 'टेक' },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ defaultCategory }) => {
  const { categorySlug: paramSlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { articles } = useNews();
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const selectedCity = searchParams.get('city') || 'सभी शहर';

  const rawSlug = paramSlug || defaultCategory || location.pathname.replace(/^\//, '');
  const decoded = decodeURIComponent(rawSlug || '');
  const formattedCategory = hindiMap[decoded]?.label || decoded.replace(/[-_]+/g, ' ') || 'देश-विदेश';
  const catKey = decoded.toLowerCase();
  const isPradesh = formattedCategory === 'प्रदेश' || catKey === 'pradesh';

  const matchedArticles = articles.filter(a => {
    // If specific city selected under Pradesh
    if (isPradesh && selectedCity && selectedCity !== 'सभी शहर') {
      const cityKey = selectedCity.toLowerCase();
      const inTitle = (a.hindiTitle || a.title || '').toLowerCase().includes(cityKey);
      const inCity = (a.city || '').toLowerCase().includes(cityKey);
      const inContent = a.content?.some(c => c.toLowerCase().includes(cityKey));
      if (inTitle || inCity || inContent) return true;
    }

    if (!rawSlug || catKey === 'latest' || catKey === 'search') return true;
    const catLower = a.category.toLowerCase();
    const subLower = (a.subcategory || '').toLowerCase();
    
    for (const [hi, v] of Object.entries(hindiMap)) {
      if (catKey.includes(hi.toLowerCase()) || hi.toLowerCase().includes(catKey)) {
        if (v.en.some(e => catLower.includes(e) || subLower.includes(e) || a.tags.some(t => t.toLowerCase().includes(e)))) return true;
        if (hi === 'प्रदेश' && (a.category === 'State News' || a.category === 'City News')) return true;
        if (hi === 'धर्म' && a.tags.some(t => t.toLowerCase().includes('culture') || t.toLowerCase().includes('festival'))) return true;
      }
    }
    if (catLower === catKey || catLower.includes(catKey) || catKey.includes(catLower)) return true;
    if (subLower === catKey || subLower.includes(catKey)) return true;
    if (a.tags.some(t => t.toLowerCase().includes(catKey))) return true;
    if (a.title.toLowerCase().includes(catKey)) return true;
    if ((catKey === 'tech' || catKey === 'technology') && catLower.includes('tech')) return true;
    if ((catKey === 'khel' || catKey === 'cricket') && catLower.includes('cricket')) return true;
    return false;
  });

  const categoryArticles = matchedArticles.length >= 2 ? matchedArticles : [...matchedArticles, ...articles.filter(a => !matchedArticles.includes(a))].slice(0, 6);
  const sortedArticles = [...categoryArticles].sort((a, b) => sortBy === 'popular' ? b.viewsCount - a.viewsCount : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const leadArticle = sortedArticles[0];
  const listArticles = sortedArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b-2 border-[#8B0000] gap-3">
        <div>
          <span className="text-[11px] font-bold text-[#8B0000] bg-amber-100 px-2 py-0.5 rounded uppercase font-devanagari">{formattedCategory} डेस्क</span>
          <h1 className="font-devanagari font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 mt-1">
            {isPradesh && selectedCity !== 'सभी शहर' ? `${selectedCity} • ${formattedCategory}` : `${formattedCategory}`}
          </h1>
          <p className="text-xs text-slate-500 font-devanagari">ताजा अपडेट • भोपाल • मध्यप्रदेश ब्यूरो</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-full border text-xs shrink-0">
          <span className="text-slate-500 font-bold flex items-center gap-1 pl-2"><SlidersHorizontal className="w-3.5 h-3.5" /> क्रम:</span>
          <button onClick={() => setSortBy('latest')} className={`px-3 py-1 rounded-full font-bold ${sortBy === 'latest' ? 'bg-[#8B0000] text-white' : 'bg-slate-100'}`}>ताजा</button>
          <button onClick={() => setSortBy('popular')} className={`px-3 py-1 rounded-full font-bold ${sortBy === 'popular' ? 'bg-[#8B0000] text-white' : 'bg-slate-100'}`}>लोकप्रिय</button>
        </div>
      </div>

      {/* Pradesh Cities Pill Bar when viewing Pradesh */}
      {isPradesh && (
        <div className="mb-6 p-3 bg-red-50/60 dark:bg-slate-900/60 border border-red-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2 font-devanagari text-xs font-bold text-[#8B0000] dark:text-red-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>मध्यप्रदेश के मुख्य शहर (चुनें):</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 font-devanagari text-xs">
            {mpCities.map(c => {
              const active = selectedCity === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    if (c === 'सभी शहर') {
                      searchParams.delete('city');
                      setSearchParams(searchParams);
                    } else {
                      setSearchParams({ city: c });
                    }
                  }}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#8B0000] text-white shadow-xs font-black'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {leadArticle && <StoryCard article={leadArticle} variant="lead" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            {listArticles.map(art => <StoryCard key={art.id} article={art} variant="standard" />)}
          </div>
        </div>
        <aside className="lg:col-span-4 space-y-5">
          <AdvertisementSlot type="sidebar" />
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border">
            <h3 className="font-devanagari font-bold text-xs text-[#8B0000] border-b pb-2 mb-3">अन्य चर्चित खबरें</h3>
            <div className="space-y-2">{articles.slice(0, 5).map(art => <StoryCard key={art.id} article={art} variant="compact" />)}</div>
          </div>
          <div className="bg-[#8B0000] text-white p-4 rounded-xl text-center">
            <p className="font-devanagari font-bold">ई-पेपर पढ़ें</p><p className="text-xs text-amber-200">असली अखबार जैसा अनुभव</p>
            <Link to="/epaper" className="mt-2 inline-block bg-white text-[#8B0000] font-bold px-4 py-1.5 rounded-full text-xs">खोलें</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};
