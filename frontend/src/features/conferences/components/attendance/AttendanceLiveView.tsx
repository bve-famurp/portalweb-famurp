import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Radio,
  Check,
  User,
  Calendar,
  Clock,
  Building2,
  GraduationCap,
  Info,
  UserPlus,
} from 'lucide-react';
import { ConferenceSummary, RegisterParticipantRequest } from '../../types';
import { conferenceService } from '../../services/conferenceService';
import { AttendanceLiveSuccessCard } from './AttendanceLiveSuccessCard';
import {
  ConferenceParticipantFormFields,
  ConferenceRoleSelector,
  ParticipantRole,
} from './ConferenceParticipantFormFields';
import { ConferenceAmbientBackground } from '../common/ConferenceAmbientBackground';

interface AttendanceLiveViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

interface SuccessParticipantData {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  codigoURP: string | null;
  tipoParticipante: string;
  correo: string;
  timestamp: string;
}

export const AttendanceLiveView: React.FC<AttendanceLiveViewProps> = ({
  conference,
  onBackToCalendar,
}) => {
  const [activeConference, setActiveConference] = useState<ConferenceSummary>(conference);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    setActiveConference(conference);
  }, [conference]);

  useEffect(() => {
    if (activeConference.asistenciaAbierta) return;

    const intervalId = setInterval(async () => {
      try {
        const updated = await conferenceService.getConferenceById(activeConference.idConferencia);
        if (updated && updated.asistenciaAbierta) {
          setActiveConference(updated);
        }
      } catch {
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeConference.idConferencia, activeConference.asistenciaAbierta]);

  const handleManualCheckStatus = async () => {
    if (isCheckingStatus) return;
    setIsCheckingStatus(true);
    try {
      const updated = await conferenceService.getConferenceById(activeConference.idConferencia);
      if (updated) {
        setActiveConference(updated);
      }
    } catch {
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const [documentoInput, setDocumentoInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showDoorForm, setShowDoorForm] = useState(false);
  const [quickRole, setQuickRole] = useState<ParticipantRole>('Estudiante');
  const [quickDni, setQuickDni] = useState('');
  const [quickCodigo, setQuickCodigo] = useState('');
  const [quickApellidoPaterno, setQuickApellidoPaterno] = useState('');
  const [quickApellidoMaterno, setQuickApellidoMaterno] = useState('');
  const [quickNombres, setQuickNombres] = useState('');
  const [quickCorreo, setQuickCorreo] = useState('');
  const [isSubmittingDoor, setIsSubmittingDoor] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successParticipant, setSuccessParticipant] = useState<SuccessParticipantData | null>(null);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = documentoInput.trim();
    if (!val) return;

    setErrorMessage(null);
    setInfoMessage(null);
    setIsScanning(true);

    try {
      const res = await conferenceService.markAttendance(activeConference.idConferencia, {
        documentoOCodigo: val,
      });

      if (res.status === 'ACREDITADO' || res.status === 'ESPONTANEO_ALUMNO') {
        const isDocDni = val.length === 8 && /^\d+$/.test(val);
        const isDocCod = val.length === 9 || val.startsWith('20');
        const tipoDoc = isDocDni ? 'DNI' : isDocCod ? 'Código URP' : 'DNI o CE';
        const horaMarcada =
          res.hora ||
          new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setSuccessParticipant({
          nombres: res.nombreCompleto || 'Participante Acreditado',
          apellidos: '',
          tipoDocumento: tipoDoc,
          numeroDocumento: val,
          codigoURP: isDocCod ? val : null,
          tipoParticipante: res.status === 'ESPONTANEO_ALUMNO' ? 'Estudiante' : 'Participante',
          correo: '',
          timestamp: horaMarcada,
        });
        setDocumentoInput('');
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (res.status === 'YA_REGISTRADO') {
        setInfoMessage('Ya registraste tu asistencia para esta sesión.');
        setShowDoorForm(false);
      } else if (res.status === 'NO_ENCONTRADO') {
        setInfoMessage(
          `El documento o código "${val}" no figura en las pre-inscripciones. Completa tus datos para acreditarte inmediatamente:`
        );
        setShowDoorForm(true);

        if (val.length === 8 && /^\d+$/.test(val)) {
          setQuickDni(val);
          setQuickCodigo('');
        } else if (val.length === 9 || val.startsWith('20')) {
          setQuickCodigo(val);
          setQuickDni('');
          setQuickRole('Estudiante');
        } else {
          setQuickDni(val);
        }
        setDocumentoInput('');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al registrar la asistencia.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleDoorRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanDni = quickDni.trim();
    const cleanCodigo = quickCodigo.trim();
    const cleanPaterno = quickApellidoPaterno.trim();
    const cleanMaterno = quickApellidoMaterno.trim();
    const cleanNombres = quickNombres.trim();
    const cleanCorreo = quickCorreo.trim().toLowerCase();

    if (!cleanDni) {
      setErrorMessage('El DNI o CE es obligatorio.');
      return;
    }
    if (quickRole === 'Estudiante' && !cleanCodigo) {
      setErrorMessage('El código URP es obligatorio para estudiantes.');
      return;
    }
    if (!cleanPaterno) {
      setErrorMessage('El Apellido Paterno es obligatorio.');
      return;
    }
    if (!cleanNombres) {
      setErrorMessage('Los Nombres Completos son obligatorios.');
      return;
    }
    if (!cleanCorreo || !cleanCorreo.includes('@')) {
      setErrorMessage('El Correo Institucional o de Contacto es obligatorio y debe ser válido.');
      return;
    }

    const fullApellidos = `${cleanPaterno} ${cleanMaterno}`.trim();
    const isDocDni = cleanDni.length === 8 && /^\d+$/.test(cleanDni);
    const tipoDoc = isDocDni ? 'DNI' : 'CE';

    const payload: RegisterParticipantRequest = {
      tipoParticipante: quickRole,
      tipoDocumento: tipoDoc,
      numeroDocumento: cleanDni,
      codigoURP: cleanCodigo || null,
      nombres: cleanNombres,
      apellidoPaterno: cleanPaterno,
      apellidoMaterno: cleanMaterno || null,
      apellidos: fullApellidos,
      correo: cleanCorreo,
    };

    setIsSubmittingDoor(true);
    try {
      await conferenceService.registerParticipant(activeConference.idConferencia, payload);
      const docToMark = cleanCodigo || cleanDni;
      const markRes = await conferenceService.markAttendance(activeConference.idConferencia, {
        documentoOCodigo: docToMark,
      });

      const horaMarcada =
        markRes.hora ||
        new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setSuccessParticipant({
        nombres: cleanNombres,
        apellidos: fullApellidos,
        tipoDocumento: tipoDoc,
        numeroDocumento: cleanDni,
        codigoURP: cleanCodigo || null,
        tipoParticipante: quickRole,
        correo: cleanCorreo,
        timestamp: horaMarcada,
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al completar el registro y confirmar la asistencia.');
      }
    } finally {
      setIsSubmittingDoor(false);
    }
  };

  const handleMarkAnother = () => {
    setIsSuccess(false);
    setSuccessParticipant(null);
    setDocumentoInput('');
    setInfoMessage(null);
    setErrorMessage(null);
    setShowDoorForm(false);
    setQuickDni('');
    setQuickCodigo('');
    setQuickApellidoPaterno('');
    setQuickApellidoMaterno('');
    setQuickNombres('');
    setQuickCorreo('');
    setQuickRole('Estudiante');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startDate = new Date(activeConference.fechaHoraInicio);
  const endDate = new Date(activeConference.fechaHoraFin);

  const ambientBackground = <ConferenceAmbientBackground />;

  if (!activeConference.asistenciaAbierta) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-white">
        {ambientBackground}
        <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <button
            type="button"
            onClick={onBackToCalendar}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#008744] px-3.5 py-2 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Calendario</span>
          </button>

          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 sm:p-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <Radio className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
              Marcación de Asistencia Cerrada
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              El control de acceso en tiempo real para la conferencia <strong>"{activeConference.tituloEvento}"</strong> no está habilitado actualmente por el administrador.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleManualCheckStatus}
                disabled={isCheckingStatus}
                className="w-full sm:w-auto py-3 px-6 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-display font-bold text-xs tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md shadow-[#00A859]/25"
              >
                {isCheckingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando disponibilidad...</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>Comprobar Disponibilidad Ahora</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onBackToCalendar}
                className="w-full sm:w-auto py-3 px-6 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white font-display font-bold text-xs tactile-btn cursor-pointer"
              >
                Regresar al Calendario
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isSuccess && successParticipant) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-white">
        {ambientBackground}
        <div className="relative z-10">
          <AttendanceLiveSuccessCard
            conference={activeConference}
            nombres={successParticipant.nombres}
            apellidos={successParticipant.apellidos}
            tipoDocumento={successParticipant.tipoDocumento}
            numeroDocumento={successParticipant.numeroDocumento}
            codigoURP={successParticipant.codigoURP}
            tipoParticipante={successParticipant.tipoParticipante}
            correo={successParticipant.correo}
            timestampRegistrado={successParticipant.timestamp}
            onBackToCalendar={onBackToCalendar}
            onMarkAnother={handleMarkAnother}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {ambientBackground}

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <button
          type="button"
          onClick={onBackToCalendar}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#008744] px-3.5 py-2 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Calendario de Conferencias</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#0F172A] text-white px-6 sm:px-8 py-6 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs text-white shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#8CF9A9] block mb-0.5">
                  Control de Acceso para Conferencia
                </span>
                <h1 className="text-xl sm:text-2xl font-display font-black leading-tight text-white">
                  Confirmación de Asistencia
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#008744] text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CF9A9] animate-pulse" />
                  <span>Marcación Abierta</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0F172A] text-white uppercase tracking-wider">
                  {activeConference.modalidad}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-display font-extrabold text-slate-900 leading-snug">
                {activeConference.tituloEvento}
              </h2>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-600 pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#008744]" />
                  Ponente: <strong>{activeConference.expositorPonente}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                  {activeConference.entidadEditorial}
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

            <div className="bg-white border-2 border-dashed border-slate-300 focus-within:border-[#008744] focus-within:bg-[#008744]/[0.02] rounded-xl p-6 text-center flex flex-col items-center gap-4 transition-all">
              <div className="space-y-1">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                  Confirma tu Asistencia ingresando tu código o DNI o CE
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Ingresa tu código universitario si eres estudiante, si no lo eres ingresa tu número de DNI o CE.
                </p>
              </div>

              <form onSubmit={handleScanSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-lg">
                <input
                  type="text"
                  value={documentoInput}
                  onChange={(e) => setDocumentoInput(e.target.value)}
                  autoFocus
                  placeholder="Ej. 202310452 o 74829103"
                  className="flex-1 h-12 px-4 rounded-lg border border-slate-300 text-center font-display font-black text-base text-slate-900 outline-none focus:border-[#008744] focus:ring-4 focus:ring-[#008744]/15 transition-all placeholder:font-normal placeholder:text-xs placeholder:text-slate-400"
                  disabled={isScanning}
                />
                <button
                  type="submit"
                  disabled={isScanning || !documentoInput.trim()}
                  className="h-12 px-6 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-display font-black text-sm tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 shadow-md shadow-[#00A859]/25"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirmar Asistencia</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight font-semibold">{errorMessage}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span className="leading-tight font-medium">{infoMessage}</span>
              </div>
            )}

            {showDoorForm && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-[#008744]/15 text-[#008744] flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900">
                      Registro Rápido en Puerta
                    </h4>
                    <p className="text-xs text-slate-600">
                      Completa tus datos para confirmar tu ingreso en este momento:
                    </p>
                  </div>
                </div>

                <form onSubmit={handleDoorRegisterSubmit} className="space-y-4">
                  <ConferenceRoleSelector
                    role={quickRole}
                    onRoleChange={setQuickRole}
                    variant="pills"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        DNI o CE <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={quickDni}
                        onChange={(e) => setQuickDni(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12))}
                        placeholder="Ej. 74829103"
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Código URP {quickRole === 'Estudiante' && <span className="text-red-600">*</span>}
                      </label>
                      <input
                        type="text"
                        value={quickCodigo}
                        onChange={(e) => setQuickCodigo(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        placeholder="Ej. 202310452"
                        disabled={quickRole === 'Docente' || quickRole === 'Otros'}
                        required={quickRole === 'Estudiante'}
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  <ConferenceParticipantFormFields
                    idPrefix="door"
                    apellidoPaterno={quickApellidoPaterno}
                    onApellidoPaternoChange={setQuickApellidoPaterno}
                    apellidoMaterno={quickApellidoMaterno}
                    onApellidoMaternoChange={setQuickApellidoMaterno}
                    nombres={quickNombres}
                    onNombresChange={setQuickNombres}
                    correo={quickCorreo}
                    onCorreoChange={setQuickCorreo}
                    required={true}
                    emailPlaceholder="Ej. carlos.mendoza@urp.edu.pe"
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingDoor}
                      className="w-full py-3 px-6 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-display font-black text-xs sm:text-sm tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md shadow-[#00A859]/25"
                    >
                      {isSubmittingDoor ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registrando e Ingresando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Completar Registro y Confirmar Asistencia</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
