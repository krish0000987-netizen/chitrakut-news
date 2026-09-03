import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { X, MapPin, Sparkles } from 'lucide-react';

interface MegaMenuProps { isOpen: boolean; onClose: () => void; }

const mpCities = [
  'भोपाल',
  'इंदौर',
  'जबलपुर',
  'ग्वालियर',
  'सतना',
  'सागर',
  'हरदा',
  'विदिशा',
  'नरसिंहपुर',
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const { articles } = useNews();
  if (!isOpen) return null;
  const topStories = articles.slice(0, 4);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center animate-fade-in overflow-y-auto p-2 sm:p-4 md:pt-16">
      <div className="bg-[#FEFCF8] dark:bg-[#0F172A] w-full max-w-7xl h-fit max-h-[92vh] overflow-y-auto border-t-4 border-[#8B0000] shadow-2xl p-4 sm:p-6 rounded-xl my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4 sticky top-0 bg-[#FEFCF8] dark:bg-[#0F172A] z-10">
          <div className="flex items-center gap-2">
            <span className="font-devanagari font-black text-lg text-[#8B0000]">सभी वर्ग</span>
            <span className="text-[10px] bg-[#8B0000] text-white font-bold px-2 py-0.5 rounded">कैटेगरी इंडेक्स</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-[#8B0000] hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-devanagari font-bold text-xs uppercase tracking-wider text-[#8B0000] mb-3 border-b border-red-200 pb-1">प्रमुख श्रेणियां</h4>
            <ul className="space-y-2 text-sm font-devanagari">
              <li><Link to="/desh-videsh" onClick={onClose} className="hover:text-[#8B0000] font-medium">देश-विदेश</Link></li>
              <li><Link to="/pradesh" onClick={onClose} className="hover:text-[#8B0000] font-bold text-[#8B0000]">प्रदेश (मध्य प्रदेश)</Link></li>
              <li><Link to="/khel" onClick={onClose} className="hover:text-[#8B0000]">खेल</Link></li>
              <li><Link to="/dharm" onClick={onClose} className="hover:text-[#8B0000]">धर्म</Link></li>
              <li><Link to="/manoranjan" onClick={onClose} className="hover:text-[#8B0000]">मनोरंजन</Link></li>
              <li><Link to="/vichar" onClick={onClose} className="hover:text-[#8B0000]">विचार</Link></li>
              <li><Link to="/lifestyle-health" onClick={onClose} className="hover:text-[#8B0000]">लाइफस्टाइल & हेल्थ</Link></li>
              <li><Link to="/tech" onClick={onClose} className="hover:text-[#8B0000]">टेक</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-devanagari font-bold text-xs uppercase tracking-wider text-[#8B0000] mb-3 border-b border-red-200 pb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> भविष्य जिज्ञासा</h4>
            <ul className="space-y-2 text-sm font-devanagari">
              <li><Link to="/bhavishya/rashifal" onClick={onClose} className="hover:text-[#8B0000]">दैनिक राशिफल</Link></li>
              <li><Link to="/bhavishya/panchang" onClick={onClose} className="hover:text-[#8B0000]">दैनिक पंचांग</Link></li>
              <li><Link to="/bhavishya/vrat-tyohar" onClick={onClose} className="hover:text-[#8B0000]">व्रत-त्यौहार</Link></li>
              <li><Link to="/bhavishya/bhavishyavani" onClick={onClose} className="hover:text-[#8B0000]">भविष्यवाणी</Link></li>
              <li className="pt-2 border-t"><Link to="/epaper" onClick={onClose} className="font-bold text-[#8B0000]">📰 ई-पेपर</Link></li>
              <li><Link to="/videos" onClick={onClose} className="hover:text-[#8B0000]">वीडियो</Link></li>
              <li><Link to="/photos" onClick={onClose} className="hover:text-[#8B0000]">फोटो गैलरी</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-devanagari font-bold text-xs uppercase tracking-wider text-[#8B0000] mb-3 border-b border-red-200 pb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> प्रदेश डेस्क (मुख्य शहर)</h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-devanagari">
              {mpCities.map(city => (
                <Link
                  key={city}
                  to={`/pradesh?city=${encodeURIComponent(city)}`}
                  onClick={onClose}
                  className="py-1 px-2 rounded hover:bg-red-50 hover:text-[#8B0000] border border-slate-100 dark:border-slate-800 font-semibold"
                >
                  • {city}
                </Link>
              ))}
            </div>
            <Link to="/pradesh" onClick={onClose} className="inline-block mt-3 text-xs font-bold text-[#8B0000] hover:underline font-devanagari">
              सभी जिलों की खबरें →
            </Link>
          </div>

          <div className="bg-amber-50 dark:bg-slate-900 p-4 rounded-lg border border-amber-200 dark:border-slate-800">
            <h4 className="font-devanagari font-bold text-xs uppercase text-[#8B0000] mb-3">ताजा सुर्खियां</h4>
            <div className="space-y-3">
              {topStories.map(art => (
                <Link key={art.id} to={`/article/${art.id}`} onClick={onClose} className="group block border-b border-amber-100 dark:border-slate-800 pb-2 last:border-0">
                  <p className="text-xs font-bold font-devanagari group-hover:text-[#8B0000] line-clamp-2 leading-snug">{art.hindiTitle || art.title}</p>
                  <span className="text-[10px] text-slate-500">{art.category} • {art.readTimeMinutes} मिनट</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
