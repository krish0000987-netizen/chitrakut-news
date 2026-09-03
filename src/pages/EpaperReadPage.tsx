import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Download, Share2, ArrowLeft, Eye, Calendar, FileText, 
  Maximize2, Minimize2, ExternalLink, MessageCircle, AlertCircle, 
  RefreshCw, ZoomIn, ZoomOut, RotateCcw, Scissors, ChevronLeft, 
  ChevronRight, MapPin, Check, X, Copy, Sparkles, Layers,
  Smartphone, Monitor, BookOpen, Loader2
} from 'lucide-react';
import { epapersService, DbEpaper, CITIES_EDITIONS } from '../services/epapers';
import { generatePdfThumbnail, renderPdfPageToCanvas } from '../lib/pdfHelper';

export const EpaperReadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data States
  const [epaper, setEpaper] = useState<DbEpaper | null>(null);
  const [allEpapers, setAllEpapers] = useState<DbEpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerMode, setViewerMode] = useState<'interactive' | 'embedded'>('interactive');

  // Page caching from real PDF
  const [pageImagesMap, setPageImagesMap] = useState<{ [pageNum: number]: string }>({});
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);

  // Reader Controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCropMode, setIsCropMode] = useState<boolean>(false);

  // Pan / Drag State when zoomed
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Crop / Marquee Selection State
  const [cropBox, setCropBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [isDrawingCrop, setIsDrawingCrop] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const pageImageRef = useRef<HTMLImageElement>(null);

  // Load E-Paper details
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const list = await epapersService.list({ status: 'published' });
        if (!isMounted) return;
        setAllEpapers(list);

        let selected: DbEpaper | undefined;
        if (id && id !== 'latest') {
          selected = list.find(item => item.id === id);
          if (!selected) {
            try {
              selected = await epapersService.getById(id);
            } catch {}
          }
        }
        if (!selected) {
          selected = list.find(item => item.is_featured) || list[0];
        }
        setEpaper(selected || null);
        setCurrentPage(1);
        setZoom(100);
        setPanPos({ x: 0, y: 0 });
        setPageImagesMap({});
      } catch (err) {
        console.error('Failed to load epaper:', err);
      }
      if (isMounted) setLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const pdfUrl = epaper?.pdf_public_url;
  const totalPages = epaper?.page_count || 4;
  const pagesList = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Dynamically extract the real page image from PDF whenever currentPage changes
  useEffect(() => {
    if (!pdfUrl) return;

    // Check if we already rendered this page
    if (pageImagesMap[currentPage]) return;

    let isCancelled = false;
    setIsRenderingPage(true);

    generatePdfThumbnail(pdfUrl, currentPage, 1400)
      .then(({ dataUrl, numPages }) => {
        if (!isCancelled) {
          setPageImagesMap(prev => ({
            ...prev,
            [currentPage]: dataUrl
          }));
          setIsRenderingPage(false);
        }
      })
      .catch((err) => {
        console.warn('PDF page rendering fallback:', err);
        if (!isCancelled) {
          setIsRenderingPage(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, currentPage, pageImagesMap]);

  // Preload remaining pages in background for instant thumbnail switching
  useEffect(() => {
    if (!pdfUrl) return;

    let isCancelled = false;
    const preloadPages = async () => {
      for (let p = 1; p <= totalPages; p++) {
        if (isCancelled) break;
        if (!pageImagesMap[p]) {
          try {
            const { dataUrl } = await generatePdfThumbnail(pdfUrl, p, 400);
            if (!isCancelled) {
              setPageImagesMap(prev => ({ ...prev, [p]: dataUrl }));
            }
          } catch {}
        }
      }
    };

    const timer = setTimeout(preloadPages, 500);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [pdfUrl, totalPages]);

  // Current page image URL: Real rendered PDF page > Cover image > fallback
  const currentImageUrl = pageImagesMap[currentPage] || epaper?.cover_public_url || '';

  // Google Docs Viewer URL provides universal inline rendering on mobile and desktop
  const googleDocsViewerUrl = pdfUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : '';

  // Zoom Handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 60));
  const handleResetZoom = () => {
    setZoom(100);
    setPanPos({ x: 0, y: 0 });
  };

  // Fullscreen Handler
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

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCropModal) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) setCurrentPage(p => p - 1);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      } else if (e.key.toLowerCase() === 'c') {
        setIsCropMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, showCropModal]);

  // Pan Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCropMode) {
      const rect = pageImageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsDrawingCrop(true);
      setCropBox({ startX: x, startY: y, currentX: x, currentY: y });
      return;
    }

    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCropMode && isDrawingCrop && cropBox) {
      const rect = pageImageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      setCropBox(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
      return;
    }

    if (isDragging && zoom > 100) {
      setPanPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    if (isCropMode && isDrawingCrop && cropBox) {
      setIsDrawingCrop(false);
      generateCropImage();
      return;
    }
    setIsDragging(false);
  };

  // Generate Branded Newspaper Clipping Image
  const generateCropImage = useCallback(() => {
    if (!cropBox || !pageImageRef.current) return;
    const img = pageImageRef.current;
    const rect = img.getBoundingClientRect();

    const minX = Math.min(cropBox.startX, cropBox.currentX);
    const minY = Math.min(cropBox.startY, cropBox.currentY);
    const width = Math.abs(cropBox.currentX - cropBox.startX);
    const height = Math.abs(cropBox.currentY - cropBox.startY);

    if (width < 30 || height < 30) {
      setCropBox(null);
      return;
    }

    const scaleX = (img.naturalWidth || rect.width) / rect.width;
    const scaleY = (img.naturalHeight || rect.height) / rect.height;

    const sourceX = minX * scaleX;
    const sourceY = minY * scaleY;
    const sourceWidth = width * scaleX;
    const sourceHeight = height * scaleY;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const headerHeight = 70;
    const footerHeight = 35;
    canvas.width = sourceWidth;
    canvas.height = sourceHeight + headerHeight + footerHeight;

    // Header Background
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Header Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(20, canvas.width * 0.035)}px sans-serif`;
    ctx.fillText('दैनिक चित्रकूट ज्योति', 20, 36);

    // Subheader
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${Math.max(12, canvas.width * 0.02)}px sans-serif`;
    const editionInfo = `${epaper?.city_edition || 'मुख्य संस्करण'} • दिनांक: ${epaper?.edition_date || ''} • पेज नं: ${currentPage}`;
    ctx.fillText(editionInfo, 20, 58);

    // Draw Cropped Image Content
    try {
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, headerHeight, sourceWidth, sourceHeight
      );
    } catch {}

    // Footer Branding Bar
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);

    ctx.fillStyle = '#E5E5E5';
    ctx.font = `${Math.max(11, canvas.width * 0.018)}px sans-serif`;
    ctx.fillText(`ई-पेपर पढ़ें: ${window.location.origin}/epaper`, 20, canvas.height - 12);

    const croppedUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCroppedImageUrl(croppedUrl);
    setShowCropModal(true);
    setIsCropMode(false);
    setCropBox(null);
  }, [cropBox, epaper, currentPage]);

  const handleShareReader = () => {
    const url = window.location.href;
    const text = `📰 दैनिक चित्रकूट ज्योति ई-पेपर (${epaper?.edition_date || ''}) - पेज ${currentPage}\n${epaper?.title || ''}\nयहाँ ऑनलाइन पढ़ें: ${url}`;
    if (navigator.share) {
      navigator.share({ title: epaper?.title || 'चित्रकूट ज्योति', text, url }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleShareCropped = () => {
    const text = `📰 दैनिक चित्रकूट ज्योति अखबार कतरन (${epaper?.edition_date} - पेज ${currentPage}):\nपूरा ई-पेपर पढ़ें: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-[#1F1F1F] text-white font-sans flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-hidden' : ''
      }`}
    >
      {/* 1. TOP READER TOOLBAR (SWADESH NEWS & LAYOUT-365 STYLE) */}
      <header className="bg-[#121212] border-b border-neutral-800 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg z-40">
        
        {/* Left: Back Link & Edition Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/epaper"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-[#8B0000] text-neutral-200 hover:text-white text-xs font-bold transition-colors font-devanagari border border-neutral-700 cursor-pointer"
            title="सभी ई-पेपर संस्करण सूची"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ई-पेपर सूची</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-amber-400 font-devanagari line-clamp-1">
                {epaper?.city_edition || epaper?.title || 'दैनिक चित्रकूट ज्योति'}
              </span>
              <span className="bg-red-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                {epaper?.edition_date}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Viewer Mode Tabs */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => { setViewerMode('interactive'); setIsCropMode(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 font-devanagari cursor-pointer ${
              viewerMode === 'interactive'
                ? 'bg-red-600 text-white shadow font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ई-पेपर ज़ूम & कतरन</span>
          </button>

          <button
            onClick={() => { setViewerMode('embedded'); setIsCropMode(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 font-devanagari cursor-pointer ${
              viewerMode === 'embedded'
                ? 'bg-red-600 text-white shadow font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>वेब PDF मोड</span>
          </button>
        </div>

        {/* Right Actions: Zoom, Crop Tool, Download, Share, Fullscreen */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          {/* Crop Tool Button (कतरन काटें) */}
          <button
            onClick={() => {
              setViewerMode('interactive');
              setIsCropMode(prev => !prev);
              setCropBox(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all font-devanagari shadow-sm cursor-pointer ${
              isCropMode
                ? 'bg-amber-400 text-black ring-2 ring-amber-300 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
            title="अखबार से किसी भी खबर की कतरन काटें (Crop & Share)"
          >
            <Scissors className="w-3.5 h-3.5 text-red-500" />
            <span>{isCropMode ? 'कतरन काटें (सक्रिय)' : 'कतरन काटें'}</span>
          </button>

          {/* Download Full PDF */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors cursor-pointer"
              title="पूरा अखबार PDF डाउनलोड करें"
            >
              <Download className="w-4 h-4 text-amber-400" />
            </a>
          )}

          {/* WhatsApp Share */}
          <button
            onClick={handleShareReader}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            title="व्हाट्सएप पर शेयर करें"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'नॉर्मल स्क्रीन' : 'फुलस्क्रीन पढ़ें'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* CROP MODE HELPER BANNER */}
      {isCropMode && (
        <div className="bg-amber-400 text-black px-4 py-1.5 text-xs font-black flex items-center justify-between z-30 shadow-md font-devanagari">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-red-700" />
            <span>टिप: माउस से खबर के चारों तरफ बॉक्स खींचकर (Drag) कतरन काटें।</span>
          </div>
          <button
            onClick={() => setIsCropMode(false)}
            className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-bold cursor-pointer"
          >
            रद्द करें (Cancel)
          </button>
        </div>
      )}

      {/* 2. MAIN VIEWER CONTENT */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-[#2B2B2B]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-10 h-10 text-red-500 animate-spin" />
            <p className="font-bold text-sm font-devanagari">ई-पेपर लोड हो रहा है...</p>
          </div>
        ) : !epaper ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
            <p className="font-bold font-devanagari text-base">ई-पेपर उपलब्ध नहीं है</p>
            <Link to="/epaper" className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold font-devanagari">
              सभी ई-पेपर देखें
            </Link>
          </div>
        ) : viewerMode === 'embedded' && pdfUrl ? (
          /* Universal Google Docs / Browser Embed (100% Reliable across all devices) */
          <div className="w-full flex-1 bg-neutral-900 relative">
            <iframe
              src={googleDocsViewerUrl}
              title={epaper.title}
              className="w-full h-full border-0 min-h-[78vh]"
              allow="fullscreen"
            />
          </div>
        ) : (
          /* Interactive Zoom & Crop Page Canvas with Real PDF Page */
          <div
            className="flex-1 overflow-hidden relative flex items-center justify-center cursor-default"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Interactive Sub-toolbar for Page & Zoom */}
            <div className="absolute top-3 inset-x-0 z-30 flex justify-center pointer-events-none">
              <div className="bg-black/85 backdrop-blur-md rounded-2xl border border-neutral-700 px-3 py-1.5 flex items-center gap-3 shadow-2xl pointer-events-auto">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded hover:bg-neutral-700 disabled:opacity-30 cursor-pointer"
                  title="पिछला पेज"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold font-devanagari">
                  पेज {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded hover:bg-neutral-700 disabled:opacity-30 cursor-pointer"
                  title="अगला पेज"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-neutral-700" />

                <button onClick={handleZoomOut} className="p-1 hover:text-amber-400 cursor-pointer" title="ज़ूम आउट">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleResetZoom} className="text-[11px] font-mono font-bold hover:text-amber-400 cursor-pointer" title="रीसेट">
                  {zoom}%
                </button>
                <button onClick={handleZoomIn} className="p-1 hover:text-amber-400 cursor-pointer" title="ज़ूम इन">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div 
              className="relative transition-transform duration-75 origin-center select-none"
              style={{
                transform: `scale(${zoom / 100}) translate(${panPos.x / (zoom / 100)}px, ${panPos.y / (zoom / 100)}px)`,
                cursor: isCropMode ? 'crosshair' : zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
            >
              <div className="relative shadow-2xl bg-white border border-neutral-600 rounded-xs overflow-hidden min-w-[320px] min-h-[420px] max-h-[82vh] max-w-[92vw] flex items-center justify-center">
                {isRenderingPage && !currentImageUrl && (
                  <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-2" />
                    <span className="text-xs font-bold text-white font-devanagari">अखबार पेज लोड हो रहा है...</span>
                  </div>
                )}

                {currentImageUrl ? (
                  <img
                    ref={pageImageRef}
                    src={currentImageUrl}
                    alt={`${epaper.title} - पेज ${currentPage}`}
                    crossOrigin="anonymous"
                    className="max-h-[82vh] w-auto object-contain block pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="p-12 text-center text-neutral-800 dark:text-neutral-200">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-2" />
                    <p className="font-bold text-xs font-devanagari">पेज लोड हो रहा है...</p>
                  </div>
                )}

                {/* Crop Box Selection Overlay */}
                {isCropMode && cropBox && (
                  <div
                    className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none z-20"
                    style={{
                      left: Math.min(cropBox.startX, cropBox.currentX),
                      top: Math.min(cropBox.startY, cropBox.currentY),
                      width: Math.abs(cropBox.currentX - cropBox.startX),
                      height: Math.abs(cropBox.currentY - cropBox.startY)
                    }}
                  >
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-bl font-mono">
                      कतरन
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM PAGE THUMBNAILS CAROUSEL STRIP */}
      <footer className="bg-[#121212] border-t border-neutral-800 px-4 py-2.5 shrink-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider font-devanagari hidden sm:block shrink-0">
            पेज गैलरी ({totalPages})
          </span>

          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar mx-auto sm:mx-0">
            {pagesList.map(pageNum => {
              const isCurrent = pageNum === currentPage;
              const thumbUrl = pageImagesMap[pageNum] || epaper?.cover_public_url || '';
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    setZoom(100);
                    setPanPos({ x: 0, y: 0 });
                  }}
                  className={`group relative rounded-lg overflow-hidden border-2 transition-all shrink-0 aspect-[3/4] w-12 sm:w-14 bg-neutral-900 cursor-pointer ${
                    isCurrent
                      ? 'border-red-500 scale-105 shadow-lg ring-2 ring-red-500/50'
                      : 'border-neutral-700 hover:border-neutral-500 opacity-60 hover:opacity-100'
                  }`}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={`Page ${pageNum}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                      <span className="text-[10px] font-mono text-neutral-400">{pageNum}</span>
                    </div>
                  )}
                  <div className={`absolute bottom-0 inset-x-0 text-center text-[10px] font-black py-0.5 font-mono ${
                    isCurrent ? 'bg-red-600 text-white' : 'bg-black/80 text-neutral-300'
                  }`}>
                    {pageNum}
                  </div>
                </button>
              );
            })}
          </div>

          {allEpapers.length > 1 && (
            <div className="hidden md:flex items-center gap-2 text-xs font-devanagari shrink-0">
              <span className="text-neutral-400">अन्य संस्करण:</span>
              <select
                value={epaper?.id}
                onChange={e => navigate(`/epaper/read/${e.target.value}`)}
                className="bg-neutral-800 text-white text-xs font-bold px-2 py-1 rounded-lg border border-neutral-700 outline-none cursor-pointer"
              >
                {allEpapers.map(ep => (
                  <option key={ep.id} value={ep.id}>
                    {ep.city_edition || ep.title} ({ep.edition_date})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </footer>

      {/* 4. CROPPED ARTICLE MODAL (BRANDED CHITRAKOOT JYOTI WATERMARK) */}
      {showCropModal && croppedImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-neutral-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-red-500" />
                <h3 className="font-black text-sm sm:text-base font-devanagari text-white">
                  अखबार कतरन तैयार है (News Clipping)
                </h3>
              </div>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-neutral-800 bg-black p-2 flex items-center justify-center">
              <img
                src={croppedImageUrl}
                alt="अखबार कतरन"
                className="max-h-[50vh] w-auto object-contain rounded shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={croppedImageUrl}
                download={`Chitrakoot-Jyoti-Clipping-${epaper?.edition_date}-Page-${currentPage}.jpg`}
                className="py-2.5 px-4 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors font-devanagari cursor-pointer"
              >
                <Download className="w-4 h-4 text-red-600" />
                <span>कतरन फोटो डाउनलोड</span>
              </a>

              <button
                onClick={handleShareCropped}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors font-devanagari cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप पर भेजें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
