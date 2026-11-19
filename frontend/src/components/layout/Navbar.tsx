import React, { useState, useEffect } from 'react';
import { ExternalLink, Menu, X } from 'lucide-react';
import type { AppView } from '../../core/types/navigation';
import { HeaderBrandBadge } from './HeaderBrandBadge';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 20);
  const isNonHome = currentView !== 'home';

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none w-full">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex justify-between items-center w-full h-20">
          <HeaderBrandBadge
            onNavigate={(view) => {
              onNavigate(view);
              setMobileMenuOpen(false);
            }}
            isLightBackground={isNonHome}
            className="pointer-events-auto"
          />
        </div>
      </div>

      <header className="sticky top-0 -mb-20 z-50 w-full overflow-x-clip pointer-events-none">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex justify-end items-center w-full h-20">
          <div className="relative pointer-events-auto h-20 flex items-center">
            <div
              className={`absolute top-0 bottom-0 -left-6 sm:-left-8 -right-[100vw] rounded-bl-3xl border-b border-l pointer-events-none backdrop-blur-md transform-gpu transition-all duration-300 ease-in-out ${
                isNonHome
                  ? isScrolled
                    ? 'bg-[#0F172A]/90 border-slate-800 shadow-md'
                    : 'bg-[#0F172A] border-slate-800 shadow-sm'
                  : isScrolled
                    ? 'bg-white/75 border-slate-200/70 shadow-md'
                    : 'bg-white border-slate-200 shadow-sm'
              }`}
            />

            <nav className="relative z-10 hidden md:flex items-center gap-6 lg:gap-8">
              <button
                type="button"
                onClick={() => onNavigate('directory')}
                className={`font-sans text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  currentView === 'directory'
                    ? isNonHome
                      ? 'text-[#8CF9A9] border-b-2 border-[#8CF9A9] pb-1'
                      : 'text-[#008744] border-b-2 border-[#008744] pb-1'
                    : isNonHome
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                Bases de Datos
              </button>
              <button
                type="button"
                onClick={() => onNavigate('conferences')}
                className={`font-sans text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  currentView === 'conferences'
                    ? isNonHome
                      ? 'text-[#8CF9A9] border-b-2 border-[#8CF9A9] pb-1'
                      : 'text-[#008744] border-b-2 border-[#008744] pb-1'
                    : isNonHome
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                Conferencias
              </button>
              <a
                href="https://biblioteca.urp.edu.pe/abnopac/"
                target="_blank"
                rel="noreferrer"
                className={`font-sans text-sm font-semibold transition-colors duration-200 inline-flex items-center gap-1.5 ${
                  isNonHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                <span>Catálogo de Libros</span>
                <ExternalLink className={`w-3.5 h-3.5 ${isNonHome ? 'text-slate-400' : 'text-slate-400'}`} />
              </a>
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`relative z-10 md:hidden flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-colors ${
                isNonHome
                  ? 'text-white hover:text-[#8CF9A9] hover:bg-slate-800'
                  : 'text-slate-800 hover:text-[#008744] hover:bg-white'
              }`}
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-[#0F172A] pointer-events-auto flex flex-col">
            <div className="px-6 h-20 flex items-center justify-between border-b border-slate-800 shrink-0">
              <HeaderBrandBadge
                onNavigate={(view) => {
                  onNavigate(view);
                  setMobileMenuOpen(false);
                }}
                isLightBackground={false}
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white hover:text-[#8CF9A9] transition-colors cursor-pointer rounded-lg"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4 text-white overflow-y-auto flex-1">
              <button
                type="button"
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 font-sans text-base font-semibold text-slate-200 hover:text-[#8CF9A9] transition-colors cursor-pointer"
              >
                Inicio
              </button>
              <button
                type="button"
                onClick={() => { onNavigate('directory'); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 font-sans text-base font-semibold text-slate-200 hover:text-[#8CF9A9] transition-colors cursor-pointer"
              >
                Bases de Datos
              </button>
              <button
                type="button"
                onClick={() => { onNavigate('conferences'); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 font-sans text-base font-semibold text-slate-200 hover:text-[#8CF9A9] transition-colors cursor-pointer"
              >
                Conferencias
              </button>
              <a
                href="https://biblioteca.urp.edu.pe/abnopac/"
                target="_blank"
                rel="noreferrer"
                className="block w-full text-left py-2 font-sans text-base font-semibold text-slate-200 hover:text-[#8CF9A9] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Catálogo de Libros</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
