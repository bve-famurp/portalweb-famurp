import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  User,
  Building2,
  Video,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Link as LinkIcon,
  Check,
  ExternalLink,
} from 'lucide-react';
import { ConferenceSummary } from '../../types';

interface ConferenceRegistrationSuccessCardProps {
  conference: ConferenceSummary;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  codigoURP?: string | null;
  tipoParticipante: string;
  correo: string;
  isValidatedStudent?: boolean;
  registrationLink: string;
  copiedLink: boolean;
  isAlreadyRegistered?: boolean;
  onCopyRegistrationLink: () => void;
  onBackToCalendar: () => void;
  onRegisterAnother?: () => void;
}

export const ConferenceRegistrationSuccessCard: React.FC<ConferenceRegistrationSuccessCardProps> = ({
  conference,
  nombres,
  apellidos,
  numeroDocumento,
  codigoURP,
  tipoParticipante,
  correo,
  isValidatedStudent = false,
  registrationLink,
  copiedLink,
  isAlreadyRegistered = false,
  onCopyRegistrationLink,
  onBackToCalendar,
  onRegisterAnother,
}) => {
  const startDate = new Date(conference.fechaHoraInicio);
  const endDate = new Date(conference.fechaHoraFin);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className={`p-8 text-center border-b ${
          isAlreadyRegistered
            ? 'bg-amber-500 text-slate-900 border-amber-600'
            : 'bg-[#008744] text-white border-[#0F172A]'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm ${
            isAlreadyRegistered
              ? 'bg-white text-amber-600 border-amber-300'
              : 'bg-white text-[#008744] border-slate-300'
          }`}>
            {isAlreadyRegistered ? (
              <AlertTriangle className="w-9 h-9" />
            ) : (
              <CheckCircle2 className="w-9 h-9" />
            )}
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest block mb-1 ${
            isAlreadyRegistered ? 'text-amber-950' : 'text-[#8CF9A9]'
          }`}>
            {isAlreadyRegistered ? 'Pre-inscripción Existente • BVE-FAMURP' : 'Registro Confirmado'}
          </span>
          <h1 className={`text-2xl sm:text-3xl font-display font-black leading-tight ${
            isAlreadyRegistered ? 'text-slate-950' : 'text-white'
          }`}>
            {isAlreadyRegistered ? 'Usted ya se había registrado' : '¡Muchas Gracias por tu Pre-inscripción!'}
          </h1>
          <p className={`text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed ${
            isAlreadyRegistered ? 'text-amber-950 font-medium' : 'text-white/90'
          }`}>
            {isAlreadyRegistered
              ? 'Tu DNI o CE ya se encuentra registrado en la nómina oficial de esta capacitación. A continuación tienes los detalles y el enlace a la sala virtual para tu acceso.'
              : 'Tu participación en la capacitación ha sido registrada exitosamente'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Resumen de la Conferencia
            </h2>
            <p className="text-base sm:text-lg font-display font-black text-slate-900">
              {conference.tituloEvento}
            </p>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#008744]" />
                {conference.expositorPonente}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                {conference.entidadEditorial}
              </span>
              <span className="flex items-center gap-1.5">
                {conference.modalidad === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                )}
                {conference.modalidad}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {conference.ubicacion_o_Enlace && (
            conference.ubicacion_o_Enlace.startsWith('http') ? (
              <div className="p-6 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                    <Video className="w-4 h-4 text-[#008744]" />
                    <span>Acceso a la Sala Virtual</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Podrás conectarte el día de la sesión usando el siguiente enlace institucional:
                  </p>
                  <a
                    href={conference.ubicacion_o_Enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-sans font-bold text-[#008744] hover:underline break-all block pt-0.5"
                  >
                    {conference.ubicacion_o_Enlace}
                  </a>
                </div>
                <a
                  href={conference.ubicacion_o_Enlace}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white text-xs font-bold tactile-btn transition-all cursor-pointer shrink-0 self-start sm:self-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ingresar a la Sala</span>
                </a>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#008744]" />
                    <span>Lugar del Evento</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold">
                    {conference.ubicacion_o_Enlace}
                  </p>
                </div>
              </div>
            )
          )}

          <div className="bg-white border border-slate-200 p-6 rounded-lg space-y-2.5">
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
                  <p className="sm:col-span-2"><strong>Correo:</strong> {correo}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xs font-black uppercase tracking-wider text-[#008744]">
                  Datos del Participante Registrado
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-slate-800">
                  <p><strong>Nombres y Apellidos:</strong> {nombres} {apellidos}</p>
                  <p><strong>DNI o CE:</strong> {numeroDocumento}</p>
                  {codigoURP && codigoURP !== numeroDocumento && (
                    <p><strong>Código URP:</strong> {codigoURP}</p>
                  )}
                  <p><strong>Estamento:</strong> {tipoParticipante}</p>
                  <p><strong>Correo:</strong> {correo}</p>
                </div>
              </>
            )}
          </div>

          <div className="p-6 rounded-lg bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Enlace de Inscripción del Evento
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Comparte este enlace directo con tus compañeros o profesores interesados en asistir:
                </p>
              </div>
              <Share2 className="w-4 h-4 text-[#008744] shrink-0" />
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
              <LinkIcon className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                id="registration-share-link"
                name="registrationLink"
                type="text"
                readOnly
                value={registrationLink}
                aria-label="Enlace de registro a la conferencia"
                className="bg-transparent text-xs font-sans text-slate-800 flex-1 outline-none truncate"
              />
              <button
                type="button"
                onClick={onCopyRegistrationLink}
                className="px-4 py-2 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white text-xs font-bold tactile-btn transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <span>Copiar Enlace</span>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onRegisterAnother && (
              <button
                type="button"
                onClick={onRegisterAnother}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white font-display font-black text-sm transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Inscribir a otra persona</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToCalendar}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-display font-black text-sm tactile-btn-green transition-all cursor-pointer"
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
