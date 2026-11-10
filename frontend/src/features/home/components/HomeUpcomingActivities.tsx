import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { conferenceService, ConferenceSummary } from '../../conferences';

interface HomeUpcomingActivitiesProps {
  className?: string;
  onNavigate: (view: 'conferences', query?: string) => void;
}

export const HomeUpcomingActivities: React.FC<HomeUpcomingActivitiesProps> = ({
  className = '',
  onNavigate,
}) => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await conferenceService.getConferences();
        if (isMounted) {
          setConferences(data || []);
        }
      } catch {
        if (isMounted) {
          setConferences([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedActivities = conferences.slice(0, 3);

  const handleConferenceClick = (idConferencia: number) => {
    onNavigate('conferences', `inscripcion=${idConferencia}`);
  };

  const activitiesKey = displayedActivities.map((a) => a.idConferencia).join('|');

  useLayoutEffect(() => {
    if (!listRef.current || displayedActivities.length === 0) return;

    const items = listRef.current.querySelectorAll('.upcoming-activity-item');
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: 60,
          filter: 'blur(6px)',
        },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          clearProps: 'transform,filter',
          overwrite: 'auto',
        }
      );
    }, listRef);

    return () => {
      ctx.revert();
    };
  }, [activitiesKey]);

  return (
    <div className={`bg-white rounded-lg border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-7 flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mb-1">
          Próximas Actividades
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Conferencias y capacitaciones programadas.
        </p>

        {isLoading ? (
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />
            <div className="space-y-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                {idx > 0 && <div className="w-4/5 mx-auto border-t border-slate-200/60 mb-4" />}
                <div className="flex items-center gap-4 py-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-lg bg-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="space-y-1.5">
                      <div className={`h-3.5 bg-slate-200 rounded ${idx === 1 ? 'w-11/12' : 'w-4/5'}`} />
                      <div className={`h-3 bg-slate-200/70 rounded ${idx === 2 ? 'w-2/5' : 'w-3/5'}`} />
                    </div>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-200 shrink-0" />
                      <div className="h-3 bg-slate-200/80 rounded w-28" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

          </div>
        ) : displayedActivities.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600">
              No hay conferencias próximas por ahora
            </p>
          </div>
        ) : (
          <div ref={listRef} className="space-y-4">
            {displayedActivities.map((act, idx) => {
              const startDate = new Date(act.fechaHoraInicio);
              const endDate = new Date(act.fechaHoraFin);
              const dayStr = isNaN(startDate.getTime()) ? '--' : startDate.getDate().toString().padStart(2, '0');
              const monthStr = isNaN(startDate.getTime()) 
                ? '--' 
                : startDate.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase().replace('.', '');
              const timeStr = `${startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <div key={act.idConferencia} className="upcoming-activity-item">
                  {idx > 0 && <div className="w-4/5 mx-auto border-t border-slate-200/60 mb-4"></div>}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver información de: ${act.tituloEvento}`}
                    title={act.tituloEvento}
                    onClick={() => handleConferenceClick(act.idConferencia)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleConferenceClick(act.idConferencia);
                      }
                    }}
                    className="flex items-center gap-4 cursor-pointer group py-1 focus:outline-none focus:ring-2 focus:ring-[#008744] rounded-lg"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-lg ${act.estadoEvento === 'Finalizada' ? 'bg-slate-950 text-slate-300' : 'bg-[#0F172A] text-white'} flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      <span className="text-xl sm:text-2xl font-display font-black leading-none">{dayStr}</span>
                      <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5 ${act.estadoEvento === 'Finalizada' ? 'text-slate-400' : 'text-[#8CF9A9]'}`}>{monthStr}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008744] transition-colors line-clamp-2">
                        {act.tituloEvento}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{timeStr}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-6 mt-4">
        <button
          type="button"
          onClick={() => onNavigate('conferences')}
          aria-label="Ver Calendario Completo"
          title="Ver Calendario Completo"
          className="w-full py-3 px-4 rounded-lg border-2 border-slate-900 hover:bg-[#008744] hover:text-white font-bold text-xs text-slate-900 tactile-btn flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Ver Calendario Completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
