import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Newspaper, Calendar, Download, Eye, Share2, 
  FileText, Search, Star, ArrowRight, MessageCircle, 
  RefreshCw, MapPin, Sparkles, Filter, ChevronRight, Layers
} from 'lucide-react';
import { epapersService, DbEpaper, CITIES_EDITIONS } from '../services/epapers';
import { EpaperThumbnail } from '../components/epaper/EpaperThumbnail';

export const EpaperPage: React.FC = () => {
  const [epapers, setEpapers] = useState<DbEpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

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

  useEffect(() => {
    fetchEpapers();
  }, []);

  // Filter list based on selected city & date
  const filteredEpapers = epapers.filter(item => {
    if (selectedDate && item.edition_date !== selectedDate) return false;
    if (selectedCity !== 'all') {
      const cityObj = CITIES_EDITIONS.find(c => c.id === selectedCity);
      if (cityObj) {
        const matchesCity = item.city_edition?.includes(cityObj.name.replace(' (मुख्य)', '')) ||
          item.title?.includes(cityObj.name.replace(' (मुख्य)', ''));
        if (!matchesCity) return false;
      }
    }
    return true;
  });

  const featured = filteredEpapers.find(e => e.is_featured) || filteredEpapers[0] || epapers[0];
  const gridEditions = filteredEpapers.filter(e => !featured || e.id !== featured.id);

  const handleShare = (paper: DbEpaper) => {
    const url = `${window.location.origin}/epaper/read/${paper.id}`;
    const text = `📰 दैनिक चित्रकूट ज्योति ई-पेपर (${paper.edition_date})\n${paper.title}\nयहाँ ऑनलाइन पूरा अखबार पढ़ें: ${url}`;
    if (navigator.share) {
      navigator.share({ title: paper.title, text, url }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-neutral-900 dark:text-neutral-100 font-sans pb-16">
      
      {/* 1. TOP SWADESH-STYLE MASTHEAD BAR */}
      <div className="bg-white dark:bg-slate-900 border-b border-neutral-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-[#8B0000] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Newspaper className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#8B0000] dark:text-red-500 font-devanagari block leading-none">
                  चित्रकूट ज्योति
                </span>
                <span className="text-[10px] font-black tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                  Digital E-Paper Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Date Selector & Edition Total */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-red-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold font-mono outline-none cursor-pointer text-neutral-800 dark:text-neutral-200"
                title="तारीख अनुसार अखबार खोजें"
              />
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-xs text-red-600 font-bold hover:underline font-devanagari px-1"
              >
                तारीख रीसेट
              </button>
            )}

            {featured && (
              <Link
                to={`/epaper/read/${featured.id}`}
                className="bg-[#8B0000] hover:bg-red-800 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 font-devanagari"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>आज का मुख्य ई-पेपर पढ़ें</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. REGIONAL CITY / EDITION STRIP (SWADESH NEWS STYLE) */}
      <div className="bg-[#1A1A1A] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none no-scrollbar">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider px-2 shrink-0 font-devanagari flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>संस्करण:</span>
            </span>

            {CITIES_EDITIONS.map(city => {
              const isActive = selectedCity === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 font-devanagari ${
                    isActive
                      ? 'bg-red-600 text-white shadow font-black scale-105'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-r from-[#8B0000] via-red-900 to-neutral-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30 font-devanagari">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>डिजिटल ई-पेपर संस्करण • Digital Replica</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-devanagari">
              दैनिक चित्रकूट ज्योति ई-पेपर
            </h1>
            <p className="text-xs sm:text-sm text-neutral-200 font-devanagari leading-relaxed">
              सत्य, साहस और सरोकार • चित्रकूट धाम, सतना, रीवा, भोपाल एवं संपूर्ण मध्यभारत का डिजिटल ई-पेपर।
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
            <p className="font-black text-sm font-devanagari">ई-पेपर लोड हो रहे हैं...</p>
          </div>
        ) : filteredEpapers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <Newspaper className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-black text-lg font-devanagari">
              चयनित तारीख या संस्करण का कोई ई-पेपर उपलब्ध नहीं है
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-devanagari">
              कृपया अन्य तारीख या सभी संस्करण का विकल्प चुनें।
            </p>
            <button
              onClick={() => { setSelectedCity('all'); setSelectedDate(''); }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold font-devanagari hover:bg-red-700"
            >
              सभी संस्करण देखें
            </button>
          </div>
        ) : (
          <>
            {/* 3. FEATURED TODAY'S EDITION SHOWCASE (SWADESH HERO CARD) */}
            {featured && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-neutral-200 dark:border-slate-800 p-4 sm:p-7 shadow-lg relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
                  
                  {/* Newspaper Front Page Preview */}
                  <div className="w-full sm:w-72 lg:w-80 shrink-0">
                    <Link
                      to={`/epaper/read/${featured.id}`}
                      className="block group relative rounded-2xl overflow-hidden border-2 border-neutral-300 dark:border-slate-700 shadow-md bg-neutral-100 dark:bg-slate-800 aspect-[3/4.2]"
                    >
                      <EpaperThumbnail
                        coverUrl={featured.cover_public_url}
                        pdfUrl={featured.pdf_public_url}
                        title={featured.title}
                        editionDate={featured.edition_date}
                        cityEdition={featured.city_edition}
                        imgClassName="group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 font-devanagari transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-4 h-4 text-amber-300" />
                          <span>पूरा अखबार पढ़ें</span>
                        </span>
                      </div>

                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase font-devanagari flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>आज का मुख्य अंक</span>
                      </div>

                      {featured.page_count && (
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs font-devanagari">
                          कुल {featured.page_count} पेज
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Edition Details & Actions */}
                  <div className="flex-1 space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-devanagari border border-amber-300 dark:border-amber-800">
                      <Calendar className="w-3.5 h-3.5 text-red-600" />
                      <span>ताजा दैनिक संस्करण • {featured.edition_date}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight font-devanagari">
                      {featured.title}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-bold font-devanagari">
                      {featured.city_edition && (
                        <span className="bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-slate-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-600" />
                          <span>{featured.city_edition}</span>
                        </span>
                      )}
                      <span className="bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-slate-700 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{featured.page_count || 8} पेज</span>
                      </span>
                      {featured.file_size && (
                        <span className="bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-slate-700 font-mono">
                          📦 {(featured.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-devanagari leading-relaxed max-w-2xl">
                      {featured.description || 'चित्रकूट धाम, विंध्य अंचल एवं मध्यभारत का प्रतिष्ठित डिजिटल ई-पेपर। उच्च गुणवत्ता डिजिटल संस्करण को मोबाइल एवं कंप्यूटर पर ज़ूम और कतरन (Crop) सुविधा के साथ पढ़ें।'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                      <Link
                        to={`/epaper/read/${featured.id}`}
                        className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-black inline-flex items-center gap-2 shadow-lg transition-transform active:scale-95 font-devanagari"
                      >
                        <Eye className="w-4 h-4 text-amber-300" />
                        <span>ई-पेपर ऑनलाइन पढ़ें (Read E-Paper)</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {featured.pdf_public_url && (
                        <a
                          href={featured.pdf_public_url}
                          download
                          className="px-5 py-3.5 bg-white dark:bg-slate-800 border-2 border-neutral-300 dark:border-slate-700 hover:border-neutral-900 text-neutral-900 dark:text-white rounded-2xl text-sm font-black inline-flex items-center gap-2 transition-colors font-devanagari shadow-xs"
                        >
                          <Download className="w-4 h-4 text-red-600" />
                          <span>PDF डाउनलोड करें</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleShare(featured)}
                        className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black inline-flex items-center gap-2 shadow transition-colors font-devanagari"
                        title="व्हाट्सएप पर शेयर करें"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">शेयर</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ALL EDITIONS / PAST EDITIONS GRID (SWADESH NEWS STYLE) */}
            {gridEditions.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    <h3 className="text-lg sm:text-xl font-black font-devanagari text-neutral-900 dark:text-white">
                      उपलब्ध अन्य संस्करण (Available Regional Editions)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-neutral-500 font-mono">
                    {gridEditions.length} संस्करण
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {gridEditions.map(item => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Orange/Red Edition Header like Swadesh */}
                      <div className="bg-[#8B0000] text-white px-3 py-2 text-xs font-black flex items-center justify-between font-devanagari">
                        <span className="line-clamp-1">{item.city_edition || 'दैनिक संस्करण'}</span>
                        <span className="font-mono text-[10px] text-amber-300">{item.edition_date}</span>
                      </div>

                      <div className="p-3.5 space-y-3 flex-1 flex flex-col">
                        {/* Cover Image */}
                        <Link
                          to={`/epaper/read/${item.id}`}
                          className="w-full aspect-[3/4] bg-neutral-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-slate-700 flex items-center justify-center relative block"
                        >
                          <EpaperThumbnail
                            coverUrl={item.cover_public_url}
                            pdfUrl={item.pdf_public_url}
                            title={item.title}
                            editionDate={item.edition_date}
                            cityEdition={item.city_edition}
                            imgClassName="group-hover:scale-105 transition-transform duration-300"
                          />

                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow font-devanagari flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>पढ़ें</span>
                            </span>
                          </div>
                        </Link>

                        {/* Title & metadata */}
                        <div className="flex-1">
                          <h4 className="font-black text-xs sm:text-sm text-neutral-900 dark:text-white line-clamp-2 font-devanagari group-hover:text-red-600 transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium font-devanagari mt-1">
                            <span>कुल {item.page_count || 8} पेज</span>
                            {item.file_size && (
                              <span>• {(item.file_size / 1024 / 1024).toFixed(1)} MB</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="p-3 bg-neutral-50 dark:bg-slate-800/60 border-t border-neutral-200 dark:border-slate-800 flex items-center gap-2">
                        <Link
                          to={`/epaper/read/${item.id}`}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded-xl text-xs font-black inline-flex items-center justify-center gap-1 font-devanagari transition-colors shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ई-पेपर पढ़ें</span>
                        </Link>

                        {item.pdf_public_url && (
                          <a
                            href={item.pdf_public_url}
                            download
                            className="p-2 border border-neutral-300 dark:border-slate-700 rounded-xl hover:bg-neutral-200 dark:hover:bg-slate-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                            title="PDF डाउनलोड करें"
                          >
                            <Download className="w-4 h-4 text-red-600" />
                          </a>
                        )}

                        <button
                          onClick={() => handleShare(item)}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
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
