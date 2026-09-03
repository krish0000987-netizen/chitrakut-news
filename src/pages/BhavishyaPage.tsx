import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const rashifal = [
  { rashi: 'मेष', icon: '♈', desc: 'आज कार्य में सफलता, धन लाभ के योग। परिवार में खुशी।', color: 'bg-red-50 border-red-200' },
  { rashi: 'वृषभ', icon: '♉', desc: 'स्वास्थ्य का ध्यान रखें, यात्रा संभव। शुभ रंग हरा।', color: 'bg-emerald-50 border-emerald-200' },
  { rashi: 'मिथुन', icon: '♊', desc: 'नए अवसर मिलेंगे, मित्रों का सहयोग।', color: 'bg-amber-50 border-amber-200' },
  { rashi: 'कर्क', icon: '♋', desc: 'भावनात्मक संतुलन रखें, निवेश से बचें।', color: 'bg-blue-50 border-blue-200' },
  { rashi: 'सिंह', icon: '♌', desc: 'नेतृत्व में वृद्धि, सम्मान प्राप्त होगा।', color: 'bg-orange-50 border-orange-200' },
  { rashi: 'कन्या', icon: '♍', desc: 'मेहनत का फल मिलेगा, शिक्षा में प्रगति।', color: 'bg-violet-50 border-violet-200' },
  { rashi: 'तुला', icon: '♎', desc: 'साझेदारी में लाभ, जीवनसाथी से सहयोग।', color: 'bg-pink-50 border-pink-200' },
  { rashi: 'वृश्चिक', icon: '♏', desc: 'गुप्त शत्रुओं से सावधान, धन बचत करें।', color: 'bg-slate-50 border-slate-200' },
  { rashi: 'धनु', icon: '♐', desc: 'धार्मिक यात्रा के योग, ज्ञान वृद्धि।', color: 'bg-yellow-50 border-yellow-200' },
  { rashi: 'मकर', icon: '♑', desc: 'कैरियर में उन्नति, बड़े निर्णय लें।', color: 'bg-stone-50 border-stone-200' },
  { rashi: 'कुंभ', icon: '♒', desc: 'सामाजिक प्रतिष्ठा बढ़ेगी, नई योजना सफल।', color: 'bg-cyan-50 border-cyan-200' },
  { rashi: 'मीन', icon: '♓', desc: 'रचनात्मकता में वृद्धि, प्रेम संबंध मधुर।', color: 'bg-indigo-50 border-indigo-200' },
];

const panchangData = {
  date: 'शनिवार, 30 अगस्त 2026',
  tithi: 'शुक्ल पक्ष सप्तमी',
  nakshatra: 'अनुराधा',
  yog: 'वैधृति',
  karan: 'वणिज',
  sunrise: '05:54 AM',
  sunset: '06:36 PM',
  abhijit: '11:52 AM - 12:42 PM',
  rahukaal: '09:10 AM - 10:44 AM',
};

