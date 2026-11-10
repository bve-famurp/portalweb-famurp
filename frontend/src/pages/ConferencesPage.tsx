import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import {
  conferenceService,
  ConferenceSummary,
  ConferenceRegistrationView,
  AttendanceLiveView,
  ConferenceMonthlyCalendar,
  ConferenceCard,
} from '../features/conferences';
import { Pagination } from '../components/common/Pagination';

export const ConferencesPage: React.FC = () => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedConferenceForReg, setSelectedConferenceForReg] = useState<ConferenceSummary | null>(null);
  const [selectedConferenceForAttendance, setSelectedConferenceForAttendance] = useState<ConferenceSummary | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const minDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const canGoPrev =
    viewDate.getFullYear() > minDate.getFullYear() ||
    (viewDate.getFullYear() === minDate.getFullYear() && viewDate.getMonth() > minDate.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setCurrentPage(1);
  };

  const loadConferencesForMonth = async (date: Date) => {
    setIsLoading(true);
    const year = date.getFullYear();
    const month = date.getMonth();
    const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)).toISOString();
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString();

    try {
      const data = await conferenceService.getConferences(startOfMonth, endOfMonth);
      setConferences(data || []);
    } catch {
      setConferences([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConferencesForMonth(viewDate);
  }, [viewDate]);

  const handleUrlHash = () => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const full = `${pathname}${hash}${search}`;

    const attMatch = full.match(/(?:asistencia\/|asistencia=)(\d+)/i);
    const regMatch = full.match(/(?:registro\/|inscripcion=)(\d+)/i);

    if (attMatch && attMatch[1]) {
      const id = parseInt(attMatch[1], 10);
      if (id) {
        const match = conferences.find((c) => c.idConferencia === id);
        if (match) {
          setSelectedConferenceForReg(null);
          setSelectedConferenceForAttendance(match);
        } else {
          conferenceService
            .getConferenceById(id)
            .then((c) => {
              setSelectedConferenceForReg(null);
              setSelectedConferenceForAttendance(c);
            })
            .catch(() => {});
        }
      }
    } else if (regMatch && regMatch[1]) {
      const id = parseInt(regMatch[1], 10);
      if (id) {
        const match = conferences.find((c) => c.idConferencia === id);
        if (match) {
          setSelectedConferenceForAttendance(null);
          setSelectedConferenceForReg(match);
        } else {
          conferenceService
            .getConferenceById(id)
            .then((c) => {
              setSelectedConferenceForAttendance(null);
              setSelectedConferenceForReg(c);
            })
            .catch(() => {});
        }
      }
    } else {
      setSelectedConferenceForReg(null);
      setSelectedConferenceForAttendance(null);
    }
  };

  useEffect(() => {
    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    window.addEventListener('popstate', handleUrlHash);
    return () => {
      window.removeEventListener('hashchange', handleUrlHash);
      window.removeEventListener('popstate', handleUrlHash);
    };
  }, [conferences]);

  const handleOpenRegistration = (conf: ConferenceSummary) => {
    setSelectedConferenceForAttendance(null);
    setSelectedConferenceForReg(conf);
    window.location.hash = `#conferencias?inscripcion=${conf.idConferencia}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCalendar = () => {
    setSelectedConferenceForReg(null);
    setSelectedConferenceForAttendance(null);
    window.location.hash = '#conferencias';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadConferencesForMonth(viewDate);
  };

  const handleOpenAttendance = (conf: ConferenceSummary) => {
    setSelectedConferenceForReg(null);
    setSelectedConferenceForAttendance(conf);
    window.location.hash = `#conferencias?asistencia=${conf.idConferencia}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyShareLink = (conf: ConferenceSummary) => {
    const url = `${window.location.origin}${window.location.pathname}#conferencias?inscripcion=${conf.idConferencia}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(conf.idConferencia);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const totalPages = Math.ceil(conferences.length / ITEMS_PER_PAGE) || 1;
  const paginatedConferences = conferences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const conferenceListRef = useRef<HTMLDivElement>(null);
  const pageKey = `${currentPage}-${viewDate.getTime()}-${paginatedConferences.map((c) => c.idConferencia).join('|')}`;

  useLayoutEffect(() => {
    if (selectedConferenceForAttendance || selectedConferenceForReg) return;
    if (!conferenceListRef.current || paginatedConferences.length === 0) return;

    const items = conferenceListRef.current.querySelectorAll('.conference-card-item');
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: -70,
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
    }, conferenceListRef);

    return () => {
      ctx.revert();
    };
  }, [pageKey, selectedConferenceForAttendance, selectedConferenceForReg]);

  if (selectedConferenceForAttendance) {
    return (
      <div className="w-full pb-20 pt-6">
        <AttendanceLiveView
          conference={selectedConferenceForAttendance}
          onBackToCalendar={handleBackToCalendar}
        />
      </div>
    );
  }

  if (selectedConferenceForReg) {
    return (
      <div className="w-full pb-20 pt-6">
        <ConferenceRegistrationView
          conference={selectedConferenceForReg}
          onBackToCalendar={handleBackToCalendar}
        />
      </div>
    );
  }

  return (
    <div className="w-full pb-20 overflow-x-hidden">
      <main className="max-w-[1280px] mx-auto px-6 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Próximas Actividades
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Capacitaciones, talleres de investigación y conferencias médicas del mes
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#008744] animate-spin" />
                <p className="text-xs font-bold text-slate-600">Cargando actividades del mes...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="w-14 h-14 rounded-lg bg-[#008744]/10 text-[#008744] flex items-center justify-center mx-auto mb-3 border border-slate-200">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <h3 className="font-display font-black text-lg text-slate-900 mb-1">
                  Sin conferencias programadas
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  En este mes no se registran conferencias. Puedes revisar los meses siguientes usando el calendario institucional.
                </p>
              </div>
            ) : (
              <div ref={conferenceListRef} className="flex flex-col gap-5">
                {paginatedConferences.map((conf) => (
                  <div key={conf.idConferencia} className="conference-card-item">
                    <ConferenceCard
                      conf={conf}
                      isCopied={copiedId === conf.idConferencia}
                      onCopyShareLink={handleCopyShareLink}
                      onOpenAttendance={handleOpenAttendance}
                      onOpenRegistration={handleOpenRegistration}
                    />
                  </div>
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={conferences.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  itemName="actividades"
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6 order-1 lg:order-2">
            <ConferenceMonthlyCalendar
              viewDate={viewDate}
              conferences={conferences}
              canGoPrev={canGoPrev}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};
