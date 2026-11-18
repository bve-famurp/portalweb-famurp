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
