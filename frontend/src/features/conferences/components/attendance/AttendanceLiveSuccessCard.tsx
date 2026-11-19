import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Check,
} from 'lucide-react';
import { ConferenceSummary } from '../../types';
import {
  ConferenceEventSummaryBox,
  ConferenceLocationNotice,
  ParticipantDataSummaryGrid,
} from './ConferenceSuccessCommon';

interface AttendanceLiveSuccessCardProps {
  conference: ConferenceSummary;
  nombres: string;
  apellidos?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  codigoURP?: string | null;
  tipoParticipante: string;
  correo?: string;
  timestampRegistrado: string | null;
  onBackToCalendar: () => void;
  onMarkAnother?: () => void;
}

export const AttendanceLiveSuccessCard: React.FC<AttendanceLiveSuccessCardProps> = ({
  conference,
  nombres,
  apellidos = '',
  tipoDocumento,
  numeroDocumento,
  codigoURP,
  tipoParticipante,
  correo,
  timestampRegistrado,
  onBackToCalendar,
  onMarkAnother,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#0F172A] text-white p-8 text-center border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-[#008744] text-white flex items-center justify-center mx-auto mb-4 border-2 border-[#8CF9A9] shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#8CF9A9] block mb-1">
            Asistencia Registrada
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black leading-tight text-white">
            ¡Asistencia Marcada con Éxito!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            Tu participación en la capacitación en vivo ha sido validada y registrada
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <ConferenceEventSummaryBox
            conference={conference}
            badgeTitle="Actividad Académica"
            timestampRegistrado={timestampRegistrado}
          />

          <ParticipantDataSummaryGrid
            title="Constancia de Marcación en Vivo"
            nombres={nombres}
            apellidos={apellidos}
            tipoDocumento={tipoDocumento}
            numeroDocumento={numeroDocumento}
            codigoURP={codigoURP}
            tipoParticipante={tipoParticipante}
            correo={correo}
            statusText="Presente (En Sesión)"
          />

          <ConferenceLocationNotice
            ubicacionOEnlace={conference.ubicacion_o_Enlace}
            isLiveView={true}
          />

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onMarkAnother && (
              <button
                type="button"
                onClick={onMarkAnother}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-display font-black text-sm tactile-btn-green transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Marcar otra asistencia</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToCalendar}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-display font-black text-sm transition-all cursor-pointer ${
                onMarkAnother
                  ? 'bg-[#0F172A] hover:bg-slate-800 text-white tactile-btn'
                  : 'bg-[#00A859] hover:bg-[#008744] text-white tactile-btn-green'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Calendario de Conferencias</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
