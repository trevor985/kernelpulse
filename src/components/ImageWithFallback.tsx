import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, Download, Copy, Check } from 'lucide-react';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  enableZoom?: boolean;
  caption?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'KernelPulse Image',
  fallbackText,
  enableZoom = false,
  caption,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getInitials = (text?: string) => {
    if (!text) return 'KP';
    return text
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (src) {
      navigator.clipboard.writeText(src);
      setIsCopied(true);
      playSuccessChime();
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 font-mono text-emerald-400 font-bold select-none ${className}`}
        title={alt}
      >
        <span>{getInitials(fallbackText || alt)}</span>
      </div>
    );
  }

  return (
    <>
      <div className={`relative group ${containerClassName}`}>
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-80 blur-xs'} transition-all duration-300 ${enableZoom ? 'cursor-zoom-in' : ''}`}
          onClick={(e) => {
            if (enableZoom) {
              e.stopPropagation();
              playTechClick(800);
              setIsZoomOpen(true);
            }
          }}
          {...props}
        />

        {enableZoom && isLoaded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playTechClick(800);
              setIsZoomOpen(true);
            }}
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-900 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs border border-white/10"
            title="Expand Image"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
              <span className="text-xs font-mono text-slate-300 truncate max-w-xs sm:max-w-md">
                {caption || alt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
                  title="Copy Image URL"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px] hidden sm:inline">Copy Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Display */}
            <div className="relative overflow-auto max-h-[75vh] flex items-center justify-center p-2 bg-slate-950">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[72vh] object-contain rounded-lg"
              />
            </div>

            {/* Caption Footer if provided */}
            {caption && (
              <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-400 font-mono">
                {caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
