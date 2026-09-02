import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Download, Share2, ArrowLeft, Eye, Calendar, FileText, 
  Maximize2, Minimize2, ExternalLink, MessageCircle, AlertCircle, RefreshCw, Smartphone, Monitor
} from 'lucide-react';
import { epapersService, DbEpaper } from '../services/epapers';

export const EpaperReadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epaper, setEpaper] = useState<DbEpaper | null>(null);
  const [allEpapers, setAllEpapers] = useState<DbEpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerMode, setViewerMode] = useState<'embedded' | 'native'>('embedded');
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await epapersService.list({ status: 'published' });
        setAllEpapers(list);

        let selected: DbEpaper | undefined;
        if (id && id !== 'latest') {
          selected = list.find(item => item.id === id);
        }
        // If not found or id is latest, use featured or first available
        if (!selected) {
          selected = list.find(item => item.is_featured) || list[0];
        }
        setEpaper(selected || null);
      } catch (err) {
        console.error('Failed to load epaper:', err);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `दैनिक चित्रकूट ज्योति ई-पेपर (${epaper?.edition_date || ''}):\n${epaper?.title || 'आज का मुख्य ई-पेपर'}\nयहाँ पढ़ें: ${url}`;
    if (navigator.share) {
      navigator.share({ title: epaper?.title || 'चित्रकूट ज्योति ई-पेपर', text, url }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const pdfUrl = epaper?.pdf_public_url;
  const fileSizeMb = epaper?.file_size ? (epaper.file_size / (1024 * 1024)).toFixed(2) + ' MB' : null;

  // Google Docs Viewer URL provides universal inline rendering on Mobile Safari & Android Chrome
  const googleDocsViewerUrl = pdfUrl 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : '';

  return (
    <div className="min-h-screen bg-[#FEFCF8] dark:bg-slate-950 text-black dark:text-white py-4 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              to="/epaper"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-slate-800 hover:bg-black hover:text-white text-xs font-black transition-colors font-devanagari border border-black/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>सभी ई-पेपर सूची</span>
            </Link>

            <div>
              <h1 className="text-base sm:text-lg font-black leading-tight text-black dark:text-white font-devanagari line-clamp-1">
                {epaper?.title || 'चित्रकूट ज्योति ई-पेपर'}
              </h1>
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium font-devanagari mt-0.5">
                <span className="flex items-center gap-1 font-mono font-bold">
                  <Calendar className="w-3.5 h-3.5 text-[#8B0000]" />
                  {epaper?.edition_date || 'आज का संस्करण'}
                </span>
                {fileSizeMb && <span>• {fileSizeMb}</span>}
                {epaper?.is_featured && (
                  <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    मुख्य संस्करण
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow transition-colors font-devanagari"
                title="सीधे पीडीएफ डाउनलोड करें"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>PDF डाउनलोड</span>
              </a>
            )}

            <button
              onClick={handleShare}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow transition-colors font-devanagari"
              title="व्हाट्सएप पर शेयर करें"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">शेयर</span>
            </button>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-neutral-100 transition-colors"
                title="अलग टैब में खोलें"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-neutral-100 transition-colors"
              title={isFullscreen ? 'नॉर्मल स्क्रीन' : 'फुलस्क्रीन पढ़ें'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Viewer Mode Toggles & Helpful Mobile Notice */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <div className="flex items-center gap-1 bg-neutral-200 dark:bg-slate-800 p-1 rounded-xl border border-neutral-300 dark:border-slate-700">
            <button
              onClick={() => setViewerMode('embedded')}
              className={`px-3 py-1.5 rounded-lg font-black text-xs transition-colors flex items-center gap-1.5 font-devanagari ${
                viewerMode === 'embedded'
                  ? 'bg-black text-white shadow'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-black'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>मोबाइल / वेब व्यूअर</span>
            </button>
            <button
              onClick={() => setViewerMode('native')}
              className={`px-3 py-1.5 rounded-lg font-black text-xs transition-colors flex items-center gap-1.5 font-devanagari ${
                viewerMode === 'native'
                  ? 'bg-black text-white shadow'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-black'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>मूल PDF रीडर</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-devanagari hidden sm:block">
            टिप: मोबाइल पर स्क्रॉल और पिंच-ज़ूम करके पूरे अखबार को आसानी से पढ़ें।
          </p>
        </div>

        {/* Main PDF Viewer Container (Responsive & Inside Website Background) */}
        <div
          ref={viewerContainerRef}
          className="bg-white dark:bg-slate-900 rounded-2xl border-4 border-black dark:border-slate-800 shadow-xl overflow-hidden relative flex flex-col"
        >
          {loading ? (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-black dark:text-white animate-spin" />
              <p className="font-black text-sm font-devanagari">ई-पेपर लोड हो रहा है, कृपया प्रतीक्षा करें...</p>
            </div>
          ) : !pdfUrl ? (
            <div className="h-[60vh] flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
              <h3 className="font-black text-base font-devanagari">इस ई-पेपर की पीडीएफ उपलब्ध नहीं है</h3>
              <p className="text-xs text-neutral-600 mt-1 font-devanagari">कृपया एडमिन पैनल से सही पीडीएफ फाइल अपलोड करें।</p>
              <Link to="/epaper" className="mt-4 px-4 py-2 bg-black text-white rounded-xl text-xs font-black font-devanagari">
                सभी ई-पेपर देखें
              </Link>
            </div>
          ) : viewerMode === 'embedded' ? (
            /* Universal Google Docs PDF Viewer (Works smoothly on iOS Safari, Android Chrome, and Desktop) */
            <div className="w-full h-[75vh] sm:h-[82vh] lg:h-[86vh] bg-neutral-100 dark:bg-slate-950 relative">
              <iframe
                src={googleDocsViewerUrl}
                title={epaper?.title || 'E-Paper Reader'}
                className="w-full h-full border-0"
                allow="fullscreen"
              />
            </div>
          ) : (
            /* Native Browser PDF Object Viewer */
            <div className="w-full h-[75vh] sm:h-[82vh] lg:h-[86vh] bg-neutral-100 dark:bg-slate-950">
              <object
                data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                type="application/pdf"
                className="w-full h-full border-0"
              >
                <div className="p-8 text-center space-y-3">
                  <p className="font-bold text-sm font-devanagari">
                    आपके ब्राउज़र में इनलाइन पीडीएफ प्रीव्यू समर्थित नहीं है।
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setViewerMode('embedded')}
                      className="px-4 py-2 bg-black text-white rounded-xl text-xs font-black font-devanagari"
                    >
                      मोबाइल वेब व्यूअर में बदलें
                    </button>
                    <a
                      href={pdfUrl}
                      download
                      className="px-4 py-2 bg-neutral-200 text-black rounded-xl text-xs font-bold font-devanagari"
                    >
                      सीधे PDF डाउनलोड करें
                    </a>
                  </div>
                </div>
              </object>
            </div>
          )}

          {/* Quick Bottom Bar */}
          <div className="p-3 bg-neutral-100 dark:bg-slate-800/80 border-t-2 border-black dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-black text-black dark:text-white font-devanagari">
              दैनिक चित्रकूट ज्योति • डिजिटल ई-पेपर
            </span>
            <div className="flex items-center gap-2 font-bold">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download
                  className="text-black dark:text-white hover:underline font-devanagari flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> PDF फाइल सहेजें
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Other Recent Editions Bar */}
        {allEpapers.length > 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 p-4 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3 font-devanagari">
              अन्य उपलब्ध ई-पेपर संस्करण ({allEpapers.length - 1})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {allEpapers
                .filter(item => item.id !== epaper?.id)
                .map(item => (
                  <Link
                    key={item.id}
                    to={`/epaper/read/${item.id}`}
                    className="group block bg-neutral-50 dark:bg-slate-800 rounded-xl border border-neutral-300 dark:border-slate-700 p-2 hover:border-black transition-all"
                  >
                    <div className="w-full h-24 bg-neutral-200 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
                      {item.cover_public_url ? (
                        <img src={item.cover_public_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-8 h-8 text-neutral-400 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <p className="font-bold text-xs text-black dark:text-white line-clamp-1 font-devanagari">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                      {item.edition_date}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
