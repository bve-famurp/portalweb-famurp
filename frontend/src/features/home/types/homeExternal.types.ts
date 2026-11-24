export interface HomeActivityItem {
  idConferencia: number;
  tituloEvento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estadoEvento: string;
}

export interface HomeMatrixResource {
  id: number;
  title: string;
  logoUrl: string;
  mostrarEnHexagonos?: boolean;
  primaryCourse?: string;
}
