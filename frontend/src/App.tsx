import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ChevronUp } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

import type { AppView } from './core/types/navigation';
export type { AppView };

const DirectoryPage = lazy(() =>
  import('./pages/DirectoryPage').then((m) => ({ default: m.DirectoryPage }))
);
const ConferencesPage = lazy(() =>
  import('./pages/ConferencesPage').then((m) => ({ default: m.ConferencesPage }))
);
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const parseHashRoute = (): { view: AppView; query: string } => {
  if (typeof window === 'undefined') return { view: 'home', query: '' };
  const fullHash = window.location.hash;
  const [rawRoute, rawQuery] = fullHash.split('?');
  const hash = rawRoute.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(rawQuery || window.location.search || '');
  const query = params.get('q') || '';

  if (pathname.startsWith('/conferencias') || hash.startsWith('#conferencias')) {
    return { view: 'conferences', query: '' };
  }
  if (pathname.startsWith('/faq') || hash.startsWith('#faq') || hash.startsWith('#preguntas')) {
    return { view: 'faq', query: '' };
  }
  if (pathname.startsWith('/directorio') || hash === '#directorio' || hash === '#catalogo') {
    return { view: 'directory', query };
  }
  if (hash === '' || hash === '#' || hash === '#inicio' || hash === '#home' || pathname === '/' || pathname === '') {
    return { view: 'home', query: '' };
  }
  return { view: '404', query: '' };
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => parseHashRoute().view);
  const [directorySearchQuery, setDirectorySearchQuery] = useState(() => parseHashRoute().query);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const { view, query } = parseHashRoute();
      setCurrentView(view);
      if (view === 'directory' && query) {
        setDirectorySearchQuery(query);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 350);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const navigateTo = (view: AppView, query?: string) => {
    setCurrentView(view);
    let targetHash = '#inicio';
    if (view === 'directory') {
      const trimmed = query?.trim() || '';
      setDirectorySearchQuery(trimmed);
      targetHash = trimmed ? `#directorio?q=${encodeURIComponent(trimmed)}` : '#directorio';
    } else if (view === 'conferences') {
      const q = query ? (query.startsWith('?') ? query : `?${query}`) : '';
      targetHash = `#conferencias${q}`;
    } else if (view === 'faq') {
      targetHash = '#faq';
    } else if (view === '404') {
      targetHash = '#404';
    }

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#8CF9A9] selection:text-[#0F172A]">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <div className={`flex-grow ${currentView !== 'home' ? 'pt-20' : ''}`}>
        {currentView === 'home' && <HomePage onNavigate={navigateTo} />}
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#008744] border-t-transparent animate-spin" />
            </div>
          }
        >
          {currentView === 'directory' && <DirectoryPage initialSearchQuery={directorySearchQuery} />}
          {currentView === 'conferences' && <ConferencesPage />}
          {currentView === 'faq' && <FaqPage />}
          {currentView === '404' && <NotFoundPage onNavigate={navigateTo} />}
        </Suspense>
      </div>

      <Footer />

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white tactile-btn-green flex items-center justify-center transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-95 group"
          title="Regresar al inicio"
          aria-label="Regresar al inicio"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default App;
