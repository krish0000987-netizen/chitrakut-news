import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Newspaper, Calendar, Download, Eye, Share2, 
  FileText, Search, Star, ArrowRight, MessageCircle, RefreshCw
} from 'lucide-react';
import { epapersService, DbEpaper } from '../services/epapers';

export const EpaperPage: React.FC = () => {
  const [epapers, setEpapers] = useState<DbEpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    const fetchEpapers = async () => {
      setLoading(true);
      try {
        const list = await epapersService.list({ status: 'published' });
        setEpapers(list);
      } catch (err) {
        console.error('Failed to load epapers:', err);
      }
      setLoading(false);
    };
    fetchEpapers();
  }, []);

  const featured = epapers.find(e => e.is_featured) || epapers[0];
  const others = epapers.filter(e => !featured || e.id !== featured.id);

  // Filtered others by date if searchDate is entered
  const filteredList = others.filter(item => {
    if (searchDate && item.edition_date !== searchDate) return false;
    return true;
  });

  const handleShare = (paper: DbEpaper) => {
    const url = `${window.location.origin}/epaper/read/${paper.id}`;
    const text = `दैनिक चित्रकूट ज्योति ई-पेपर (${paper.edition_date}):\n${paper.title}\nयहाँ पढ़ें: ${url}`;
    if (navigator.share) {
      navigator.share({ title: paper.title, text, url }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8] dark:bg-slate-950 text-black dark:text-white py-6 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Masthead Header */}
        <div className="text-center pb-4 border-b-2 border-black dark:border-slate-800">
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2 font-devanagari">
            <Newspaper className="w-3.5 h-3.5 text-amber-400" />
            <span>डिजिटल ई-पेपर संस्करण</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight font-devanagari">
            दैनिक चित्रकूट ज्योति ई-पेपर
          </h1>
          <p className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 mt-1 font-devanagari">
            सत्य, साहस और सरोकार • भोपाल, चित्रकूट एवं मध्यभारत का प्रतिष्ठित दैनिक समाचार पत्र
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-slate-800 border-2 border-black dark:border-slate-700 rounded-xl px-3 py-1.5">
              <Calendar className="w-4 h-4 text-black dark:text-white" />
              <input
                type="date"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                className="bg-transparent text-xs font-bold font-mono outline-none cursor-pointer text-black dark:text-white"
              />
            </div>
            {searchDate && (
              <button
                onClick={() => setSearchDate('')}
                className="text-xs text-red-600 font-bold hover:underline font-devanagari"
              >
                तारीख रीसेट करें
              </button>
            )}
          </div>

          <div className="text-xs font-black text-neutral-700 dark:text-neutral-300 font-devanagari">
            कुल {epapers.length} ई-पेपर संस्करण उपलब्ध हैं
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-black dark:text-white animate-spin" />
            <p className="font-black text-sm font-devanagari">ई-पेपर लोड हो रहे हैं...</p>
          </div>
        ) : !featured ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black p-12 text-center shadow-sm">
            <Newspaper className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-black text-lg text-black dark:text-white font-devanagari">
              वर्तमान में कोई ई-पेपर उपलब्ध नहीं है
            </h3>
            <p className="text-xs text-neutral-600 mt-1 font-devanagari">
              एडमिन पैनल से आज का ई-पेपर पीडीएफ अपलोड होने के बाद यहाँ दिखाई देगा।
            </p>
          </div>
        ) : (
          <>
            {/* 1. TODAY'S FEATURED EDITION (Large, Mobile-Friendly Hero Card) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-4 border-black dark:border-slate-800 p-4 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Preview Thumbnail */}
                <div className="w-full sm:w-64 lg:w-72 shrink-0">
                  <div className="relative group rounded-xl overflow-hidden border-2 border-black shadow-md bg-neutral-100 aspect-[3/4] flex items-center justify-center">
                    {featured.cover_public_url ? (
                      <img
                        src={featured.cover_public_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <FileText className="w-16 h-16 text-neutral-400 mb-2" />
                        <span className="font-black text-xs font-devanagari text-neutral-700">
                          चित्रकूट ज्योति ई-पेपर
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 mt-1">
                          {featured.edition_date}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                      ⭐ मुख्य संस्करण
                    </div>
                  </div>
                </div>

                {/* Content & Actions */}
                <div className="flex-1 space-y-3 sm:space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-devanagari">
                    <Star className="w-3.5 h-3.5 fill-black" />
                    <span>आज का ताजा अंक (Today's Issue)</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white leading-tight font-devanagari">
                    {featured.title}
                  </h2>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-bold text-neutral-700 dark:text-neutral-300 font-devanagari">
                    <span className="bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-black/20 font-mono">
                      📅 {featured.edition_date}
                    </span>
                    {featured.file_size && (
                      <span className="bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-black/20 font-mono">
                        📦 {(featured.file_size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                    <span className="bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-black/20">
                      दैनिक संस्करण
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-devanagari leading-relaxed max-w-2xl">
                    चित्रकूट ज्योति का आज का ताजा ई-पेपर संस्करण अब वेबसाइट पर उपलब्ध है। मोबाइल एवं डेस्कटॉप पर पूरा अखबार उच्च गुणवत्ता में आसानी से पढ़ें या पीडीएफ डाउनलोड करें।
                  </p>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <Link
                      to={`/epaper/read/${featured.id}`}
                      className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-sm font-black inline-flex items-center gap-2 shadow-lg transition-transform active:scale-95 font-devanagari"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>ई-पेपर पढ़ें (Read Online)</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {featured.pdf_public_url && (
                      <a
                        href={featured.pdf_public_url}
                        download
                        className="px-5 py-3 bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 hover:bg-neutral-100 text-black dark:text-white rounded-xl text-sm font-black inline-flex items-center gap-2 transition-colors font-devanagari"
                      >
                        <Download className="w-4 h-4" />
                        <span>PDF डाउनलोड करें</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleShare(featured)}
                      className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black inline-flex items-center gap-2 shadow transition-colors font-devanagari"
                      title="व्हाट्सएप पर शेयर करें"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">शेयर</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PREVIOUS EDITIONS GRID */}
            {filteredList.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black dark:border-slate-800">
                  <h3 className="text-lg font-black text-black dark:text-white font-devanagari flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8B0000]" />
                    <span>पिछले प्रकाशित संस्करण (Past Editions)</span>
                  </h3>
                  <span className="text-xs font-bold text-neutral-500 font-mono">
                    {filteredList.length} अंक
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredList.map(item => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Miniature Cover */}
                        <div className="w-full h-44 bg-neutral-100 dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 overflow-hidden mb-3 flex items-center justify-center">
                          {item.cover_public_url ? (
                            <img src={item.cover_public_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3">
                              <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-1" />
                              <p className="text-[10px] font-mono text-neutral-500">{item.edition_date}</p>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] font-mono font-bold bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-neutral-300 dark:border-slate-700">
                          {item.edition_date}
                        </span>

                        <h4 className="font-bold text-sm text-black dark:text-white line-clamp-2 mt-1.5 font-devanagari">
                          {item.title}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-neutral-200 dark:border-slate-800 mt-3 flex items-center justify-between gap-2">
                        <Link
                          to={`/epaper/read/${item.id}`}
                          className="flex-1 py-2 bg-black hover:bg-neutral-800 text-white text-center rounded-xl text-xs font-black inline-flex items-center justify-center gap-1 font-devanagari transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>पढ़ें</span>
                        </Link>

                        {item.pdf_public_url && (
                          <a
                            href={item.pdf_public_url}
                            download
                            className="p-2 border-2 border-black dark:border-slate-700 rounded-xl hover:bg-neutral-100 text-black dark:text-white transition-colors"
                            title="डाउनलोड करें"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => handleShare(item)}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                          title="व्हाट्सएप पर शेयर करें"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
