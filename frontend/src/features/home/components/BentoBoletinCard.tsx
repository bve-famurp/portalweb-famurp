import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, ExternalLink, X } from 'lucide-react';
import { BoletinSlideDto, FormatoSlide } from '../types/boletinSlide.types';
import { boletinSlideService, resolveSlideImageUrl, FALLBACK_SLIDES } from '../services/boletinSlideService';

interface BentoBoletinCardProps {
  className?: string;
  onNavigate?: (view: any, query?: string) => void;
}

export const BentoBoletinCard: React.FC<BentoBoletinCardProps> = ({
  className = '',
}) => {
  const [slides, setSlides] = useState<BoletinSlideDto[]>(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    boletinSlideService.getBoletinSlides().then((data) => {
      if (isMounted && data.length > 0) {
        setSlides(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isHovered || zoomImageUrl !== null) {
      return;
    }
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, isHovered, zoomImageUrl, handleNext]);

  useEffect(() => {
    if (!zoomImageUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomImageUrl(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomImageUrl]);

  const currentSlide = slides[currentIndex] || slides[0];
  const maxDots = Math.min(slides.length, 5);

  return (
    <>
      <div
        className={`col-span-1 md:col-span-1 md:row-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:row-start-1 rounded-lg border border-slate-200 overflow-hidden shadow-sm relative group min-h-[460px] lg:min-h-[500px] flex flex-col justify-between bg-white select-none ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {currentSlide.formato === FormatoSlide.Vertical ? (
          <div
            className="absolute inset-0 w-full h-full z-0 flex flex-col justify-between bg-[#0F172A] cursor-pointer"
            onClick={() => setZoomImageUrl(resolveSlideImageUrl(currentSlide.imagenUrl))}
          >
            <img
              src={resolveSlideImageUrl(currentSlide.imagenUrl)}
              alt={currentSlide.titulo}
              className="w-full h-full object-cover object-top select-none pointer-events-none"
            />
            {currentSlide.enlaceUrl && (
              <div className="absolute bottom-3 right-3 z-30 pointer-events-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <a
                  href={currentSlide.enlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black/60 hover:bg-[#008744] text-white backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border border-white/15 shadow-md transition-all cursor-pointer"
                  title="Abrir enlace oficial"
                >
                  <span className="font-sans">Abrir</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-between bg-white">
            <div
              className="w-full aspect-[997/1000] max-h-[355px] bg-white overflow-hidden cursor-pointer flex items-center justify-center shrink-0"
              onClick={() => setZoomImageUrl(resolveSlideImageUrl(currentSlide.imagenUrl))}
            >
              <img
                src={resolveSlideImageUrl(currentSlide.imagenUrl)}
                alt={currentSlide.titulo}
                className="w-full h-full object-contain object-top select-none pointer-events-none"
              />
            </div>
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center bg-white border-t border-slate-100 space-y-1 overflow-hidden">
              {currentSlide.enlaceUrl ? (
                <a
                  href={currentSlide.enlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-extrabold text-sm sm:text-base text-[#0F172A] leading-snug line-clamp-2 hover:text-[#008744] transition-colors cursor-pointer flex items-center gap-1.5 group/link"
                >
                  <span>{currentSlide.titulo}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#008744] shrink-0 opacity-80 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <h4 className="font-display font-extrabold text-sm sm:text-base text-[#0F172A] leading-snug line-clamp-2">
                  {currentSlide.titulo}
                </h4>
              )}
              {currentSlide.descripcion && (
                <p className="font-sans text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {currentSlide.descripcion}
                </p>
              )}
            </div>
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Afiche anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-[#008744] text-white flex items-center justify-center transition-all cursor-pointer shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Siguiente afiche"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-[#008744] text-white flex items-center justify-center transition-all cursor-pointer shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              {Array.from({ length: maxDots }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Ir al afiche ${idx + 1}`}
                  className={`transition-all cursor-pointer ${
                    currentIndex % maxDots === idx
                      ? 'w-4 h-1.5 bg-[#8CF9A9] rounded-full'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80 rounded-full'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {zoomImageUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          onClick={() => setZoomImageUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Ampliación de imagen"
        >
          <button
            type="button"
            onClick={() => setZoomImageUrl(null)}
            aria-label="Cerrar ampliación"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={zoomImageUrl}
            alt="Ampliación de afiche"
            className="max-h-[92vh] max-w-[92vw] w-auto h-auto object-contain rounded-md shadow-2xl select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
