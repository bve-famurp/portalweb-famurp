import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Send,
  GraduationCap,
  Search,
  Check,
} from 'lucide-react';
import { ConferenceSummary, RegisterParticipantRequest } from '../../types';
import { conferenceService } from '../../services/conferenceService';
import { resolveRegistrationDocument } from '../../utils/participantValidation';
import { ConferenceRegistrationSuccessCard } from './ConferenceRegistrationSuccessCard';
import {
  ConferenceParticipantFormFields,
  ConferenceRoleSelector,
  ParticipantRole,
} from './ConferenceParticipantFormFields';
import { ConferenceAmbientBackground } from '../common/ConferenceAmbientBackground';

interface ConferenceRegistrationViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

export const ConferenceRegistrationView: React.FC<ConferenceRegistrationViewProps> = ({
  conference,
  onBackToCalendar,
}) => {
  const [role, setRole] = useState<ParticipantRole>('Estudiante');
  const [dni, setDni] = useState('');
  const [codigoURP, setCodigoURP] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres] = useState('');
  const [correo, setCorreo] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'PRESENTE' | 'AUSENTE'>('IDLE');
  const [showManualFields, setShowManualFields] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isStudentVerified = role === 'Estudiante' && verificationStatus === 'PRESENTE';

  const handleRoleChange = (selected: ParticipantRole) => {
    setRole(selected);
    setErrorMessage(null);
    if (verificationStatus !== 'IDLE') {
      setVerificationStatus('IDLE');
      setShowManualFields(true);
    }
    if (selected === 'Docente' || selected === 'Otros') {
      setCodigoURP('');
    }
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStudentVerified) return;
    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    setDni(val);
    if (verificationStatus !== 'IDLE') {
      setVerificationStatus('IDLE');
      setShowManualFields(true);
    }
  };

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    setCodigoURP(val);
    if (verificationStatus !== 'IDLE') {
      setVerificationStatus('IDLE');
      setShowManualFields(true);
    }
  };

  const handleVerify = async () => {
    const lookupVal = codigoURP.trim() || dni.trim();
    if (!lookupVal) {
      setErrorMessage('Por favor ingrese su código universitario o DNI o CE para verificar.');
      return;
    }
    setErrorMessage(null);
    setIsVerifying(true);
    try {
      const res = await conferenceService.checkStudentStatus(lookupVal);
      if (res.status === 'PRESENTE') {
        setVerificationStatus('PRESENTE');
        setShowManualFields(false);
        if (!correo) {
          setCorreo(`${codigoURP.trim() || dni.trim()}@urp.edu.pe`);
        }
      } else {
        setVerificationStatus('AUSENTE');
        setShowManualFields(true);
      }
    } catch {
      setVerificationStatus('AUSENTE');
      setShowManualFields(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanDni = dni.trim();
    const cleanCodigo = codigoURP.trim();

    if (role === 'Estudiante') {
      if (!cleanCodigo) {
        setErrorMessage('El código universitario URP es obligatorio para estudiantes.');
        return;
      }
      if (cleanCodigo.length !== 9) {
        setErrorMessage('El código universitario URP debe contener 9 dígitos numéricos.');
        return;
      }
    }

    if (!isStudentVerified) {
      if (!cleanDni) {
        setErrorMessage('El DNI o CE es obligatorio.');
        return;
      }
      if (cleanDni.length < 8) {
        setErrorMessage('El documento de identificación debe tener al menos 8 dígitos.');
        return;
      }
    }

    let finalNombres = nombres.trim();
    let finalPaterno = apellidoPaterno.trim();
    let finalMaterno = apellidoMaterno.trim();
    let finalCorreo = correo.trim().toLowerCase();

    if (isStudentVerified && !finalNombres) {
      finalNombres = 'Estudiante Validado';
    }
    if (isStudentVerified && !finalPaterno) {
      finalPaterno = 'Padrón URP';
    }
    if (isStudentVerified && !finalCorreo) {
      finalCorreo = `${cleanCodigo || cleanDni}@urp.edu.pe`;
    }

    if (!isStudentVerified) {
      if (!finalPaterno) {
        setErrorMessage('El Apellido Paterno es obligatorio.');
        return;
      }
      if (!finalNombres) {
        setErrorMessage('Los Nombres Completos son obligatorios.');
        return;
      }
      if (!finalCorreo || !finalCorreo.includes('@')) {
        setErrorMessage('Debe ingresar un correo electrónico institucional o de contacto válido.');
        return;
      }
    }

    const fullApellidos = `${finalPaterno} ${finalMaterno}`.trim();
    const { effectiveDoc, tipoDoc } = resolveRegistrationDocument(cleanDni, cleanCodigo);

    const payload: RegisterParticipantRequest = {
      tipoParticipante: role,
      tipoDocumento: tipoDoc,
      numeroDocumento: effectiveDoc,
      codigoURP: cleanCodigo || null,
      nombres: finalNombres,
      apellidoPaterno: finalPaterno,
      apellidoMaterno: finalMaterno || null,
      apellidos: fullApellidos,
      correo: finalCorreo,
    };

    setIsSubmitting(true);
    try {
      const result = await conferenceService.registerParticipant(conference.idConferencia, payload);
      if (result.alreadyRegistered && result.participant) {
        setNombres(result.participant.nombres);
        setApellidoPaterno(result.participant.apellidoPaterno || result.participant.apellidos || '');
        setApellidoMaterno(result.participant.apellidoMaterno || '');
        setCorreo(result.participant.correo);
        setIsAlreadyRegistered(true);
      } else {
        setIsAlreadyRegistered(false);
      }
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al procesar la pre-inscripción.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setIsSuccess(false);
    setIsAlreadyRegistered(false);
    setDni('');
    setCodigoURP('');
    setNombres('');
    setApellidoPaterno('');
    setApellidoMaterno('');
    setCorreo('');
    setVerificationStatus('IDLE');
    setShowManualFields(true);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const registrationLink = `${window.location.origin}${window.location.pathname}#conferencias?inscripcion=${conference.idConferencia}`;

  const handleCopyRegistrationLink = () => {
    navigator.clipboard.writeText(registrationLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const startDate = new Date(conference.fechaHoraInicio);
  const endDate = new Date(conference.fechaHoraFin);

  const isConcluded =
    conference.estadoEvento === 'Finalizada' ||
    (conference.fechaHoraFin ? new Date(conference.fechaHoraFin).getTime() < Date.now() : false);

  const ambientBackground = <ConferenceAmbientBackground />;

  if (isConcluded) {
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
              Inscripciones Cerradas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              La conferencia &ldquo;{conference.tituloEvento}&rdquo; ya ha concluido. No se aceptan nuevas pre-inscripciones.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onBackToCalendar}
                className="w-full sm:w-auto py-3 px-6 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-display font-bold text-xs tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00A859]/25"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Regresar al Calendario</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isSuccess) {
    const fullApellidos = `${apellidoPaterno.trim()} ${apellidoMaterno.trim()}`.trim();
    const { effectiveDoc, tipoDoc } = resolveRegistrationDocument(dni.trim(), codigoURP.trim());
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-white">
        {ambientBackground}
        <div className="relative z-10">
          <ConferenceRegistrationSuccessCard
            conference={conference}
            nombres={isStudentVerified ? '' : nombres}
            apellidos={isStudentVerified ? '' : fullApellidos}
            tipoDocumento={tipoDoc}
            numeroDocumento={effectiveDoc}
            codigoURP={codigoURP || null}
            tipoParticipante={role}
            correo={correo}
            isValidatedStudent={isStudentVerified}
            registrationLink={registrationLink}
            copiedLink={copiedLink}
            isAlreadyRegistered={isAlreadyRegistered}
            onCopyRegistrationLink={handleCopyRegistrationLink}
            onBackToCalendar={onBackToCalendar}
            onRegisterAnother={handleRegisterAnother}
          />
        </div>
      </div>
    );
  }

  const showUrpBlock = role === 'Estudiante' || role === 'Residentado';

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
                  Formulario Oficial para la Conferencia
                </span>
                <h1 className="text-xl sm:text-2xl font-display font-black leading-tight text-white">
                  Pre-inscripción a Conferencia
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#0F172A] text-white">
                  {conference.modalidad}
                </span>
                {conference.asistenciaAbierta && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A859] animate-pulse" />
                    Asistencia en Vivo Habilitada
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-display font-extrabold text-slate-900 leading-snug">
                {conference.tituloEvento}
              </h2>

              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-600 pt-0.5">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#008744]" />
                  <span>Ponente: <strong className="text-slate-800">{conference.expositorPonente}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                  <span>{conference.entidadEditorial}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#008744]" />
                  <span>{startDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#008744]" />
                  <span>
                    {startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-tight font-semibold">{errorMessage}</span>
                </div>
              )}

              <ConferenceRoleSelector
                role={role}
                onRoleChange={handleRoleChange}
                variant="tabs"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Documentos de Identificación
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className={showUrpBlock ? 'sm:col-span-5' : 'sm:col-span-12'}>
                    <label htmlFor="reg-dni-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                      DNI o CE <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="reg-dni-input"
                      type="text"
                      value={isStudentVerified ? 'VALIDADO' : dni}
                      onChange={handleDniChange}
                      placeholder="Ej. 74829103"
                      maxLength={12}
                      readOnly={isStudentVerified}
                      required={!isStudentVerified}
                      className={`w-full h-10 px-3.5 rounded-lg border text-xs font-sans transition-all ${
                        isStudentVerified
                          ? 'bg-emerald-50 border-emerald-500 text-[#008744] font-bold select-none cursor-default'
                          : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20'
                      }`}
                    />
                  </div>

                  {showUrpBlock && (
                    <>
                      <div className="sm:col-span-4">
                        <label htmlFor="reg-codigo-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                          Código URP {role === 'Estudiante' ? <span className="text-red-600">*</span> : <span className="text-slate-500 font-normal">(Opcional)</span>}
                        </label>
                        <input
                          id="reg-codigo-input"
                          type="text"
                          value={codigoURP}
                          onChange={handleCodigoChange}
                          placeholder="Ej. 202310452"
                          maxLength={9}
                          required={role === 'Estudiante'}
                          className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          type="button"
                          onClick={handleVerify}
                          disabled={isVerifying}
                          className="w-full h-10 px-4 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {isVerifying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Search className="w-3.5 h-3.5" />
                          )}
                          <span>Verificar</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {showUrpBlock && (
                  <span className="text-[11.5px] text-slate-500 leading-tight block pt-0.5">
                    Haz click para revisar tus datos en nuestro sistema y autorellenar.
                  </span>
                )}
              </div>

              {verificationStatus === 'PRESENTE' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 animate-fadeIn">
                  <div className="w-6 h-6 rounded-full bg-[#008744] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-emerald-900">
                      Tus datos ya fueron validados con la base de datos de la biblioteca
                    </h4>
                    <p className="text-emerald-700 leading-relaxed">
                      Tu identidad universitaria ha sido confirmada como estudiante matriculado. Tus nombres y correo institucional se registrarán automáticamente.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowManualFields((prev) => !prev)}
                      className="text-[11px] font-bold text-[#008744] hover:underline cursor-pointer inline-block pt-1"
                    >
                      {showManualFields ? 'Ocultar campos manuales' : 'Editar o revisar datos manualmente'}
                    </button>
                  </div>
                </div>
              )}

              {verificationStatus === 'AUSENTE' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 animate-fadeIn">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-amber-900">
                      Estudiante no registrado en padrón de cómputo
                    </h4>
                    <p className="text-amber-700 leading-relaxed">
                      No se encontró tu código en el padrón local. Por favor ingresa tus datos a continuación para pre-inscribirte.
                    </p>
                  </div>
                </div>
              )}

              {showManualFields && (
                <div className="pt-1 animate-fadeIn">
                  <ConferenceParticipantFormFields
                    idPrefix="reg"
                    apellidoPaterno={apellidoPaterno}
                    onApellidoPaternoChange={setApellidoPaterno}
                    apellidoMaterno={apellidoMaterno}
                    onApellidoMaternoChange={setApellidoMaterno}
                    nombres={nombres}
                    onNombresChange={setNombres}
                    correo={correo}
                    onCorreoChange={setCorreo}
                    required={!isStudentVerified}
                    emailPlaceholder="ejemplo@urp.edu.pe"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#00A859] hover:bg-[#008744] text-white font-display font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando Pre-inscripción...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirmar Pre-inscripción Oficial</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
