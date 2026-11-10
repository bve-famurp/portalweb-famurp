import React, { useState, useEffect, useRef } from 'react';
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

interface AttendanceLiveViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

type ParticipantRole = 'Estudiante' | 'Docente' | 'Residentado' | 'Otros';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const ambientBackground = (
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
  );

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
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Tipo de Participante
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-white border border-slate-200 rounded-lg">
                      {(['Estudiante', 'Docente', 'Residentado', 'Otros'] as ParticipantRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setQuickRole(r)}
                          className={`py-2 px-3 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                            quickRole === r
                              ? 'bg-[#008744] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Apellido Paterno <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={quickApellidoPaterno}
                        onChange={(e) => setQuickApellidoPaterno(e.target.value)}
                        placeholder="Ej. Mendoza"
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Apellido Materno
                      </label>
                      <input
                        type="text"
                        value={quickApellidoMaterno}
                        onChange={(e) => setQuickApellidoMaterno(e.target.value)}
                        placeholder="Ej. Morales"
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nombres Completos <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={quickNombres}
                      onChange={(e) => setQuickNombres(e.target.value)}
                      placeholder="Ej. Carlos Eduardo"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Correo Institucional o de Contacto <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={quickCorreo}
                      onChange={(e) => setQuickCorreo(e.target.value)}
                      placeholder="Ej. carlos.mendoza@urp.edu.pe"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all bg-white"
                      required
                    />
                  </div>

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
