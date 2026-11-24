import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { AppView } from '../../../core/types/navigation';
import type { HomeActivityItem } from '../types/homeExternal.types';
import { HomeUpcomingActivities } from './HomeUpcomingActivities';
import { HERO_SLIDES } from '../constants/heroConstants';

interface HomeHeroProps {
  onNavigate: (view: AppView, query?: string) => void;
  loadActivities?: () => Promise<HomeActivityItem[]>;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate, loadActivities }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      HERO_SLIDES.slice(1).forEach((slide) => {
        const img = new Image();
        img.src = slide.src;
      });
    }, 1500);

    return () => clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleDotClick = (idx: number) => {
    setCurrentSlide(idx);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#0F172A] text-slate-900 pt-28 sm:pt-32 pb-20 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden transition-colors duration-200"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.src}
              alt={slide.alt}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding={idx === 0 ? 'sync' : 'async'}
              fetchPriority={idx === 0 ? 'high' : 'low'}
              className={`absolute inset-0 w-full h-full object-cover object-center ${
                idx === currentSlide ? 'hero-slide-active' : 'hero-slide-inactive'
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/40 to-transparent via-40% to-70% z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/25 via-transparent to-transparent z-10"></div>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center lg:min-h-[500px]">
          <div
            aria-live="polite"
            className="lg:col-span-7 grid [grid-template-areas:'hero-text'] items-center min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]"
          >
            {HERO_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                aria-hidden={idx !== currentSlide}
                className={`[grid-area:hero-text] space-y-4 transition-opacity duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  idx === currentSlide
                    ? 'opacity-100 pointer-events-auto z-10'
                    : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <h1
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-lora font-normal sm:font-medium text-white leading-[1.08] tracking-tight ${
                    idx === currentSlide ? 'hero-reveal-title' : ''
                  }`}
                >
                  {slide.titlePrefix}{' '}
                  <span className="italic font-normal text-[#8CF9A9]">
                    {slide.titleHighlight}
                  </span>{' '}
                  {slide.titleSuffix}
                </h1>

                <p
                  className={`text-base sm:text-lg text-slate-300 font-sans max-w-xl leading-relaxed ${
                    idx === currentSlide ? 'hero-reveal-desc' : ''
                  }`}
                >
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <div className="w-full max-w-[420px]">
              <HomeUpcomingActivities onNavigate={onNavigate} loadActivities={loadActivities} />
            </div>
          </div>
        </div>
      </div>

      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 select-none"
      >
        <button
          type="button"
          onClick={handlePrevSlide}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          title="Imagen anterior"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => handleDotClick(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 cursor-pointer drop-shadow-md ${
                idx === currentSlide
                  ? 'bg-[#8CF9A9] ring-2 ring-[#8CF9A9]/40'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              title={`Ir a imagen ${idx + 1}`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextSlide}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          title="Imagen siguiente"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
