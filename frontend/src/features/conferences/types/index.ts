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
