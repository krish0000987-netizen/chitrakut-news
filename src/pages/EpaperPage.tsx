import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, ZoomIn, ZoomOut, Calendar, Download, Share2, 
  ChevronLeft, ChevronRight, Crop, Maximize2, Minimize2, 
  RotateCcw, Eye, Check, X, Printer, Bookmark, Sparkles, MessageCircle
} from 'lucide-react';
import { epapersService } from '../services/epapers';

// 8 High-Definition Newspaper Pages Data
const editionsList = [
  { id: 'bhopal', name: 'भोपाल (मुख्य)', tag: 'राजधानी संस्करण' },
  { id: 'chitrakoot', name: 'चित्रकूट धाम', tag: 'संभागीय संस्करण' },
  { id: 'gwalior', name: 'ग्वालियर', tag: 'चंबल-ग्वालियर' },
  { id: 'indore', name: 'इंदौर', tag: 'मालवा-निमाड़' },
  { id: 'jabalpur', name: 'जबलपुर', tag: 'महाकौशल' },
  { id: 'rewa', name: 'रीवा-विंध्य', tag: 'विंध्य प्रदेश' },
];

const pagesData = [
  {
    num: 1,
    title: 'मुखपृष्ठ • देश-विदेश',
    leadHeadline: 'मोदी ने चित्रकूट धाम में ₹4500 करोड़ की विकास परियोजनाओं का किया लोकार्पण',
    sublead: 'आध्यात्मिक विरासत एवं आधुनिक अधोसंरचना का संगम — मंदाकिनी परिक्रमा मार्ग और फोरलेन को मंजूरी',
    sideStory: 'भोपाल मेट्रो के कॉमर्शियल रन को सीएम की हरी झंडी, दिसंबर से दौड़ेगी ट्रेन',
    bottomStory: 'संसद सत्र: डिजिटल सुरक्षा कानून पर सहमति, फेक न्यूज़ पर कड़े प्रावधान लागू होंगे',
    section: 'मुखपृष्ठ'
  },
  {
    num: 2,
    title: 'प्रदेश • भोपाल एवं मध्यभारत',
    leadHeadline: 'मध्य प्रदेश में निवेश का नया युग: औद्योगिक कॉरिडोर को कैबिनेट की मंजूरी',
    sublead: 'भोपाल-इंदौर ग्रोथ कॉरिडोर में 50 हजार नए रोजगार, एमएसएमई को ब्याज छूट योजना',
    sideStory: 'राजा भोज एयरपोर्ट से 4 नए शहरों के लिए सीधी उड़ानें शुरू करने की घोषणा',
    bottomStory: 'स्मार्ट सिटी प्रोजेक्ट: भोपाल के 12 पुराने पार्कों का पुनर्विकास, हरियाली बढ़ाने पर जोर',
    section: 'प्रदेश'
  },
  {
    num: 3,
    title: 'चित्रकूट ज्योति • आस्था एवं संस्कृति',
    leadHeadline: 'कामदगिरि परिक्रमा में उमड़ा 1 लाख श्रद्धालुओं का जनसैलाब, जयकारों से गूंजी घाटी',
    sublead: 'भाद्रपद शुक्ल एकादशी पर विशेष धार्मिक अनुष्ठान, मंदाकिनी आरती में उमड़े देश-विदेश के भक्त',
    sideStory: 'गुप्त गोदावरी एवं स्फटिक शिला पर पर्यटन विकास हेतु ₹50 करोड़ का मास्टर प्लान स्वीकृत',
    bottomStory: 'तुलसी पीठ में रामकथा प्रवचन: जगतगुरु रामभद्राचार्य ने दिया राष्ट्र रक्षा का संदेश',
    section: 'धर्म-संस्कृति'
  },
  {
    num: 4,
    title: 'संपादकीय • विचार एवं विश्लेषण',
    leadHeadline: 'सकारात्मक पत्रकारिता ही लोकतंत्र की सच्ची संजीवनी है: राजकुमार सोनी',
    sublead: 'सनसनीखेज खबरों के दौर में समाज के अंतिम व्यक्ति की आवाज बनना ही चित्रकूट ज्योति का पावन ध्येय',
    sideStory: 'राष्ट्रीय संपादकीय: वैश्विक अर्थव्यवस्था में भारत की बढ़ती धुरी और ग्रामीण सशक्तीकरण',
    bottomStory: 'पाठकों की कलम से: चित्रकूट के विकास में जनभागीदारी का ऐतिहासिक योगदान',
    section: 'संपादकीय'
  },
  {
    num: 5,
    title: 'राष्ट्रीय • राजनीति एवं शासन',
    leadHeadline: 'लोकसभा में कृषि आधुनिकीकरण विधेयक पारित, किसानों को लागत पर 50% मुनाफे की गारंटी',
    sublead: 'संसद में विपक्ष के सुझावों पर भी सरकार ने किया विचार, देश भर की मंडियों का होगा डिजिटल नेटवर्क',
    sideStory: 'चंद्रयान मिशन के आगामी चरण की तैयारी पूरी, इसरो अध्यक्ष ने की ऐतिहासिक घोषणा',
    bottomStory: 'सर्वोच्च न्यायालय का महत्वपूर्ण निर्णय: नागरिकों के निजता अधिकार की रक्षा सर्वोपरि',
    section: 'राष्ट्रीय'
  },
  {
    num: 6,
    title: 'व्यापार • बाजार एवं अर्थव्यवस्था',
    leadHeadline: 'सेंसेक्स रिकॉर्ड 86,000 के पार, विदेशी निवेशकों ने भारतीय बाजार में झोंके ₹12,000 करोड़',
    sublead: 'ऑटोमोबाइल और बैंकिंग सेक्टर में जबरदस्त उछाल, ग्रामीण मांग में 14% की मजबूत वृद्धि',
    sideStory: 'सोने के भाव में ₹450 की नरमी, चांदी स्थिर; भोपाल सराफा में त्योहारी ग्राहकी शुरू',
    bottomStory: 'कृषि उपज मंडी रिपोर्ट: गेहूं और सोयाबीन के भाव में मजबूती, आवक सामान्य',
    section: 'व्यापार'
  },
  {
    num: 7,
    title: 'खेल • क्रीड़ा जगत',
    leadHeadline: 'एशिया कप फाइनल में भारत की ऐतिहासिक विजय: ऑस्ट्रेलिया को 84 रनों से रौंदा',
    sublead: 'मध्य प्रदेश के युवा गेंदबाज का घातक स्पेल — 5 ओवर में 18 रन देकर झटके 4 महत्वपूर्ण विकेट',
    sideStory: 'हॉकी इंडिया लीग: भोपाल वॉरियर्स ने जीता रोमांचक मुकाबला, सेमीफाइनल में जगह पक्की',
    bottomStory: 'पेरिस ओलंपिक पदक विजेताओं का भोपाल में नागरिक अभिनंदन, मुख्यमंत्री ने दिए चेक',
    section: 'खेल'
  },
  {
    num: 8,
    title: 'मनोरंजन, राशिफल एवं विविध',
    leadHeadline: 'दैनिक राशिफल एवं पंचांग: ग्रह गोचर के अनुसार आज का दिन आपके लिए कैसा रहेगा',
    sublead: 'मेष से मीन तक सभी राशियों का सटीक फलकथन, आज का शुभ मुहूर्त और राहुकाल विचार',
    sideStory: 'बॉलीवुड में मप्र की लोककला की धूम: भोपाल में शूट हुई राष्ट्रीय पुरस्कार विजेता फिल्म',
    bottomStory: 'क्लासीफाइड विज्ञापन: प्रॉपर्टी, वैवाहिक, रोजगार एवं वाहन बाजार — शनिवार विशेषांक',
    section: 'राशिफल-विविध'
  },
];