export const BhavishyaPage: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  let active = 'rashifal';
  if (tab) {
    active = tab.toLowerCase();
  } else if (path.includes('bhavishyavani')) {
    active = 'bhavishyavani';
  } else if (path.includes('panchang')) {
    active = 'panchang';
  } else if (path.includes('vrat')) {
    active = 'vrat-tyohar';
  } else if (path.includes('rashifal')) {
    active = 'rashifal';
  }

  const tabs = [
    { id: 'rashifal', label: 'दैनिक राशिफल', short: 'राशिफल' },
    { id: 'panchang', label: 'दैनिक पंचांग', short: 'पंचांग' },
    { id: 'vrat-tyohar', label: 'व्रत-त्यौहार', short: 'व्रत-त्यौहार' },
    { id: 'bhavishyavani', label: 'भविष्यवाणी', short: 'भविष्यवाणी' },
  ];

  const currentTab = tabs.find(t => t.id === active) || tabs[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-wrap items-center gap-2 pb-3 mb-4 border-b-2 border-[#8B0000]">
        <span className="text-[11px] font-bold tracking-widest text-[#8B0000] bg-amber-100 px-2 py-1 rounded">भविष्य जिज्ञासा</span>
        <h1 className="font-devanagari font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">{currentTab.label}</h1>
        <span className="text-xs text-slate-500 hidden sm:inline">• वैदिक ज्योतिष डेस्क • भोपाल</span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {tabs.map(t => (
          <Link key={t.id} to={`/bhavishya/${t.id}`} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border font-devanagari ${active === t.id ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-white dark:bg-slate-800 border-slate-200 hover:bg-amber-50'}`}>{t.label}</Link>
        ))}
      </div>

      {active === 'rashifal' && (
        <>
          <div className="bg-gradient-to-r from-[#8B0000] to-[#b91c1c] text-white p-4 sm:p-5 rounded-xl mb-6">
            <h2 className="font-devanagari font-black text-xl">आज का राशिफल — 30 अगस्त 2026, शनिवार</h2>
            <p className="text-amber-100 text-sm mt-1">आचार्य पंडित द्वारा प्रेषित • भोपाल पंचांग के अनुसार</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rashifal.map(r => (
              <div key={r.rashi} className={`p-4 rounded-xl border-2 ${r.color} dark:bg-slate-900 dark:border-slate-700`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{r.icon}</span>
                  <h3 className="font-devanagari font-black text-lg">{r.rashi} राशि</h3>
                </div>
                <p className="text-sm font-devanagari leading-relaxed text-slate-700 dark:text-slate-300">{r.desc}</p>
                <p className="text-[11px] text-slate-500 mt-2">शुभ अंक: {Math.floor(Math.random()*9)+1} • शुभ रंग: केसरिया</p>
              </div>
            ))}
          </div>
        </>
      )}

      {active === 'panchang' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-devanagari font-black text-lg text-[#8B0000] mb-4">आज का पंचांग — {panchangData.date}</h3>
            <div className="space-y-3 text-sm font-devanagari">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">तिथि</span><span className="font-bold">{panchangData.tithi}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">नक्षत्र</span><span className="font-bold">{panchangData.nakshatra}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">योग</span><span className="font-bold">{panchangData.yog}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">करण</span><span className="font-bold">{panchangData.karan}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">सूर्योदय / सूर्यास्त</span><span className="font-bold">{panchangData.sunrise} / {panchangData.sunset}</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3"><p className="text-emerald-700 font-bold">अभिजीत मुहूर्त</p><p className="font-mono font-bold">{panchangData.abhijit}</p></div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-700 font-bold">राहुकाल</p><p className="font-mono font-bold">{panchangData.rahukaal}</p></div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-slate-900 rounded-xl border border-amber-200 p-5">
            <h3 className="font-bold font-devanagari text-[#8B0000] mb-2">आज का विशेष</h3>
            <p className="text-sm font-devanagari leading-relaxed">आज शनिवार को शनि देव एवं हनुमान जी की पूजा का विशेष महत्व है। सरसों के तेल का दीपक जलाएं, काले तिल का दान करें।</p>
            <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border text-xs">
              <p className="font-bold font-devanagari">📍 दैनिक पंचांग डेस्क</p><p className="text-slate-600 font-devanagari">सटीक वैदिक गणना • भोपाल (मप्र) • प्रतिदिन सुबह 5 बजे अपडेट</p>
            </div>
          </div>
        </div>
      )}

      {active === 'bhavishyavani' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border p-5">
            <h3 className="font-devanagari font-black text-lg">साप्ताहिक भविष्यवाणी — सितंबर 2026</h3>
            <p className="text-sm font-devanagari text-slate-600 mt-2 leading-relaxed">ग्रहों की चाल के अनुसार इस सप्ताह व्यापार, नौकरी और स्वास्थ्य में मिले-जुले परिणाम। गुरु और शनि की युति से मप्र सहित उत्तर भारत में स्थिरता के संकेत। विशेष उपाय: हनुमान चालीसा पाठ।</p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border"><span className="font-bold text-[#8B0000]">व्यापार:</span> नए अनुबंध हेतु शुभ सप्ताह</div>
              <div className="bg-slate-50 p-3 rounded border"><span className="font-bold text-emerald-700">स्वास्थ्य:</span> मौसमी बीमारियों से बचाव रखें</div>
              <div className="bg-slate-50 p-3 rounded border"><span className="font-bold text-amber-700">प्रेम:</span> वैवाहिक जीवन में मधुरता</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">ज्योतिषाचार्य से परामर्श: chitrakootjyotinews@gmail.com • 8827294576</p>
        </div>
      )}

      {active === 'vrat-tyohar' && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'हरतालिका तीज', date: '05 सितंबर 2026', desc: 'सुहागिनों का प्रमुख व्रत, शिव-पार्वती पूजा', tag: 'आगामी' },
            { name: 'गणेश चतुर्थी', date: '06 सितंबर 2026', desc: 'गणपति स्थापना, 10 दिन उत्सव', tag: 'प्रमुख' },
            { name: 'अनंत चतुर्दशी', date: '16 सितंबर 2026', desc: 'व्रत एवं विसर्जन', tag: 'व्रत' },
            { name: 'शारदीय नवरात्रि', date: '28 सितंबर 2026', desc: '9 दिन देवी आराधना, गरबा', tag: 'महापर्व' },
            { name: 'दशहरा', date: '07 अक्टूबर 2026', desc: 'विजयादशमी, शस्त्र पूजन', tag: 'महापर्व' },
            { name: 'दीपावली', date: '27 अक्टूबर 2026', desc: 'लक्ष्मी पूजन, दीपोत्सव', tag: 'महापर्व' },
          ].map(f => (
            <div key={f.name} className="bg-white dark:bg-slate-900 p-4 rounded-xl border flex gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#8B0000] text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">{f.date.split(' ')[1]}</span><span className="text-lg font-black leading-none">{f.date.split(' ')[0]}</span>
              </div>
              <div>
                <h4 className="font-devanagari font-bold">{f.name} <span className="text-[10px] bg-amber-100 text-[#8B0000] px-1.5 py-0.5 rounded ml-1">{f.tag}</span></h4>
                <p className="text-xs text-slate-600 font-devanagari">{f.desc}</p><p className="text-[11px] text-slate-400">{f.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
