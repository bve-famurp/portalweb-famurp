import React from 'react';
import {
  User,
  Building2,
  Video,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { ConferenceSummary } from '../../types';

export interface ConferenceEventSummaryBoxProps {
  conference: ConferenceSummary;
  badgeTitle?: string;
  timestampRegistrado?: string | null;
}

export const ConferenceEventSummaryBox: React.FC<ConferenceEventSummaryBoxProps> = ({
  conference,
  badgeTitle = 'Actividad Académica',
  timestampRegistrado,
}) => {
  const startDate = new Date(conference.fechaHoraInicio);
  const endDate = new Date(conference.fechaHoraFin);

  return (
    <div className="bg-slate-50 p-6 rounded-xl space-y-3 border border-slate-200">
      <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
        {badgeTitle}
      </h2>
      <p className="text-base sm:text-lg font-display font-black text-slate-900">
        {conference.tituloEvento}
      </p>
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-600 pt-1">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#008744]" />
          <span>{conference.expositorPonente}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#008744]" />
          <span>{conference.entidadEditorial}</span>
        </span>

        {timestampRegistrado ? (
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#008744]" />
            <span>Hora de marcación: <strong>{timestampRegistrado}</strong></span>
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              {conference.modalidad === 'Virtual' ? (
                <Video className="w-3.5 h-3.5 text-[#008744]" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-[#008744]" />
              )}
              <span>{conference.modalidad}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#008744]" />
              <span>
                {startDate.toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#008744]" />
              <span>
                {startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} -{' '}
                {endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export interface ConferenceLocationNoticeProps {
  ubicacionOEnlace?: string | null;
  isLiveView?: boolean;
}

export const ConferenceLocationNotice: React.FC<ConferenceLocationNoticeProps> = ({
  ubicacionOEnlace,
  isLiveView = false,
}) => {
  if (!ubicacionOEnlace) return null;

  const isLink = ubicacionOEnlace.startsWith('http');

  if (isLink) {
    return (
      <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
            <Video className="w-4 h-4 text-[#008744]" />
            <span>{isLiveView ? 'Transmisión en Vivo (Sala Virtual)' : 'Acceso a la Sala Virtual'}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {isLiveView
              ? 'Puedes regresar a la sala de videoconferencia para continuar la capacitación.'
              : 'Podrás conectarte el día de la sesión usando el siguiente enlace institucional:'}
          </p>
          {!isLiveView && (
            <a
              href={ubicacionOEnlace}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-sans font-bold text-[#008744] hover:underline break-all block pt-0.5"
            >
              {ubicacionOEnlace}
            </a>
          )}
        </div>
        <a
          href={ubicacionOEnlace}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white text-xs font-bold tactile-btn transition-all cursor-pointer shrink-0 self-start sm:self-center"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{isLiveView ? 'Volver a la Sala Virtual' : 'Ingresar a la Sala'}</span>
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-[#008744]" />
          <span>{isLiveView ? 'Ubicación del Evento' : 'Lugar del Evento'}</span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-bold">
          {ubicacionOEnlace}
        </p>
      </div>
    </div>
  );
};

export interface ParticipantDataSummaryGridProps {
  title: string;
  nombres: string;
  apellidos?: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  codigoURP?: string | null;
  tipoParticipante: string;
  correo?: string;
  statusText?: string;
  isValidatedStudent?: boolean;
}

export const ParticipantDataSummaryGrid: React.FC<ParticipantDataSummaryGridProps> = ({
  title,
  nombres,
  apellidos = '',
  tipoDocumento,
  numeroDocumento,
  codigoURP,
  tipoParticipante,
  correo,
  statusText,
  isValidatedStudent = false,
}) => {
  const displayTipoDoc =
    tipoDocumento === 'DNI' || tipoDocumento === 'DNI o CE' || !tipoDocumento
      ? 'DNI o CE'
      : tipoDocumento;

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-2.5">
      {isValidatedStudent ? (
        <>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#008744]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#008744]">
              Validación Institucional Exitosa
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Tus datos fueron correctamente validados en el padrón oficial de la facultad.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-slate-800 pt-1">
            <p><strong>Código URP:</strong> {codigoURP || numeroDocumento}</p>
            <p><strong>Estamento:</strong> {tipoParticipante}</p>
            {correo && <p className="sm:col-span-2"><strong>Correo:</strong> {correo}</p>}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xs font-black uppercase tracking-wider text-[#008744]">
            {title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-slate-800">
            <p>
              <strong>{statusText ? 'Participante:' : 'Nombres y Apellidos:'}</strong> {nombres} {apellidos}
            </p>
            <p>
              <strong>{displayTipoDoc}:</strong> {numeroDocumento}
            </p>
            {codigoURP && codigoURP !== numeroDocumento && (
              <p><strong>Código URP:</strong> {codigoURP}</p>
            )}
            <p><strong>{statusText ? 'Rol / Estamento:' : 'Estamento:'}</strong> {tipoParticipante}</p>
            {correo && <p className={statusText ? '' : 'sm:col-span-2'}><strong>Correo:</strong> {correo}</p>}
            {statusText && (
              <p>
                <strong>Estado:</strong>{' '}
                <span className="text-[#008744] font-black">{statusText}</span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
