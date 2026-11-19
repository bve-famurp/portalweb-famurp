import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Share2,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { ConferenceSummary } from '../../types';
import {
  ConferenceEventSummaryBox,
  ConferenceLocationNotice,
  ParticipantDataSummaryGrid,
} from './ConferenceSuccessCommon';

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
  tipoDocumento,
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
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div
          className={`p-8 text-center border-b ${
            isAlreadyRegistered
              ? 'bg-amber-500 text-slate-900 border-amber-600'
              : 'bg-[#008744] text-white border-[#0F172A]'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm ${
              isAlreadyRegistered
                ? 'bg-white text-amber-600 border-amber-300'
                : 'bg-white text-[#008744] border-slate-300'
            }`}
          >
            {isAlreadyRegistered ? (
              <AlertTriangle className="w-9 h-9" />
            ) : (
              <CheckCircle2 className="w-9 h-9" />
            )}
          </div>
          <span
            className={`text-[11px] font-black uppercase tracking-widest block mb-1 ${
              isAlreadyRegistered ? 'text-amber-950' : 'text-[#8CF9A9]'
            }`}
          >
            {isAlreadyRegistered ? 'Pre-inscripción Existente • BVE-FAMURP' : 'Registro Confirmado'}
          </span>
          <h1
            className={`text-2xl sm:text-3xl font-display font-black leading-tight ${
              isAlreadyRegistered ? 'text-slate-950' : 'text-white'
            }`}
          >
            {isAlreadyRegistered
              ? 'Usted ya se había registrado'
              : '¡Muchas Gracias por tu Pre-inscripción!'}
          </h1>
          <p
            className={`text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed ${
              isAlreadyRegistered ? 'text-amber-950 font-medium' : 'text-white/90'
            }`}
          >
            {isAlreadyRegistered
              ? 'Tu DNI o CE ya se encuentra registrado en la nómina oficial de esta capacitación. A continuación tienes los detalles y el enlace a la sala virtual para tu acceso.'
              : 'Tu participación en la capacitación ha sido registrada exitosamente'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <ConferenceEventSummaryBox
            conference={conference}
            badgeTitle="Resumen de la Conferencia"
          />

          <ConferenceLocationNotice
            ubicacionOEnlace={conference.ubicacion_o_Enlace}
            isLiveView={false}
          />

          <ParticipantDataSummaryGrid
            title="Datos del Participante Registrado"
            nombres={nombres}
            apellidos={apellidos}
            tipoDocumento={tipoDocumento}
            numeroDocumento={numeroDocumento}
            codigoURP={codigoURP}
            tipoParticipante={tipoParticipante}
            correo={correo}
            isValidatedStudent={isValidatedStudent}
          />

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
