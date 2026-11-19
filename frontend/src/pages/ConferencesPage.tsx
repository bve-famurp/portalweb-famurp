import React, { useState, useEffect, useRef } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';
import {
  conferenceService,
  ConferenceSummary,
  ConferenceMonthlyCalendar,
  ConferenceCard,
} from '../features/conferences';
import { Pagination } from '../components/common/Pagination';
import { useGsapEntrance } from '../utils/useGsapEntrance';

export const ConferencesPage: React.FC = () => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleCopyShareLink = (conf: ConferenceSummary) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#conferencias`;
    const shareText = `${conf.tituloEvento} | ${conf.expositorPonente} (${conf.ubicacion_o_Enlace || 'Auditorio FAMURP'})`;
    if (navigator.share) {
      navigator.share({
        title: conf.tituloEvento,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        setCopiedId(conf.idConferencia);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  const totalPages = Math.ceil(conferences.length / ITEMS_PER_PAGE) || 1;
  const paginatedConferences = conferences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const conferenceListRef = useRef<HTMLDivElement>(null);
  const pageKey = `${currentPage}-${viewDate.getTime()}-${paginatedConferences.map((c) => c.idConferencia).join('|')}`;

  useGsapEntrance(
    conferenceListRef,
    '.conference-card-item',
    [pageKey],
    {
      x: -70,
      blur: 6,
      duration: 0.85,
      stagger: 0.12,
    }
  );

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
