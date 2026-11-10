export type TipoParticipante =
  | 'Estudiante'
  | 'Docente'
  | 'Residente'
  | 'Otros'
  | 'Pregrado'
  | 'Posgrado'
  | 'Residentado'
  | 'Otro';

export type TipoDocumento = 'DNI' | 'CODIGO_URP' | 'CE';

export interface ConferenceSummary {
  idConferencia: number;
  tituloEvento: string;
  expositorPonente: string;
  entidadEditorial: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  modalidad: string;
  ubicacion_o_Enlace: string;
  asistenciaAbierta: boolean;
  estadoEvento: string;
  autoPurgar30Dias: boolean;
  fechaCaducidadPurge: string | null;
  totalInscritos: number;
  totalAsistentes: number;
}

export interface CreateConferenceRequest {
  tituloEvento: string;
  expositorPonente: string;
  entidadEditorial: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  modalidad: string;
  ubicacion_o_Enlace: string;
  autoPurgar30Dias: boolean;
}

export interface UpdateConferenceRequest {
  tituloEvento: string;
  expositorPonente: string;
  entidadEditorial: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  modalidad: string;
  ubicacion_o_Enlace: string;
  estadoEvento: string;
  autoPurgar30Dias: boolean;
}

export interface RegisterParticipantRequest {
  tipoParticipante: string;
  tipoDocumento: string;
  numeroDocumento: string;
  codigoURP?: string | null;
  nombres: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string | null;
  correo: string;
  apellidos?: string;
}

export interface MarkAttendanceRequest {
  documentoOCodigo?: string;
  tipoParticipante?: TipoParticipante;
  tipoDocumento?: TipoDocumento;
  numeroDocumento?: string;
  nombres?: string;
  apellidos?: string;
  correo?: string;
}

export interface MarkAttendanceResponse {
  status: 'ACREDITADO' | 'ESPONTANEO_ALUMNO' | 'YA_REGISTRADO' | 'NO_ENCONTRADO';
  mensaje: string;
  nombreCompleto?: string | null;
  hora?: string | null;
}

export interface CheckStudentStatusResponse {
  status: 'PRESENTE' | 'AUSENTE';
  message?: string;
}

export interface ParticipantRecord {
  numeroDocumento: string;
  tipoDocumento: string;
  tipoParticipante: string;
  nombres: string;
  apellidos: string;
  correo: string;
  cicloAcademico: number | null;
  fechaHoraRegistro: string | null;
  fechaHoraMarcacion: string | null;
  estado: 'Acreditado' | 'Espontaneo' | 'Inasistencia';
}

export interface ConferenceReport {
  conferencia: ConferenceSummary;
  totalInscritos: number;
  totalAsistentes: number;
  totalAcreditados: number;
  totalEspontaneos: number;
  totalInasistencias: number;
  participantes: ParticipantRecord[];
}
