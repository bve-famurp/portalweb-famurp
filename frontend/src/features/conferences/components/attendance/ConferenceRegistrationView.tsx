import React, { useState, useEffect, useRef } from 'react';
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

interface ConferenceRegistrationViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

type ParticipantRole = 'Estudiante' | 'Docente' | 'Residentado' | 'Otros';

export const ConferenceRegistrationView: React.FC<ConferenceRegistrationViewProps> = ({
  conference,
  onBackToCalendar,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [role, setRole] = useState<ParticipantRole>('Estudiante');
  const [dni, setDni] = useState('');
  const [codigoURP, setCodigoURP] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres] = useState('');
  const [correo, setCorreo] = useState('');
  const [cicloAcademico, setCicloAcademico] = useState<number | null>(1);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'PRESENTE' | 'AUSENTE'>('IDLE');
  const [showManualFields, setShowManualFields] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let step = 0;
    let animId: number;

    const waves = [
      { color: 'rgba(0, 77, 37, 0.12)', amplitude: 42, speed: 0.010, frequency: 0.0032, yOffset: 0.22 },
      { color: 'rgba(0, 51, 25, 0.14)', amplitude: 52, speed: 0.016, frequency: 0.0026, yOffset: 0.52 },
      { color: 'rgba(0, 92, 46, 0.12)', amplitude: 38, speed: 0.012, frequency: 0.0038, yOffset: 0.74 },
    ];

    const resizeCanvas = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);

    const renderWaves = () => {
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.5, '#f8fafc');
      bg.addColorStop(1, '#ffffff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      waves.forEach((w, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        const currentY = height * w.yOffset;
        const phase = step * w.speed + idx * 1.8;

        for (let x = 0; x <= width; x += 10) {
          const y =
            currentY +
            Math.sin(x * w.frequency + phase) * w.amplitude +
            Math.cos(x * w.frequency * 0.5 + phase * 0.7) * (w.amplitude * 0.4);

          if (x === 0) ctx.lineTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      const lightX = width * (0.5 + Math.sin(step * 0.006) * 0.28);
      const lightY = height * (0.4 + Math.cos(step * 0.008) * 0.22);
      const radGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, width * 0.45);
      radGrad.addColorStop(0, 'rgba(0, 92, 46, 0.18)');
      radGrad.addColorStop(0.5, 'rgba(0, 77, 37, 0.06)');
      radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      step++;
      animId = requestAnimationFrame(renderWaves);
    };

    renderWaves();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleRoleChange = (selected: ParticipantRole) => {
    setRole(selected);
    setErrorMessage(null);
    if (selected === 'Docente' || selected === 'Otros') {
      setCodigoURP('');
      setVerificationStatus('IDLE');
      setShowManualFields(true);
      setCicloAcademico(null);
    } else {
      if (cicloAcademico === null) {
        setCicloAcademico(1);
      }
    }
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (cleanDni && cleanDni.length < 8) {
        setErrorMessage('El documento de identificación debe tener al menos 8 dígitos.');
        return;
      }
    } else {
      if (!cleanDni) {
        setErrorMessage('El DNI o CE es obligatorio.');
        return;
      }
      if (cleanDni.length < 8) {
        setErrorMessage('El documento de identificación debe tener al menos 8 dígitos.');
        return;
      }
    }

    const isVerifiedStudent = verificationStatus === 'PRESENTE';

    let finalNombres = nombres.trim();
    let finalPaterno = apellidoPaterno.trim();
    let finalMaterno = apellidoMaterno.trim();
    let finalCorreo = correo.trim().toLowerCase();

    if (isVerifiedStudent && !finalNombres) {
      finalNombres = 'Estudiante Validado';
    }
    if (isVerifiedStudent && !finalPaterno) {
      finalPaterno = 'Padrón URP';
    }
    if (isVerifiedStudent && !finalCorreo) {
      finalCorreo = `${cleanCodigo || cleanDni}@urp.edu.pe`;
    }

    if (!isVerifiedStudent) {
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
      cicloAcademico: role === 'Estudiante' ? cicloAcademico : null,
    };

    setIsSubmitting(true);
    try {
      const result = await conferenceService.registerParticipant(conference.idConferencia, payload);
      if (result.alreadyRegistered && result.participant) {
        setNombres(result.participant.nombres);
        setApellidoPaterno(result.participant.apellidoPaterno || result.participant.apellidos || '');
        setApellidoMaterno(result.participant.apellidoMaterno || '');
        setCorreo(result.participant.correo);
        setCicloAcademico(result.participant.cicloAcademico);
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
    setCicloAcademico(1);
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

  if (isSuccess) {
    const fullApellidos = `${apellidoPaterno.trim()} ${apellidoMaterno.trim()}`.trim();
    const { effectiveDoc, tipoDoc } = resolveRegistrationDocument(dni.trim(), codigoURP.trim());
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-white">
        <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85" />
          <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        </div>
        <div className="relative z-10">
          <ConferenceRegistrationSuccessCard
            conference={conference}
            nombres={nombres || 'Estudiante Validado'}
            apellidos={fullApellidos || 'Padrón URP'}
            tipoDocumento={tipoDoc}
            numeroDocumento={effectiveDoc}
            codigoURP={codigoURP || null}
            tipoParticipante={role}
            correo={correo}
            cicloAcademico={role === 'Estudiante' ? cicloAcademico : null}
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
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

        <div
          className="absolute text-[#005C2E] opacity-55 pointer-events-none select-none anim-gentle"
          style={{ top: '12%', left: '5%' }}
          title="Base de Datos Médica"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
        </div>

        <div
          className="absolute text-[#005C2E] opacity-55 pointer-events-none select-none anim-reverse"
          style={{ top: '14%', right: '6%' }}
          title="Libro / Literatura Médica"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>

        <div
          className="absolute text-[#005C2E] opacity-55 pointer-events-none select-none anim-slow"
          style={{ top: '40%', left: '4%' }}
          title="Estetoscopio Clínico"
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 2.5v5a7.5 7.5 0 0 0 15 0v-5" />
            <path d="M12 15v2a3.5 3.5 0 0 0 3.5 3.5h0.5a3.5 3.5 0 0 0 3.5-3.5v-2" />
            <circle cx="19.5" cy="15" r="2.5" fill="rgba(0, 92, 46, 0.25)" />
            <path d="M3.5 2.5h2" />
            <path d="M18.5 2.5h2" />
          </svg>
        </div>

        <div
          className="absolute text-[#005C2E] opacity-55 pointer-events-none select-none anim-gentle"
          style={{ top: '42%', right: '5%' }}
          title="Pulso Cardiaco (EKG)"
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>

        <div
          className="absolute text-[#005C2E] opacity-50 pointer-events-none select-none anim-reverse"
          style={{ bottom: '14%', right: '7%' }}
          title="Cruz Médica"
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="18" rx="1.5" fill="rgba(0, 92, 46, 0.15)" />
            <rect x="3" y="9" width="18" height="6" rx="1.5" fill="rgba(0, 92, 46, 0.15)" />
          </svg>
        </div>

        <div
          className="absolute text-[#005C2E] opacity-55 pointer-events-none select-none anim-slow"
          style={{ bottom: '12%', left: '6%' }}
          title="Símbolo Oficial de Medicina (Vara de Esculapio)"
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="22" />
            <circle cx="12" cy="2" r="1.3" fill="currentColor" />
            <path d="M7.8 5.5c1.8-2 5.5-1.5 5.5 1.5 0 2.5-4.5 3.5-4 6.5s5 2 4.5 5-3.5 2-4 2.5" />
            <path d="M7.6 5.5l1.6-1.2" />
          </svg>
        </div>
      </div>

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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Tipo de Participante</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['Estudiante', 'Docente', 'Residentado', 'Otros'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        role === r
                          ? 'bg-white text-[#008744] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Documentos de Identificación
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className={showUrpBlock ? 'sm:col-span-5' : 'sm:col-span-12'}>
                    <label htmlFor="reg-dni-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                      {role === 'Estudiante' ? (
                        'DNI o CE (Opcional con Código URP)'
                      ) : (
                        <>
                          DNI o CE <span className="text-red-600">*</span>
                        </>
                      )}
                    </label>
                    <input
                      id="reg-dni-input"
                      type="text"
                      value={dni}
                      onChange={handleDniChange}
                      placeholder="Ej. 74829103"
                      maxLength={12}
                      required={role !== 'Estudiante'}
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
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
                <div className="space-y-4 pt-1 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-paterno-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                        Apellido Paterno <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="reg-paterno-input"
                        type="text"
                        value={apellidoPaterno}
                        onChange={(e) => setApellidoPaterno(e.target.value)}
                        placeholder="Ej. Mendoza"
                        required={verificationStatus !== 'PRESENTE'}
                        className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-materno-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                        Apellido Materno
                      </label>
                      <input
                        id="reg-materno-input"
                        type="text"
                        value={apellidoMaterno}
                        onChange={(e) => setApellidoMaterno(e.target.value)}
                        placeholder="Ej. Morales"
                        className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-nombres-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                      Nombres Completos <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="reg-nombres-input"
                      type="text"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      placeholder="Ej. Carlos Eduardo"
                      required={verificationStatus !== 'PRESENTE'}
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className={role === 'Estudiante' ? 'sm:col-span-8' : 'sm:col-span-12'}>
                      <label htmlFor="reg-correo-input" className="text-[11px] font-bold text-slate-700 block mb-1">
                        Correo Institucional o de Contacto <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="reg-correo-input"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="ejemplo@urp.edu.pe"
                        required
                        className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
                      />
                    </div>

                    {role === 'Estudiante' && (
                      <div className="sm:col-span-4">
                        <label htmlFor="reg-ciclo-select" className="text-[11px] font-bold text-slate-700 block mb-1">
                          Ciclo Académico
                        </label>
                        <select
                          id="reg-ciclo-select"
                          value={cicloAcademico || 1}
                          onChange={(e) => setCicloAcademico(parseInt(e.target.value, 10))}
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
                        >
                          {Array.from({ length: 14 }, (_, i) => i + 1).map((c) => (
                            <option key={c} value={c}>
                              {c}° Ciclo {c >= 13 ? '(Internado)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
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
