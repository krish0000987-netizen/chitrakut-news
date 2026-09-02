import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { getT } from '../../lib/i18n';

export const GlobalFooter: React.FC = () => {
  const { language, setLanguage } = useNews();
  const t = getT(language==='en'?'en':'hi');
  const isEn = language === 'en';
  return (
    <footer className="bg-[#1a0000] text-slate-200 font-sans-ui border-t-4 border-[#8B0000] pt-8 pb-20 md:pb-8 px-3 sm:px-4 no-print">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.jpg" alt="चित्रकूट ज्योति" className="h-14 sm:h-16 w-auto rounded-xl p-1 bg-white shadow" />
            </div>
            <p className={`text-sm text-slate-300 mt-3 leading-relaxed max-w-2xl ${isEn?'':'font-devanagari'}`}>
              {t.footer.tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={()=>setLanguage(isEn?'hi':'en')} className="bg-white text-[#8B0000] font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
                🌐 {isEn?'हिंदी में देखें':'View in English'}
              </button>
              <Link to="/epaper" className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1">
                <Newspaper className="w-4 h-4" /> {isEn?'Read E-Paper':'ई-पेपर पढ़ें'}
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs">{t.footer.about}</Link>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-xl max-w-sm w-full">
            <div className="flex gap-3">
              <img src="/assets/founder.jpg" alt="editor" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-[#8B0000] shadow" />
              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-base leading-none ${isEn?'':'font-devanagari'}`}>{isEn?'Rajkumar Soni':'राजकुमार सोनी'}</h3>
                <p className="text-xs font-bold text-[#8B0000] bg-amber-100 inline-block px-2 py-0.5 rounded-full mt-1">{isEn?'Editor':'संपादक'}</p>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {t.common.bhopalMP}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <a href="tel:+918827294576" className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 hover:bg-amber-50"><Phone className="w-3.5 h-3.5 text-[#8B0000]" /> 8827294576, 8982635688</a>
              <a href="mailto:chitrakootjyotinews@gmail.com" className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 hover:bg-amber-50 break-all"><Mail className="w-3.5 h-3.5 text-[#8B0000]" /> chitrakootjyotinews@gmail.com</a>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">{isEn?'For news / ads contact':'संपर्क • विज्ञापन • समाचार हेतु संपर्क करें'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-white/10 text-xs">
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 ${isEn?'':'font-devanagari'}`}>{t.footer.mainNews}</h4>
            <ul className={`space-y-1.5 text-slate-300 ${isEn?'':'font-devanagari'}`}>
              <li><Link to="/desh-videsh" className="hover:text-white">{t.nav.deshVidesh}</Link></li>
              <li><Link to="/pradesh" className="hover:text-white">{t.nav.pradesh}</Link></li>
              <li><Link to="/khel" className="hover:text-white">{t.nav.khel}</Link></li>
              <li><Link to="/dharm" className="hover:text-white">{t.nav.dharm}</Link></li>
              <li><Link to="/manoranjan" className="hover:text-white">{t.nav.manoranjan}</Link></li>
              <li><Link to="/vichar" className="hover:text-white">{t.nav.vichar}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 ${isEn?'':'font-devanagari'}`}>{t.footer.otherSections}</h4>
            <ul className={`space-y-1.5 text-slate-300 ${isEn?'':'font-devanagari'}`}>
              <li><Link to="/lifestyle-health" className="hover:text-white">{t.nav.lifestyle}</Link></li>
              <li><Link to="/tech" className="hover:text-white">{t.nav.tech}</Link></li>
              <li><Link to="/videos" className="hover:text-white">{isEn?'Videos':'वीडियो न्यूज़'}</Link></li>
              <li><Link to="/photos" className="hover:text-white">{isEn?'Photos':'फोटो गैलरी'}</Link></li>
              <li><Link to="/epaper" className="hover:text-white">{t.nav.epaper}</Link></li>
              <li><Link to="/live" className="hover:text-white">{isEn?'Live':'लाइव अपडेट'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 ${isEn?'':'font-devanagari'}`}>{t.nav.bhavishya} ✨</h4>
            <ul className={`space-y-1.5 text-slate-300 ${isEn?'':'font-devanagari'}`}>
              <li><Link to="/bhavishya/bhavishyavani" className="hover:text-white">{t.nav.bhavishyavani}</Link></li>
              <li><Link to="/bhavishya/rashifal" className="hover:text-white">{t.nav.rashifal}</Link></li>
              <li><Link to="/bhavishya/panchang" className="hover:text-white">{t.nav.panchang}</Link></li>
              <li><Link to="/bhavishya/vrat-tyohar" className="hover:text-white">{t.nav.vrat}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1">{t.footer.company}</h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link to="/about" className="hover:text-white">{t.footer.about}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t.footer.contact}</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/advertise" className="hover:text-white">{t.footer.advertise}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className={`flex items-center gap-1 ${isEn?'':'font-devanagari'}`}>© 2026 {isEn?'Chitrakoot Jyoti':'दैनिक चित्रकूट ज्योति'} • {isEn?'All rights reserved':'सर्वाधिकार सुरक्षित'} • <Heart className="w-3 h-3 text-red-500 inline" /> {isEn?'Published from Bhopal':'भोपाल से प्रकाशित'}</p>
          <p className="text-[10px] text-slate-400 text-center font-mono">स्थापना : 2020 • RNI/MPHIN/2020/79309 • Bhopal (M.P.)</p>
        </div>
      </div>
    </footer>
  );
};
