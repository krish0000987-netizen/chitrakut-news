import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export const StaticPage: React.FC = () => {
  const { pageSlug } = useParams<{ pageSlug: string }>();
  const slug = pageSlug || window.location.pathname.replace('/','') || 'about';
  const titleMap: Record<string,string> = {
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'नियम व शर्तें',
    advertise: 'विज्ञापन',
    'editorial-policy': 'संपादकीय नीति',
  };
  const pageTitle = titleMap[slug] || slug.replace('-',' ').toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="pb-3 mb-6 border-b-2 border-[#8B0000]">
        <h1 className="font-devanagari font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">{pageTitle}</h1>
        <p className="text-xs text-slate-500 mt-1 font-devanagari">दैनिक डिजिटल वेबपोर्टल • भोपाल (मध्यप्रदेश)</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
        
        {(slug === 'about' || slug === '') && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img src="/assets/logo.jpg" alt="Logo" className="h-16 w-auto rounded border shadow-sm bg-white p-1" />
              <div>
                <p className="font-devanagari font-bold text-lg text-[#8B0000]">आपकी आवाज, आपकी खबर — दैनिक चित्रकूट ज्योति</p>
                <p className="font-devanagari text-slate-700 dark:text-slate-300 mt-2">
                  <b>About Us:</b> वेबपोर्टल में वैचारिक, सकारात्मक, देश-दुनिया, क्राइम, धर्म, ज्योतिष, वास्तु, कैरियर, लाइफस्टाइल सहित विविध विधाओं की ताजा व सटीक खबरें मिलेंगी।
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 font-devanagari">
              <div className="p-4 bg-amber-50 dark:bg-slate-800 rounded-xl border border-amber-200">
                <h3 className="font-black text-[#8B0000] mb-2">हमारी विशेषताएँ</h3>
                <ul className="space-y-1 text-xs list-disc pl-4 text-slate-700 dark:text-slate-300">
                  <li>मध्यप्रदेश के सभी जिलों (भोपाल, इंदौर, जबलपुर, ग्वालियर, सतना, सागर, हरदा, विदिशा, नरसिंहपुर) से ग्राउंड रिपोर्ट</li>
                  <li>देश-विदेश, प्रदेश, खेल, धर्म, मनोरंजन, विचार, हेल्थ-लाइफस्टाइल, टेक कवरेज</li>
                  <li>भविष्य जिज्ञासा — राशिफल, पंचांग, व्रत-त्यौहार दैनिक अपडेट</li>
                  <li>ई-पेपर — असली अखबार जैसा पठनीय अनुभव मोबाइल पर</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                <h3 className="font-black text-slate-900 dark:text-white mb-2">संपादकीय कार्यालय</h3>
                <div className="flex gap-3">
                  <img src="/assets/founder.jpg" alt="राजकुमार सोनी" className="w-14 h-14 rounded-full object-cover border-2 border-[#8B0000]" />
                  <div className="text-xs">
                    <p className="font-black font-devanagari text-sm">राजकुमार सोनी</p>
                    <p className="text-[#8B0000] font-bold">(संपादक)</p>
                    <p className="text-slate-600">भोपाल (मप्र)</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#8B0000]" /> 8827294576 , 8982635688</p>
                  <p className="flex items-center gap-2 break-all"><Mail className="w-3 h-3 text-[#8B0000]" /> chitrakootjyotinews@gmail.com</p>
                  <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#8B0000]" /> भोपाल, मध्यप्रदेश</p>
                </div>
              </div>
            </div>

            <div className="bg-[#8B0000] text-white p-4 rounded-xl text-center">
              <p className="font-devanagari font-bold">“सत्य, साहस और सरोकार — वैचारिक • सकारात्मक • निष्पक्ष”</p>
              <p className="text-xs text-amber-200 mt-1 font-mono">स्थापना : 2020 • RNI/MPHIN/2020/79309 • भोपाल (मप्र)</p>
            </div>
          </>
        )}

        {slug === 'contact' && (
          <>
            <h2 className="font-devanagari font-bold text-xl text-[#8B0000]">संपर्क सूत्र</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 dark:bg-slate-800 p-4 rounded-xl border border-amber-200">
                <h3 className="font-black font-devanagari flex items-center gap-2"><img src="/assets/founder.jpg" className="w-8 h-8 rounded-full object-cover" /> राजकुमार सोनी (संपादक)</h3>
                <p className="text-xs mt-2 space-y-1">
                  <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> भोपाल (मप्र)</span>
                  <a href="tel:8827294576" className="flex items-center gap-2 text-[#8B0000] font-bold"><Phone className="w-3 h-3" /> 8827294576</a>
                  <a href="tel:8982635688" className="flex items-center gap-2 text-[#8B0000] font-bold"><Phone className="w-3 h-3" /> 8982635688</a>
                  <a href="mailto:chitrakootjyotinews@gmail.com" className="flex items-center gap-2 break-all"><Mail className="w-3 h-3" /> chitrakootjyotinews@gmail.com</a>
                </p>
              </div>
              <form className="space-y-3">
                <input placeholder="आपका नाम" className="w-full p-2.5 rounded border bg-slate-50 dark:bg-slate-950 text-sm" />
                <input placeholder="मोबाइल / ईमेल" className="w-full p-2.5 rounded border bg-slate-50 dark:bg-slate-950 text-sm" />
                <textarea placeholder="संदेश लिखें..." className="w-full p-3 rounded border bg-slate-50 dark:bg-slate-950 h-24 text-sm" />
                <button type="button" className="w-full bg-[#8B0000] text-white font-bold py-2.5 rounded">भेजें</button>
                <p className="text-[11px] text-slate-500 text-center">खबरें, विज्ञापन, सुझाव हेतु संपर्क करें</p>
              </form>
            </div>
          </>
        )}

        {(slug === 'privacy' || slug === 'terms') && (
          <p className="font-devanagari text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            यह वेबसाइट दैनिक डिजिटल पोर्टल द्वारा संचालित है। सभी सामग्री, फोटो, वीडियो की कॉपीराइट सुरक्षित है। बिना अनुमति पुनर्प्रकाशन वर्जित। विज्ञापन एवं प्रायोजित सामग्री स्पष्ट रूप से चिह्नित रहती है।
          </p>
        )}

        {slug === 'advertise' && (
          <div className="space-y-3 font-devanagari">
            <h3 className="font-black text-[#8B0000] text-lg">विज्ञापन हेतु संपर्क</h3>
            <p className="text-sm text-slate-600">प्रिंट + वेब + ई-पेपर कॉम्बो पैकेज उपलब्ध। जिला स्तर तक लक्षित विज्ञापन।</p>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
              <p>📞 8827294576, 8982635688</p><p>✉️ chitrakootjyotinews@gmail.com</p><p>📍 भोपाल (मप्र) — संपादक: राजकुमार सोनी</p>
            </div>
          </div>
        )}

        {slug === 'editorial-policy' && (
          <div className="space-y-3 font-devanagari text-sm">
            <h3 className="font-black text-[#8B0000]">संपादकीय नीति</h3>
            <p>हम निष्पक्ष, तथ्यपरक पत्रकारिता के लिए प्रतिबद्ध हैं। हर खबर दो-स्तरीय संपादकीय जाँच के बाद प्रकाशित होती है। अफवाह, भ्रामक प्रचार से दूरी।</p>
          </div>
        )}

      </div>
    </div>
  );
};
