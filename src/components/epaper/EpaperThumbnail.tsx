import React, { useState, useEffect, useRef } from 'react';
import { FileText, Loader2, Newspaper } from 'lucide-react';
import { generatePdfThumbnail } from '../../lib/pdfHelper';

interface EpaperThumbnailProps {
  coverUrl?: string;
  pdfUrl?: string;
  title: string;
  editionDate?: string;
  cityEdition?: string;
  className?: string;
  imgClassName?: string;
}

export const EpaperThumbnail: React.FC<EpaperThumbnailProps> = ({
  coverUrl,
  pdfUrl,
  title,
  editionDate,
  cityEdition,
  className = '',
  imgClassName = ''
}) => {
  const [renderedUrl, setRenderedUrl] = useState<string | null>(coverUrl || null);
  const [loading, setLoading] = useState<boolean>(!coverUrl && !!pdfUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    if (coverUrl) {
      setRenderedUrl(coverUrl);
      setLoading(false);
      setHasError(false);
      return;
    }

    if (pdfUrl) {
      setLoading(true);
      generatePdfThumbnail(pdfUrl, 1, 600)
        .then(({ dataUrl }) => {
          if (isMounted) {
            setRenderedUrl(dataUrl);
            setLoading(false);
          }
        })
        .catch(err => {
          console.warn('Could not extract PDF thumbnail:', err);
          if (isMounted) {
            setLoading(false);
            setHasError(true);
          }
        });
    } else {
      setLoading(false);
      setHasError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [coverUrl, pdfUrl]);

  if (loading) {
    return (
      <div className={`w-full h-full bg-neutral-100 dark:bg-slate-800 flex flex-col items-center justify-center p-4 text-center ${className}`}>
        <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-2" />
        <span className="text-[11px] font-bold text-neutral-500 font-devanagari">पेज 1 प्रीव्यू तैयार हो रहा है...</span>
      </div>
    );
  }

  if (renderedUrl && !hasError) {
    return (
      <img
        src={renderedUrl}
        alt={title}
        onError={() => {
          // If coverUrl failed, attempt to generate from pdfUrl
          if (pdfUrl && renderedUrl === coverUrl) {
            setLoading(true);
            generatePdfThumbnail(pdfUrl, 1, 600)
              .then(({ dataUrl }) => {
                setRenderedUrl(dataUrl);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
                setHasError(true);
              });
          } else {
            setHasError(true);
          }
        }}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    );
  }

  // Beautiful Styled Newspaper Cover Mockup fallback (Never an empty gray box!)
  return (
    <div className={`w-full h-full bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 flex flex-col justify-between p-3.5 shadow-inner relative overflow-hidden select-none ${className}`}>
      {/* Newspaper Header */}
      <div className="border-b-2 border-neutral-900 dark:border-neutral-700 pb-2 text-center space-y-1">
        <div className="flex items-center justify-between text-[8px] font-bold text-neutral-500 font-mono border-b border-neutral-200 dark:border-slate-800 pb-0.5">
          <span>{cityEdition || 'चित्रकूट संस्करण'}</span>
          <span>{editionDate || 'दैनिक'}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          <Newspaper className="w-4 h-4 text-[#8B0000]" />
          <h4 className="font-black text-sm tracking-tight text-[#8B0000] dark:text-red-500 font-devanagari leading-none">
            चित्रकूट ज्योति
          </h4>
        </div>
        <p className="text-[7px] text-neutral-500 font-mono uppercase tracking-widest">
          Daily Digital Newspaper
        </p>
      </div>

      {/* Newspaper Column Simulation Lines */}
      <div className="py-2 space-y-2 flex-1 flex flex-col justify-center">
        <div className="bg-neutral-900 dark:bg-neutral-200 h-3 rounded-xs w-5/6 mx-auto mb-1"></div>
        <div className="space-y-1">
          <div className="h-1 bg-neutral-300 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-1 bg-neutral-300 dark:bg-slate-700 rounded w-11/12"></div>
          <div className="h-1 bg-neutral-300 dark:bg-slate-700 rounded w-4/5"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-12 bg-neutral-100 dark:bg-slate-800 rounded border border-neutral-200 dark:border-slate-700 p-1 flex flex-col justify-center">
            <div className="h-1 bg-red-400 rounded w-3/4 mb-1"></div>
            <div className="h-0.5 bg-neutral-300 rounded w-full mb-0.5"></div>
            <div className="h-0.5 bg-neutral-300 rounded w-5/6"></div>
          </div>
          <div className="h-12 bg-neutral-100 dark:bg-slate-800 rounded border border-neutral-200 dark:border-slate-700 p-1 flex flex-col justify-center">
            <div className="h-1 bg-neutral-400 rounded w-3/4 mb-1"></div>
            <div className="h-0.5 bg-neutral-300 rounded w-full mb-0.5"></div>
            <div className="h-0.5 bg-neutral-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      {/* Footer page badge */}
      <div className="pt-1.5 border-t border-neutral-200 dark:border-slate-800 flex items-center justify-between text-[9px] font-bold text-neutral-600 dark:text-neutral-400 font-devanagari">
        <span className="line-clamp-1">{title}</span>
        <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-mono shrink-0">
          पेज 1
        </span>
      </div>
    </div>
  );
};
