import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { MegaMenu } from './MegaMenu';
import { Search, Sun, Moon, Menu, MapPin, ChevronDown, Newspaper, Sparkles, X } from 'lucide-react';
import { getT } from '../../lib/i18n';

const citiesHi = ['भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर', 'रीवा', 'सतना', 'चित्रकूट'];
const citiesEn = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Rewa', 'Satna', 'Chitrakoot'];

export const GlobalHeader: React.FC = () => {
  const { theme, toggleTheme, setIsSearchOpen, language, setLanguage } = useNews();
  const t = getT(language === 'en' ? 'en' : 'hi');
  const cities = language === 'en' ? citiesEn : citiesHi;
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBhavishyaOpen, setIsBhavishyaOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const location = useLocation();

  const currentDate = new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const mainCategories = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.deshVidesh, path: '/desh-videsh' },
    { name: t.nav.pradesh, path: '/pradesh' },
    { name: t.nav.bhavishya, path: '/bhavishya' },
    { name: t.nav.khel, path: '/khel' },
    { name: t.nav.dharm, path: '/dharm' },
    { name: t.nav.manoranjan, path: '/manoranjan' },
    { name: t.nav.vichar, path: '/vichar' },
    { name: t.nav.lifestyle, path: '/lifestyle-health' },
    { name: t.nav.tech, path: '/tech' },
    { name: t.nav.epaper, path: '/epaper' },
  ];

  const bhavishyaItems = [
    { name: t.nav.bhavishyavani, path: '/bhavishya/bhavishyavani' },
    { name: t.nav.rashifal, path: '/bhavishya/rashifal' },
    { name: t.nav.panchang, path: '/bhavishya/panchang' },
    { name: t.nav.vrat, path: '/bhavishya/vrat-tyohar' },
  ];

  return (
    <header className="bg-white dark:bg-[#0B0F17] text-[#111827] dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* TOP BAR */}
      <div className="bg-[#8B0000] dark:bg-[#7a0000] text-white text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 font-sans-ui">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-1 min-w-0">
            <span className="hidden sm:inline font-medium text-amber-100 truncate">{currentDate} • {language==='en'?'Bhopal':'भोपाल'}</span>
            <span className="sm:hidden font-medium text-amber-100">{new Date().toLocaleDateString(language==='en'?'en-IN':'hi-IN', { day:'numeric', month:'short'})}</span>
            <div className="hidden md:flex items-center gap-1 text-amber-50">
              <MapPin className="w-3 h-3 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold cursor-pointer py-0 text-white text-[11px]"
              >
                {cities.map(c => (<option key={c} value={c} className="bg-white text-slate-900">{c}</option>))}
              </select>
              <span className="text-amber-200">• 29°C</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle */}
            <div className="flex items-center bg-white/20 rounded-full p-0.5">
              <button onClick={() => setLanguage('hi')} className={`px-2 sm:px-3 py-1 rounded-full text-[11px] font-black transition-colors ${language==='hi' ? 'bg-white text-[#8B0000]' : 'text-white hover:bg-white/10'}`}>हिंदी</button>
              <button onClick={() => setLanguage('en')} className={`px-2 sm:px-3 py-1 rounded-full text-[11px] font-black transition-colors ${language==='en' ? 'bg-white text-[#8B0000]' : 'text-white hover:bg-white/10'}`}>EN</button>
            </div>

            <Link to="/epaper" className="hidden md:flex items-center gap-1 font-bold bg-white text-[#8B0000] px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors">
              <Newspaper className="w-3.5 h-3.5" />
              <span>{t.header.epaper}</span>
            </Link>
            <a href="tel:+918827294576" className="hidden lg:block font-semibold text-amber-100 hover:text-white">📞 8827294576</a>
            <button onClick={toggleTheme} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors" title={theme === 'light' ? 'Dark' : 'Light'}>
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* BRAND AREA - Big Clean Masthead Logo */}
      <div className="py-2.5 sm:py-3.5 px-3 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="lg:hidden p-2 -ml-2 rounded-xl bg-neutral-100 dark:bg-slate-800 text-black dark:text-white shrink-0">
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Big Master Logo - No redundant text beside it */}
          <Link to="/" className="flex items-center shrink-0 group">
            <img
              src="/assets/logo.jpg"
              alt="चित्रकूट ज्योति"
              className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Center Tagline & Establishment 2020 */}
          <div className="hidden lg:block text-center flex-1 px-4">
            <p className="font-devanagari text-[11px] text-neutral-600 dark:text-neutral-400 italic leading-tight">
              {language==='en' ? '"Ideological, positive, national, crime, spiritual, astrology & lifestyle news"' : '“वैचारिक, सकारात्मक, देश-दुनिया, क्राइम, धर्म, ज्योतिष, वास्तु, कैरियर, लाइफस्टाइल सहित विविध खबरें”'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1.5 text-[11px] font-bold text-[#8B0000] dark:text-red-400 uppercase tracking-widest font-mono">
              <span className="bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-neutral-300 dark:border-slate-700">
                {language==='en' ? 'EST. 2020' : 'स्थापना : 2020'}
              </span>
              <span>•</span>
              <span>RNI/MPHIN/2020/79309</span>
              <span>•</span>
              <span>{language==='en' ? 'Bhopal • Chitrakoot' : 'भोपाल • चित्रकूट'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5">
              <img src="/assets/founder.jpg" alt="editor" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#8B0000] shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-bold font-devanagari text-slate-900 dark:text-slate-100">{language==='en'?'Rajkumar Soni':'राजकुमार सोनी'}</p>
                <p className="text-[10px] text-[#8B0000] font-bold">{language==='en'?'Editor':'संपादक'} • {t.common.bhopalMP}</p>
                <p className="text-[9px] text-slate-500">8827294576</p>
              </div>
            </div>
            <button onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#8B0000] hover:text-white transition-colors" title={t.header.search}>
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="md:hidden mt-2 flex items-center justify-center gap-2 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-lg px-3 py-2">
          <img src="/assets/founder.jpg" alt="editor" className="w-8 h-8 rounded-full object-cover border-2 border-[#8B0000]" />
          <div className="text-left">
            <p className="text-xs font-bold font-devanagari">{language==='en'?'Rajkumar Soni (Editor)':'राजकुमार सोनी (संपादक)'}</p>
            <p className="text-[10px] text-slate-600">{t.common.bhopalMP} • 8827294576 / 8982635688</p>
          </div>
          <a href="mailto:chitrakootjyotinews@gmail.com" className="ml-auto text-[9px] bg-[#8B0000] text-white px-2 py-1 rounded font-bold">{language==='en'?'Email':'मेल करें'}</a>
        </div>
      </div>

      {/* PRIMARY NAV */}
      <nav className="bg-[#8B0000] dark:bg-[#7a0000] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center">
          <button onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} className="hidden lg:flex items-center gap-1.5 py-2.5 px-3 bg-[#5a0000] hover:bg-black font-bold text-xs uppercase tracking-wider shrink-0 mr-2 rounded">
            <Menu className="w-4 h-4" /> {t.header.वर्ग}
          </button>

          <div className={`flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 flex-1 font-bold text-[13px] sm:text-sm ${language==='hi'?'font-devanagari':''}`}>
            {mainCategories.map(cat => {
              const isActive = location.pathname === cat.path;
              return (
                <Link key={cat.name} to={cat.path} className={`px-2.5 sm:px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${isActive ? 'bg-white text-[#8B0000] font-black' : 'hover:bg-white/20 text-white'}`}>
                  {cat.name}
                </Link>
              );
            })}

            {/* Bhavishya Jigyasa Dropdown in Nav */}
            <div className="relative" onMouseEnter={() => setIsBhavishyaOpen(true)} onMouseLeave={() => setIsBhavishyaOpen(false)}>
              <button className={`px-3 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap text-amber-200 hover:text-white transition-colors ${isBhavishyaOpen ? 'bg-white text-[#8B0000]' : 'hover:bg-white/20'}`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.nav.bhavishya}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isBhavishyaOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBhavishyaOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl border-2 border-[#8B0000] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-[#8B0000] text-white text-xs font-black px-3.5 py-2 flex items-center gap-1.5 font-devanagari">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>भविष्य जिज्ञासा विशेषांक</span>
                  </div>
                  <div className="p-1 font-devanagari">
                    {bhavishyaItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsBhavishyaOpen(false)}
                        className="block px-3 py-2 text-xs font-bold hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg text-black dark:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Link to="/bhavishya/rashifal" className="hidden xl:flex items-center gap-1 bg-amber-400 text-black font-black text-xs px-3.5 py-1.5 rounded-full shrink-0 ml-2 hover:bg-amber-300 shadow-sm font-devanagari">
            <Sparkles className="w-3.5 h-3.5" />
            <span>दैनिक राशिफल</span>
          </Link>
        </div>

        {/* PROMINENT DEDICATED BHAVISHYA JIGYASA HEADER STRIP */}
        <div className="bg-[#5a0000] dark:bg-[#3e0000] text-amber-200 border-t border-amber-500/20 px-2 sm:px-4 py-1 font-devanagari text-xs shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar">
            <Link
              to="/bhavishya"
              className="font-black text-white flex items-center gap-1 shrink-0 bg-black/40 hover:bg-black/70 px-2.5 py-0.5 rounded-md border border-amber-400/40 transition-colors"
              title="भविष्य जिज्ञासा"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>भविष्य जिज्ञासा:</span>
            </Link>

            <Link
              to="/bhavishya/bhavishyavani"
              className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                location.pathname.includes('bhavishyavani')
                  ? 'bg-amber-400 text-black font-black shadow'
                  : 'text-amber-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🔮</span>
              <span>भविष्यवाणी</span>
            </Link>

            <Link
              to="/bhavishya/rashifal"
              className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                location.pathname.includes('rashifal')
                  ? 'bg-amber-400 text-black font-black shadow'
                  : 'text-amber-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>♈</span>
              <span>दैनिक राशिफल</span>
            </Link>

            <Link
              to="/bhavishya/panchang"
              className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                location.pathname.includes('panchang')
                  ? 'bg-amber-400 text-black font-black shadow'
                  : 'text-amber-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>📅</span>
              <span>दैनिक पंचांग</span>
            </Link>

            <Link
              to="/bhavishya/vrat-tyohar"
              className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                location.pathname.includes('vrat')
                  ? 'bg-amber-400 text-black font-black shadow'
                  : 'text-amber-100 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🪔</span>
              <span>व्रत-त्यौहार</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileNavOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-t border-[#5a0000] p-3 space-y-3 max-h-[75vh] overflow-y-auto">
            {/* Mobile language switch */}
            <div className="flex gap-2">
              <button onClick={()=>setLanguage('hi')} className={`flex-1 py-2 rounded-full font-bold border ${language==='hi'?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white border-slate-200'}`}>हिंदी</button>
              <button onClick={()=>setLanguage('en')} className={`flex-1 py-2 rounded-full font-bold border ${language==='en'?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white border-slate-200'}`}>English</button>
            </div>

            {/* Bhavishya Jigyasa Options on Mobile */}
            <div className="bg-amber-50 dark:bg-slate-800 rounded-xl p-3 border-2 border-amber-300 dark:border-amber-700">
              <p className="font-black text-xs text-[#8B0000] dark:text-amber-400 mb-2.5 flex items-center gap-1.5 font-devanagari uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>भविष्य जिज्ञासा</span>
              </p>
              <div className="grid grid-cols-2 gap-2 font-devanagari">
                <Link
                  to="/bhavishya/bhavishyavani"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="bg-white dark:bg-slate-700 border border-amber-200 dark:border-slate-600 rounded-lg p-2.5 text-center text-xs font-black shadow-xs hover:bg-amber-100 flex items-center justify-center gap-1 text-black dark:text-white"
                >
                  <span>🔮</span>
                  <span>भविष्यवाणी</span>
                </Link>
                <Link
                  to="/bhavishya/rashifal"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="bg-white dark:bg-slate-700 border border-amber-200 dark:border-slate-600 rounded-lg p-2.5 text-center text-xs font-black shadow-xs hover:bg-amber-100 flex items-center justify-center gap-1 text-black dark:text-white"
                >
                  <span>♈</span>
                  <span>दैनिक राशिफल</span>
                </Link>
                <Link
                  to="/bhavishya/panchang"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="bg-white dark:bg-slate-700 border border-amber-200 dark:border-slate-600 rounded-lg p-2.5 text-center text-xs font-black shadow-xs hover:bg-amber-100 flex items-center justify-center gap-1 text-black dark:text-white"
                >
                  <span>📅</span>
                  <span>दैनिक पंचांग</span>
                </Link>
                <Link
                  to="/bhavishya/vrat-tyohar"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="bg-white dark:bg-slate-700 border border-amber-200 dark:border-slate-600 rounded-lg p-2.5 text-center text-xs font-black shadow-xs hover:bg-amber-100 flex items-center justify-center gap-1 text-black dark:text-white"
                >
                  <span>🪔</span>
                  <span>व्रत-त्यौहार</span>
                </Link>
              </div>
            </div>

            {/* Main Categories Grid */}
            <div className="grid grid-cols-2 gap-2">
              {mainCategories.map(cat => (
                <Link key={cat.name} to={cat.path} onClick={() => setIsMobileNavOpen(false)} className={`p-2.5 rounded-lg text-center font-bold border ${location.pathname === cat.path ? 'bg-[#8B0000] text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200'} ${language==='hi'?'font-devanagari':''}`}>{cat.name}</Link>
              ))}
            </div>

            <div className="flex gap-2">
              <Link to="/epaper" onClick={() => setIsMobileNavOpen(false)} className="flex-1 bg-[#8B0000] text-white p-2.5 rounded-lg text-center font-bold text-sm font-devanagari">📰 {t.nav.epaper}</Link>
              <Link to="/contact" onClick={() => setIsMobileNavOpen(false)} className="flex-1 bg-slate-900 text-white p-2.5 rounded-lg text-center font-bold text-sm">{t.header.contact}</Link>
            </div>
          </div>
        )}
      </nav>

      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </header>
  );
};
