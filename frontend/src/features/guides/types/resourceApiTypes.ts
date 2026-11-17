export interface CourseApiDto {
  idCurso: number;
  nombreCurso: string;
  ciclo: number;
  codigoCurso?: string | null;
}

export interface ResourcePublicApiDto {
  idBaseDatos: number;
  nombreRecurso: string;
  logotipoUrl: string;
  descripcionClinica: string;
  esSuscripcion: boolean;
  tieneAppMovil: boolean;
  urlExterno?: string | null;
  estadoActivo: boolean;
  mostrarEnHexagonos: boolean;
  youtubeVideoId?: string | null;
  cursos: CourseApiDto[];
}

export interface TutorialApiDto {
  id: number;
  youtubeVideoId: string;
  guidePdfUrl?: string | null;
}

export interface ResourceApiDto {
  id: number;
  name: string;
  logoUrl?: string | null;
  clinicalDescription?: string | null;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl?: string | null;
  isActive: boolean;
  mostrarEnHexagonos: boolean;
  subjects: string[];
  tutorial?: TutorialApiDto | null;
  idBaseDatos?: number;
  nombreRecurso?: string;
  logotipoUrl?: string | null;
  descripcionClinica?: string | null;
  esSuscripcion?: boolean;
  tieneAppMovil?: boolean;
  estadoActivo?: boolean;
  youtubeVideoId?: string | null;
  cursos?: CourseApiDto[];
}

export interface SubjectApiDto {
  id: number;
  name: string;
}

export interface CreateResourceApiRequest {
  name: string;
  logoUrl?: string | null;
  clinicalDescription?: string | null;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl?: string | null;
  mostrarEnHexagonos?: boolean;
  subjects: string[];
  youtubeVideoId?: string | null;
  guidePdfUrl?: string | null;
}

export interface UpdateResourceApiRequest {
  name: string;
  logoUrl?: string | null;
  clinicalDescription?: string | null;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl?: string | null;
  isActive: boolean;
  mostrarEnHexagonos?: boolean;
  subjects: string[];
  youtubeVideoId?: string | null;
  guidePdfUrl?: string | null;
}
