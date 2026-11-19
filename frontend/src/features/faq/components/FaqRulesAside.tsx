import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const FaqRulesAside: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!isZoomed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  return (
    <>
      <aside className="lg:col-span-3 flex flex-col sticky top-28 self-start">
        <img
          src="/images/reglamento-interno-bve.webp"
          alt="Reglamento Interno de la Biblioteca Virtual y Especializada FAMURP"
          className="w-full h-auto block rounded-none border-0 shadow-none cursor-zoom-in"
          loading="lazy"
          onClick={() => setIsZoomed(true)}
        />
      </aside>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ampliación del reglamento"
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            aria-label="Cerrar ampliación"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-[#FFFFFF] flex items-center justify-center transition-all cursor-pointer z-50"
          >
            <X className="w-6 h-6 text-[#FFFFFF]" />
          </button>
          <img
            src="/images/reglamento-interno-bve.webp"
            alt="Ampliación del Reglamento Interno"
            className="max-h-[92vh] max-w-[92vw] w-auto h-auto object-contain rounded-none select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
