import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Search, ArrowRight } from 'lucide-react';
import { basesDeDatosAdapter, MedicalDatabase } from '../../guides';
import { BentoHexCard } from './BentoHexCard';
import { HomeBentoMolecularBonds } from './HomeBentoMolecularBonds';
import { HEX_POSITIONS } from '../constants/bentoGridGeometry';

interface BentoDatabasesCardProps {
  className?: string;
  onNavigate?: (view: string, query?: string) => void;
}

const FALLBACK_TICKER_ITEMS = [
  'Bases de Datos Médicas',
  'UpToDate Anywhere',
  'ClinicalKey',
  'PubMed NLM',
  'DynaMed EBM',
  'ScienceDirect',
  'AccessMedicina',
  'BMJ Best Practice',
  'Scopus',
  'Nature Medicine',
  'Cochrane Library',
  'Embase',
];

export const BentoDatabasesCard: React.FC<BentoDatabasesCardProps> = ({
  className = '',
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<MedicalDatabase[]>([]);
  const [tickerItems, setTickerItems] = useState<string[]>(FALLBACK_TICKER_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedHexIds, setFlippedHexIds] = useState<Set<number>>(new Set());
  const [isAllFlipped, setIsAllFlipped] = useState(false);
  const hexTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const allFlipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTouchRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    basesDeDatosAdapter
      .getMatrizHexagonal()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setResources(data);
          const names = data.map((r) => r.title).filter(Boolean);
          if (names.length > 0) {
            setTickerItems(names);
          }
          data.forEach((r) => {
            const url = basesDeDatosAdapter.getLogoUrl(r.logoFile);
            if (url) {
              const img = new Image();
              img.src = url;
            }
          });
        }
        if (isMounted) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (allFlipTimerRef.current) clearTimeout(allFlipTimerRef.current);
      hexTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleHexHover = (id: number) => {
    if (Date.now() - lastTouchRef.current < 800) {
      return;
    }

    const existingTimer = hexTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      hexTimersRef.current.delete(id);
    }

    setFlippedHexIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const timer = setTimeout(() => {
      setFlippedHexIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      hexTimersRef.current.delete(id);
    }, 7000);

    hexTimersRef.current.set(id, timer);
  };

  const handleHexClick = (id: number) => {
    const existingTimer = hexTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      hexTimersRef.current.delete(id);
    }

    setFlippedHexIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFlipAll = () => {
    if (allFlipTimerRef.current) {
      clearTimeout(allFlipTimerRef.current);
    }
    hexTimersRef.current.forEach((timer) => clearTimeout(timer));
    hexTimersRef.current.clear();

    if (isAllFlipped || flippedHexIds.size > 0) {
      setIsAllFlipped(false);
      setFlippedHexIds(new Set());
    } else {
      setIsAllFlipped(true);
      allFlipTimerRef.current = setTimeout(() => {
        setIsAllFlipped(false);
      }, 5000);
    }
  };

  const hexagonResources = useMemo(() => {
    const selected = resources.filter((r) => r.mostrarEnHexagonos);
    if (selected.length >= 15) {
      return selected.slice(0, 15);
    }
    const selectedIds = new Set(selected.map((r) => r.rawId));
    const fallbackCandidates = resources.filter(
      (r) => !selectedIds.has(r.rawId) && Boolean(r.logoFile)
    );
    const combined = [...selected, ...fallbackCandidates];
    if (combined.length >= 15) {
      return combined.slice(0, 15);
    }
    const remaining = resources.filter(
      (r) => !combined.some((c) => c.rawId === r.rawId)
    );
    return [...combined, ...remaining].slice(0, 15);
  }, [resources]);

  const activeSlots = useMemo(() => {
    return HEX_POSITIONS.map((pos, index) => {
      const res = hexagonResources[index];
      return {
        id: res ? res.rawId : index + 1000,
        resource: res || null,
        col: pos.col,
        row: pos.row,
        innerBond: pos.innerBond,
      };
    });
  }, [hexagonResources]);

  useEffect(() => {
    const tracks = [
      { interval: 3500, unflipDelay: 2500, initialDelay: 800 },
      { interval: 5400, unflipDelay: 3900, initialDelay: 2400 },
      { interval: 4400, unflipDelay: 3100, initialDelay: 1600 },
    ];

    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    tracks.forEach((track) => {
      const startTrack = () => {
        const intervalId = setInterval(() => {
          if (isAllFlipped || activeSlots.length === 0) return;

          setFlippedHexIds((prev) => {
            const availableSlots = activeSlots.filter((slot) => !prev.has(slot.id));
            if (availableSlots.length === 0) return prev;

            const randomSlot =
              availableSlots[Math.floor(Math.random() * availableSlots.length)];
            const targetId = randomSlot.id;

            const next = new Set(prev);
            next.add(targetId);

            const unflipTimer = setTimeout(() => {
              setFlippedHexIds((curr) => {
                if (!curr.has(targetId)) return curr;
                const updated = new Set(curr);
                updated.delete(targetId);
                return updated;
              });
              hexTimersRef.current.delete(targetId);
            }, track.unflipDelay);

            const existing = hexTimersRef.current.get(targetId);
            if (existing) clearTimeout(existing);
            hexTimersRef.current.set(targetId, unflipTimer);

            return next;
          });
        }, track.interval);

        intervals.push(intervalId);
      };

      const delayId = setTimeout(startTrack, track.initialDelay);
      timeouts.push(delayId);
    });

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      intervals.forEach((id) => clearInterval(id));
    };
  }, [activeSlots, isAllFlipped]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigate && searchQuery.trim()) {
      onNavigate('directory', searchQuery.trim());
    } else if (onNavigate) {
      onNavigate('directory');
    }
  };

  return (
    <div
      className={`col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 lg:col-start-1 lg:row-start-1 rounded-lg border border-slate-200 bg-white p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative min-h-[460px] lg:min-h-[500px] ${className}`}
    >
      <div className="w-full text-left space-y-3">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#008744] block">
            Colección Científica Especializada
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0F172A] tracking-tight">
            Bases de Datos Medicina
          </h2>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar base de datos, por asignatura académica o recurso..."
              aria-label="Buscar base de datos, por asignatura académica o recurso"
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-lg border border-slate-300 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859] shadow-md transition-all"
            />
          </div>
          <button
            type="submit"
            aria-label="Buscar base de datos"
            title="Buscar base de datos"
            className="bg-[#00A859] hover:bg-[#008744] text-white font-bold px-7 py-3.5 rounded-lg transition-all tactile-btn-green flex items-center justify-center gap-1.5 shrink-0 cursor-pointer text-sm"
          >
            <span>Buscar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="w-full overflow-hidden py-1.5 border-y border-slate-100 select-none">
          <div className="animate-marquee-slow flex items-center gap-6 text-xs text-slate-600 font-semibold tracking-wide select-none">
            {[...tickerItems, ...tickerItems].map((name, index) => (
              <React.Fragment key={`${name}-${index}`}>
                <span>{name}</span>
                <span className="text-[#008744] font-black text-sm">&bull;</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center sm:justify-between py-2 sm:py-4 flex-1 overflow-visible gap-2 sm:gap-4 lg:gap-6">
        <div className="hidden sm:flex items-center justify-center shrink-0 w-36 sm:w-44 md:w-56 lg:w-64 select-none pointer-events-none mb-2 sm:mb-3 lg:mb-4">
          <img
            src="/doctor-v3-guia-animado.svg"
            alt="Doctor Guía URP"
            className="w-full h-auto object-contain max-h-[240px] sm:max-h-[285px] md:max-h-[330px] lg:max-h-[360px] drop-shadow-md select-none transform -translate-y-0.5 sm:-translate-y-1"
          />
        </div>
        <div className="relative w-full max-w-[460px] sm:max-w-[475px] lg:max-w-[495px] aspect-[510/360] select-none mx-auto sm:ml-auto translate-x-[9.02%] sm:translate-x-2 lg:translate-x-4">
          <div
            className="absolute cursor-pointer group z-20 select-none touch-manipulation"
            style={{
              left: `${(17 / 510) * 100}%`,
              top: `${(174.707 / 360) * 100}%`,
              width: `${(96 / 510) * 100}%`,
              height: `${(83.138 / 360) * 100}%`,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
            onClick={handleFlipAll}
            onTouchStart={() => {
              lastTouchRef.current = Date.now();
            }}
            title="Girar todos los recursos"
            aria-label="Girar todos los recursos"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlipAll();
              }
            }}
          >
            <svg viewBox="0 0 96 83.14" className="w-full h-full overflow-visible drop-shadow-xs">
              <polygon
                points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                className="fill-white group-hover:fill-white stroke-[#0F172A] group-hover:stroke-[#008744] stroke-[2] group-hover:stroke-[2.5] transition-all duration-200"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 group-hover:text-[#008744] transition-colors p-1 select-none pointer-events-none">
              <RotateCcw
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${
                  isAllFlipped ? 'rotate-180 text-[#008744]' : 'group-hover:-rotate-45'
                }`}
              />
              <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider mt-0.5 text-slate-500 group-hover:text-[#008744]">
                {isAllFlipped ? 'Volver' : 'Girar'}
              </span>
            </div>
          </div>

          <HomeBentoMolecularBonds />

          {activeSlots.map((slot) => (
            <BentoHexCard
              key={slot.id}
              slot={slot}
              isFlipped={isAllFlipped || flippedHexIds.has(slot.id)}
              isAllFlipped={isAllFlipped}
              isLoading={isLoading}
              onClick={handleHexClick}
              onTouchStart={() => {
                lastTouchRef.current = Date.now();
              }}
              onMouseEnter={handleHexHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
