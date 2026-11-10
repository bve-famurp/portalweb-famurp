import React from 'react';
import { Clock, MapPin, Video, Radio, Share2, Check } from 'lucide-react';
import { ConferenceSummary } from '../../types';


interface ConferenceCardProps {
  conf: ConferenceSummary;
  isCopied: boolean;
  onCopyShareLink: (conf: ConferenceSummary) => void;
  onOpenAttendance: (conf: ConferenceSummary) => void;
  onOpenRegistration: (conf: ConferenceSummary) => void;
}

export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conf,
  isCopied,
  onCopyShareLink,
  onOpenAttendance,
  onOpenRegistration,
}) => {
  const startDate = new Date(conf.fechaHoraInicio);
  const endDate = new Date(conf.fechaHoraFin);
  const dayStr = isNaN(startDate.getTime()) ? '15' : startDate.getDate().toString().padStart(2, '0');
  const monthStr = isNaN(startDate.getTime())
    ? 'NOV'
    : startDate.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase();
  const timeStr = `${startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

  const isFinalizada = conf.estadoEvento === 'Finalizada';

  return (
    <div className="bg-white rounded-lg border-2 border-slate-900 transition-all duration-150 hover:shadow-urp-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 overflow-hidden flex flex-col sm:flex-row group cursor-pointer">
      <div className={`${isFinalizada ? 'bg-slate-950 text-slate-300' : 'bg-[#0F172A] text-white'} flex flex-col items-center justify-center p-6 min-w-[120px] shrink-0 font-display font-black shadow-inner transition-colors`}>
        <span className="text-3xl sm:4xl leading-none">{dayStr}</span>
        <span className={`text-xs uppercase tracking-widest font-extrabold mt-1 ${isFinalizada ? 'text-slate-400' : 'text-[#8CF9A9]'}`}>{monthStr}</span>
        <span className={`text-[10px] font-medium mt-1 ${isFinalizada ? 'text-slate-500' : 'text-slate-400'}`}>
          {conf.modalidad}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {timeStr}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                {conf.modalidad === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                )}
                {conf.modalidad === 'Virtual' ? 'Sala Virtual URP' : 'Auditorio Principal FAMURP'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {conf.asistenciaAbierta && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#008744] text-[10px] font-black border border-[#008744]/40 animate-pulse">
                  <Radio className="w-3 h-3 text-[#008744]" />
                  Asistencia Abierta
                </span>
              )}
              {isFinalizada && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 text-[10px] font-black border border-slate-800">
                  Finalizada
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
            {conf.tituloEvento}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Ponente: <strong>{conf.expositorPonente}</strong> | Patrocinado por: <em>{conf.entidadEditorial}</em>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isFinalizada}
              onClick={() => !isFinalizada && onCopyShareLink(conf)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isFinalizada
                  ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
              }`}
              title={isFinalizada ? 'Conferencia concluida' : 'Copiar enlace de invitación'}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#008744]" />
                  <span className="text-[#008744] font-bold">Enlace copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {conf.asistenciaAbierta && (
              <button
                type="button"
                onClick={() => onOpenAttendance(conf)}
                className="py-2 px-4 rounded-lg border-2 border-[#008744] bg-[#00A859] hover:bg-[#008744] text-white font-bold text-xs transition-all tactile-btn cursor-pointer flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Marcar Asistencia</span>
              </button>
            )}
            {isFinalizada ? (
              <button
                type="button"
                disabled
                className="py-2 px-5 rounded-lg border-2 border-slate-300 bg-slate-100 font-bold text-xs text-slate-400 cursor-not-allowed"
              >
                Evento Concluido
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenRegistration(conf)}
                className="py-2 px-5 rounded-lg border-2 border-slate-900 font-bold text-xs text-slate-900 hover:bg-slate-900 hover:text-white transition-all tactile-btn cursor-pointer"
              >
                Inscribirme
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