export const EpaperPage: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState('bhopal');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isCropMode, setIsCropMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [realEpapers, setRealEpapers] = useState<any[]>([]);
  const [selectedRealPdf, setSelectedRealPdf] = useState<any>(null);
  const [showPdfReader, setShowPdfReader] = useState(false);

  // Clipping / Crop Tool State
  const [cropSelection, setCropSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [clippedArticle, setClippedArticle] = useState<any | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    epapersService.list({ status: 'published' }).then(items => {
      setRealEpapers(items);
      const feat = items.find(i => i.is_featured) || items[0];
      if (feat) setSelectedRealPdf(feat);
    }).catch(() => {});
  }, []);

  const currentEditionObj = editionsList.find(e => e.id === selectedEdition) || editionsList[0];
  const pageInfo = pagesData[currentPage - 1];

  // Navigation
  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(pagesData.length, p + 1));

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(z => Math.min(220, z + 20));
  const handleZoomOut = () => setZoomLevel(z => Math.max(70, z - 20));
  const handleResetZoom = () => { setZoomLevel(100); setPan({ x: 0, y: 0 }); };
  const handleFitWidth = () => { setZoomLevel(130); setPan({ x: 0, y: 0 }); };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Mouse handlers for Crop Tool & Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCropMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPos({ x, y });
      setCropSelection({ x, y, w: 0, h: 0 });
      setIsDragging(true);
    } else if (zoomLevel > 100) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCropMode && isDragging && cropSelection) {
      const rect = e.currentTarget.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      const x = Math.min(startPos.x, curX);
      const y = Math.min(startPos.y, curY);
      const w = Math.abs(curX - startPos.x);
      const h = Math.abs(curY - startPos.y);
      setCropSelection({ x, y, w, h });
    } else if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    if (isCropMode && isDragging) {
      setIsDragging(false);
      if (cropSelection && cropSelection.w > 40 && cropSelection.h > 40) {
        // Trigger article clipping popup
        setClippedArticle({
          headline: pageInfo.leadHeadline,
          page: currentPage,
          edition: currentEditionObj.name,
          date: selectedDate,
          width: cropSelection.w,
          height: cropSelection.h,
          previewUrl: '/assets/logo.jpg'
        });
      }
    }
    setIsPanning(false);
  };

  // Share current article/page
  const handleShare = () => {
    const url = window.location.href;
    const text = `दैनिक चित्रकूट ज्योति ई-पेपर (${currentEditionObj.name}) - पृष्ठ ${currentPage}\nतारीख: ${selectedDate}\nपढ़ें यहाँ: ${url}`;
    if (navigator.share) {
      navigator.share({ title: 'चित्रकूट ज्योति ई-पेपर', text, url }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F0EFEB] text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* 1. TOP PUBLICATION HEADER BAR (Modeled on epaper.swadeshnews.in) */}
      <header className="bg-white border-b-2 border-black shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Masthead Branding */}
          <div className="flex items-center gap-3">
            <img src="/assets/logo.jpg" alt="चित्रकूट ज्योति लोगो" className="h-10 sm:h-12 w-auto object-contain rounded border border-black p-0.5 bg-white shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl sm:text-2xl leading-none text-black font-devanagari tracking-tight">
                  चित्रकूट ज्योति
                </h1>
                <span className="hidden sm:inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  ई-पेपर
                </span>
              </div>
              <p className="text-[11px] text-neutral-700 font-bold font-devanagari mt-0.5">
                दैनिक समाचार पत्र • सत्य, साहस और सरोकार • भोपाल एवं विंध्य
              </p>
            </div>
          </div>

          {/* Date Picker & City/Edition Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Live Date Selector */}
            <div className="flex items-center gap-1.5 bg-neutral-100 border-2 border-black rounded-xl px-2.5 py-1.5 shadow-xs">
              <Calendar className="w-4 h-4 text-black shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold font-mono text-black outline-none cursor-pointer"
              />
            </div>

            {/* Edition Dropdown */}
            <select
              value={selectedEdition}
              onChange={e => { setSelectedEdition(e.target.value); setCurrentPage(1); }}
              className="bg-black text-white font-bold text-xs border-2 border-black rounded-xl px-3 py-2 outline-none cursor-pointer font-devanagari shadow-xs"
            >
              {editionsList.map(ed => (
                <option key={ed.id} value={ed.id}>
                  {ed.name} ({ed.tag})
                </option>
              ))}
            </select>

            {/* Toggle Real Uploaded PDF Edition if available */}
            {realEpapers.length > 0 && (
              <button
                onClick={() => setShowPdfReader(!showPdfReader)}
                className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-colors flex items-center gap-1 font-devanagari ${
                  showPdfReader ? 'bg-amber-400 text-black shadow' : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showPdfReader ? 'डिजिटल रीडर खोलें' : `एडमिन PDF (${realEpapers.length})`}</span>
              </button>
            )}
          </div>
        </div>

        {/* City Editions Ribbon (Quick Click Pills like Swadesh) */}
        <div className="bg-black text-white border-t border-neutral-800 px-3 sm:px-6 py-1.5 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest font-devanagari shrink-0">
              संस्करण:
            </span>
            {editionsList.map(ed => (
              <button
                key={ed.id}
                onClick={() => { setSelectedEdition(ed.id); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all font-devanagari ${
                  selectedEdition === ed.id
                    ? 'bg-white text-black font-black shadow'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {ed.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. READER TOOLBAR (Interactive Controls - Swadesh Style) */}
      <div className="bg-white border-b-2 border-black px-3 sm:px-6 py-2 shadow-sm sticky top-[82px] sm:top-[90px] z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          {/* Page Selector & Prev/Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white text-black transition-colors flex items-center gap-1 font-devanagari"
              title="पिछला पृष्ठ"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">पिछला</span>
            </button>

            <div className="flex items-center gap-1 bg-neutral-100 border-2 border-black rounded-xl px-2.5 py-1">
              <span className="font-devanagari font-black text-black">पृष्ठ</span>
              <select
                value={currentPage}
                onChange={e => setCurrentPage(parseInt(e.target.value))}
                className="bg-transparent font-mono font-black text-black outline-none cursor-pointer"
              >
                {pagesData.map(p => (
                  <option key={p.num} value={p.num}>
                    {p.num} / {pagesData.length}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === pagesData.length}
              className="p-1.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white text-black transition-colors flex items-center gap-1 font-devanagari"
              title="अगला पृष्ठ"
            >
              <span className="hidden sm:inline">अगला</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-[11px] text-neutral-600 font-devanagari hidden md:inline ml-2">
              • {pageInfo.title}
            </span>
          </div>

          {/* Zoom, Crop, Download, Share Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center bg-neutral-100 border-2 border-black rounded-xl p-0.5">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-white rounded-lg text-black transition-colors"
                title="ज़ूम आउट (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs font-black w-12 text-center text-black">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-white rounded-lg text-black transition-colors"
                title="ज़ूम इन (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 hover:bg-white rounded-lg text-[10px] font-mono text-neutral-700 font-bold border-l border-neutral-300"
                title="100% रीसेट"
              >
                100%
              </button>
              <button
                onClick={handleFitWidth}
                className="px-2 py-1 hover:bg-white rounded-lg text-[10px] font-devanagari text-neutral-700 font-bold border-l border-neutral-300"
                title="चौड़ाई फिट करें"
              >
                फिट
              </button>
            </div>

            {/* Article Clipping / Crop Tool */}
            <button
              onClick={() => { setIsCropMode(!isCropMode); setCropSelection(null); }}
              className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black flex items-center gap-1.5 transition-all font-devanagari shadow-xs ${
                isCropMode ? 'bg-amber-400 text-black ring-2 ring-black' : 'bg-white text-black hover:bg-neutral-100'
              }`}
              title="समाचार कतरन काटें (Crop Tool)"
            >
              <Crop className="w-4 h-4" />
              <span>{isCropMode ? 'क्रॉप चालू है' : 'अखबार कतरन'}</span>
            </button>

            {/* Download Page */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-black text-xs font-black flex items-center gap-1.5 transition-colors font-devanagari shadow-xs"
              title="प्रिंट अथवा पीडीएफ सेव करें"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">डाउनलोड</span>
            </button>

            {/* Share WhatsApp */}
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border-2 border-black bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-xs"
              title="व्हाट्सएप पर शेयर करें"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">शेयर</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-black transition-colors"
              title={isFullscreen ? 'सामान्य स्क्रीन' : 'फुलस्क्रीन'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Crop Tool Notice Banner when Active */}
      {isCropMode && (
        <div className="bg-amber-300 text-black px-4 py-2 text-center text-xs font-black border-b-2 border-black flex items-center justify-center gap-2 font-devanagari animate-pulse">
          <Crop className="w-4 h-4" />
          <span>निर्देश: अखबार के किसी भी समाचार पर माउस या उंगली से बॉक्स बनाकर कतरन (Clip) तैयार करें।</span>
          <button onClick={() => { setIsCropMode(false); setCropSelection(null); }} className="p-1 hover:bg-black/10 rounded-full ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. MAIN NEWSPAPER CANVAS (INSIDE WEBSITE) */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-[#E5E4E0] relative select-none">
        {showPdfReader && selectedRealPdf?.pdf_public_url ? (
          /* Admin Uploaded Real PDF Viewer Inside Website */
          <div className="w-full max-w-5xl bg-white rounded-2xl border-4 border-black p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
              <div>
                <h3 className="font-black text-base text-black font-devanagari">{selectedRealPdf.title}</h3>
                <p className="text-xs text-neutral-600 font-mono">{selectedRealPdf.edition_date} • {selectedRealPdf.edition_type}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedRealPdf.pdf_public_url}
                  download
                  className="px-4 py-1.5 bg-black text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 font-devanagari"
                >
                  <Download className="w-3.5 h-3.5" /> पूरी PDF डाउनलोड करें
                </a>
                <button
                  onClick={() => setShowPdfReader(false)}
                  className="px-3 py-1.5 border-2 border-black rounded-xl text-xs font-bold hover:bg-neutral-100 font-devanagari"
                >
                  डिजिटल रीडर
                </button>
              </div>
            </div>
            <iframe
              src={selectedRealPdf.pdf_public_url}
              title="E-Paper Reader"
              className="w-full h-[800px] border-2 border-black rounded-xl bg-white"
            />
          </div>
        ) : (
          /* Authentic Full-Size Multi-Page Digital Replica inside Website */
          <div
            ref={paperRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              transform: `scale(${zoomLevel / 100}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'top center',
              cursor: isCropMode ? 'crosshair' : zoomLevel > 100 ? (isPanning ? 'grabbing' : 'grab') : 'default'
            }}
            className="w-[840px] min-h-[1180px] bg-[#FFFDF5] text-black border-4 border-black shadow-2xl p-6 sm:p-8 flex flex-col font-devanagari relative transition-transform duration-75"
          >
            {/* Top Registration Line */}
            <div className="flex justify-between items-center text-[9px] font-black border-b-2 border-black pb-1 uppercase tracking-wider font-mono">
              <span>RNI REG. NO. MPHIN/2026/XXXXX • डाक पंजीयन क्रमांक MP/BPL/2026</span>
              <span>www.chitrakootjyoti.com • दैनिक चित्रकूट ज्योति</span>
              <span>मूल्य: ₹4.00 • कुल 8 पृष्ठ</span>
            </div>

            {/* Masthead Banner */}
            <div className="border-b-4 border-black py-3 text-center">
              <div className="flex items-center justify-between gap-4">
                <img src="/assets/logo.jpg" alt="चित्रकूट ज्योति" className="h-16 w-auto object-contain border border-black p-0.5 bg-white shadow-xs hidden sm:block" />
                <div className="flex-1">
                  <h1 className="text-[48px] sm:text-[64px] font-black leading-none tracking-tighter text-black font-devanagari">
                    चित्रकूट ज्योति
                  </h1>
                  <p className="text-xs sm:text-sm font-black tracking-[0.25em] text-neutral-800 uppercase mt-1">
                    सत्य, साहस और सरोकार • भोपाल, मध्यप्रदेश
                  </p>
                </div>
                <div className="text-right hidden sm:block border-l-2 border-black pl-4">
                  <p className="text-[10px] font-bold text-neutral-600 uppercase">संपादक</p>
                  <p className="text-xs font-black text-black">राजकुमार सोनी</p>
                  <p className="text-[10px] text-neutral-600 font-mono">भोपाल (म.प्र.)</p>
                </div>
              </div>

              {/* Sub-Masthead Info Ribbon */}
              <div className="flex justify-between items-center text-[10px] font-bold border-t-2 border-black mt-2 pt-1.5 bg-neutral-100 px-2">
                <span>📍 {currentEditionObj.name} ({currentEditionObj.tag})</span>
                <span className="font-black text-black">वर्ष 1 • अंक 245 • {selectedDate}</span>
                <span>पृष्ठ संख्या: {currentPage} / {pagesData.length}</span>
              </div>
            </div>

            {/* Page Main Content Sections */}
            <div className="my-4 flex-1 flex flex-col">
              {/* Section Header Tag */}
              <div className="bg-black text-white px-3 py-1 text-xs font-black inline-block self-start rounded uppercase tracking-wider mb-3">
                {pageInfo.title}
              </div>

              {/* Lead Headline Banner */}
              <div className="border-b-2 border-black pb-4 mb-4">
                <h2 className="text-[28px] sm:text-[34px] font-black leading-tight text-black tracking-tight hover:text-neutral-800 transition-colors">
                  {pageInfo.leadHeadline}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-neutral-800 mt-2 leading-relaxed">
                  {pageInfo.sublead}
                </p>
                <p className="text-[10px] font-mono font-bold text-neutral-600 mt-2 uppercase">
                  चित्रकूट ज्योति ब्यूरो • भोपाल/चित्रकूट धाम • विशेष रिपोर्ट
                </p>
              </div>

              {/* Multi-Column News Layout */}
              <div className="grid grid-cols-12 gap-5 flex-1 text-justify text-xs leading-relaxed text-black">
                {/* Column 1 & 2: Main Story Body */}
                <div className="col-span-7 space-y-3 pr-2 border-r-2 border-neutral-300">
                  <p className="first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:text-black">
                    भोपाल/चित्रकूट। दैनिक चित्रकूट ज्योति के विशेष संवाददाता के अनुसार, विकास और जनसरोकारों की दिशा में आज का दिन ऐतिहासिक उपलब्धियों से परिपूर्ण रहा। प्रदेश की जनता की आकांक्षाओं को ध्यान में रखते हुए शासन द्वारा महत्वपूर्ण निर्णय लिए गए हैं। आध्यात्मिक नगरी चित्रकूट धाम के सर्वांगीण विकास के लिए मास्टर प्लान को मूर्तरूप दिया जा रहा है।
                  </p>
                  <p>
                    संपादक राजकुमार सोनी ने अपने संपादकीय विचार में रेखांकित किया कि सकारात्मक पत्रकारिता ही समाज को सही दिशा दे सकती है। चित्रकूट ज्योति हमेशा से जनता के ज्वलंत मुद्दों को निष्पक्षता और साहस के साथ उठाता रहा है। इसी क्रम में स्थानीय रोजगार, स्वास्थ्य सेवाएं, उच्च शिक्षा एवं धार्मिक पर्यटन को बढ़ावा देने हेतु विशेष योजनाओं का क्रियान्वयन सुनिश्चित किया जा रहा है।
                  </p>
                  
                  {/* Embedded Photo & Caption */}
                  <div className="border-2 border-black p-2 bg-white my-3 shadow-xs">
                    <img src="/assets/founder.jpg" alt="समाचार चित्र" className="w-full h-48 object-cover border border-black mb-1.5" />
                    <p className="text-[10px] font-bold text-neutral-700 italic text-center">
                      चित्रकूट ज्योति न्यूज़रूम: संस्थापक संपादक राजकुमार सोनी एवं वरिष्ठ संवाददाता समीक्षा करते हुए।
                    </p>
                  </div>

                  <p>
                    संबंधित प्रशासनिक अधिकारियों ने आश्वस्त किया है कि सभी परियोजनाओं को समयबद्ध तरीके से पूरा किया जाएगा। जनसहयोग और जनभागीदारी से चित्रकूट को राष्ट्रीय एवं वैश्विक पटल पर विशेष पहचान दिलाने का संकल्प लिया गया है।
                  </p>
                </div>

                {/* Column 3: Secondary Stories & Sidebars */}
                <div className="col-span-5 space-y-4 pl-1">
                  <div className="border-2 border-black p-3 bg-neutral-50 shadow-xs">
                    <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 uppercase tracking-wider inline-block mb-1.5">
                      विशेष खबर
                    </span>
                    <h3 className="text-base font-black leading-snug text-black mb-1">
                      {pageInfo.sideStory}
                    </h3>
                    <p className="text-[11px] text-neutral-800 leading-normal">
                      राजधानी के नागरिकों के लिए बड़ी राहत। आधुनिक तकनीक से लैस मेट्रो का ट्रायल सफलतापूर्वक संपन्न हुआ है। शहर के प्रमुख चौराहों को जोड़ने से यातायात सुगम होगा।
                    </p>
                  </div>

                  <div className="border-t-2 border-black pt-3">
                    <h4 className="text-sm font-black text-black mb-1">
                      {pageInfo.bottomStory}
                    </h4>
                    <p className="text-[11px] text-neutral-800 leading-normal">
                      विधिक विशेषज्ञों के अनुसार नए प्रावधानों से आम जनता को त्वरित न्याय मिलने में मदद मिलेगी। डिजिटल गवर्नेंस को बढ़ावा देने हेतु प्रदेशव्यापी कार्यशाला आयोजित होगी।
                    </p>
                  </div>

                  {/* Advertisement Box Replica */}
                  <div className="border-2 border-dashed border-black p-3 text-center bg-amber-50/70">
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">विज्ञापन (Advertisement)</p>
                    <p className="text-xs font-black text-black">चित्रकूट ज्योति में विज्ञापन हेतु संपर्क करें</p>
                    <p className="text-[11px] font-bold text-neutral-800 mt-1">फोन: 8827294576, 8982635688</p>
                    <p className="text-[10px] text-neutral-600 font-mono">chitrakootjyotinews@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="border-t-2 border-black pt-2 flex justify-between items-center text-[10px] font-bold text-neutral-700">
              <span>दैनिक चित्रकूट ज्योति • {currentEditionObj.name}</span>
              <span className="font-mono">Page {currentPage} of {pagesData.length}</span>
              <span>मुद्रक एवं प्रकाशक: राजकुमार सोनी, भोपाल (मप्र)</span>
            </div>

            {/* Visual Crop Overlay when User is Selecting */}
            {cropSelection && isCropMode && (
              <div
                style={{
                  left: `${cropSelection.x}px`,
                  top: `${cropSelection.y}px`,
                  width: `${cropSelection.w}px`,
                  height: `${cropSelection.h}px`,
                }}
                className="absolute border-2 border-dashed border-amber-600 bg-amber-400/25 pointer-events-none z-10 shadow-lg"
              >
                <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 absolute -top-5 left-0 uppercase font-mono">
                  क्लिप चयन ({cropSelection.w}x{cropSelection.h})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. BOTTOM PAGE THUMBNAILS STRIP (Modeled on epaper.swadeshnews.in) */}
      <div className="bg-white border-t-2 border-black p-3 shadow-lg z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-black uppercase tracking-wider font-devanagari flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" /> पृष्ठ सूची (Page Thumbnails) — {currentEditionObj.name}
            </span>
            <span className="text-[11px] font-bold text-neutral-600 font-mono">
              8 पृष्ठ उपलब्ध
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {pagesData.map(p => {
              const isSelected = currentPage === p.num && !showPdfReader;
              return (
                <button
                  key={p.num}
                  onClick={() => { setCurrentPage(p.num); setShowPdfReader(false); }}
                  className={`flex flex-col items-center shrink-0 w-24 sm:w-28 p-1.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-md scale-105'
                      : 'border-neutral-300 bg-neutral-50 hover:border-black text-black'
                  }`}
                >
                  {/* Thumbnail Miniature Canvas Card */}
                  <div className={`w-full h-28 sm:h-32 rounded-lg border flex flex-col justify-between p-1.5 overflow-hidden text-[6px] leading-tight ${
                    isSelected ? 'bg-white text-black border-white' : 'bg-white text-black border-neutral-200'
                  }`}>
                    <div className="border-b border-black pb-0.5 font-black truncate font-devanagari">
                      चित्रकूट ज्योति • P{p.num}
                    </div>
                    <div className="my-auto font-bold line-clamp-3 text-neutral-800 font-devanagari">
                      {p.leadHeadline}
                    </div>
                    <div className="text-[5px] text-neutral-500 truncate font-mono border-t border-neutral-200 pt-0.5">
                      {p.section}
                    </div>
                  </div>

                  <span className={`text-[11px] font-black mt-1.5 font-devanagari ${isSelected ? 'text-white' : 'text-black'}`}>
                    पृष्ठ {p.num}
                  </span>
                  <span className={`text-[9px] truncate w-full text-center ${isSelected ? 'text-amber-400' : 'text-neutral-600'}`}>
                    {p.section}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. ARTICLE CLIPPING / CROP POPUP MODAL (Branded News Clipping) */}
      {clippedArticle && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-4 border-black max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-black" />
                <h3 className="font-black text-base text-black font-devanagari">अखबार कतरन (Article Clipping)</h3>
              </div>
              <button
                onClick={() => setClippedArticle(null)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Branded Clipping Card for Sharing & Downloading */}
            <div className="border-4 border-black p-4 rounded-xl bg-[#FFFDF7] shadow-inner mb-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <img src="/assets/logo.jpg" alt="" className="h-7 w-auto rounded border border-black p-0.5 bg-white" />
                  <span className="font-black text-base text-black font-devanagari">चित्रकूट ज्योति</span>
                </div>
                <span className="text-[10px] font-bold font-mono text-neutral-700">
                  {clippedArticle.date} • {clippedArticle.edition}
                </span>
              </div>

              <div className="py-2">
                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded font-devanagari inline-block mb-1.5">
                  पृष्ठ {clippedArticle.page} विशेष
                </span>
                <h4 className="font-black text-lg text-black leading-tight font-devanagari mb-2">
                  {clippedArticle.headline}
                </h4>
                <p className="text-xs text-neutral-800 leading-relaxed font-devanagari">
                  {pageInfo.sublead}
                </p>
              </div>

              <div className="border-t border-dashed border-black pt-2 mt-2 flex justify-between text-[9px] font-bold text-neutral-600 font-mono">
                <span>दैनिक चित्रकूट ज्योति डिजिटल कतरन</span>
                <span>epaper.chitrakootjyoti.com</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => {
                  alert('कतरन आपके डिवाइस में डाउनलोड हो गई है ✓');
                  setClippedArticle(null);
                }}
                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors font-devanagari"
              >
                <Download className="w-4 h-4" />
                <span>कतरन डाउनलोड करें (PNG)</span>
              </button>

              <button
                onClick={() => {
                  const shareText = `*चित्रकूट ज्योति ई-पेपर कतरन*\n${clippedArticle.headline}\nसंस्करण: ${clippedArticle.edition} (पृष्ठ ${clippedArticle.page})\nतारीख: ${clippedArticle.date}\nपूरा ई-पेपर पढ़ें: ${window.location.href}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                  setClippedArticle(null);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors font-devanagari"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप पर शेयर करें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
