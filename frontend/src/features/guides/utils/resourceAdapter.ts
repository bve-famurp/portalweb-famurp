import { MedicalDatabase } from '../data/databasesData';
import { ResourceApiDto, ResourcePublicApiDto } from '../types/resourceApiTypes';
import { STATIC_CURSOS } from '../data/staticCursosData';

const cursosByName = new Map(STATIC_CURSOS.map((c) => [c.nombreCurso, c]));

const isPublicDto = (dto: ResourceApiDto | ResourcePublicApiDto): dto is ResourcePublicApiDto => {
  return 'nombreRecurso' in dto && typeof (dto as ResourcePublicApiDto).nombreRecurso === 'string';
};

const sanitizeExternalUrl = (url?: string | null): string => {
  const fallback = 'https://test.urp.edu.pe/Intranet/';
  if (!url) return fallback;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
};

const sanitizeYoutubeVideoId = (videoId?: string | null): string | undefined => {
  if (!videoId) return undefined;
  const clean = videoId.trim();
  return /^[a-zA-Z0-9_-]{6,15}$/.test(clean) ? clean : undefined;
};

export const mapApiResourceToMedicalDatabase = (
  dto: ResourceApiDto | ResourcePublicApiDto
): MedicalDatabase => {
  if (isPublicDto(dto)) {
    const cleanVideoId = sanitizeYoutubeVideoId(dto.youtubeVideoId);
    return {
      id: `db-${dto.idBaseDatos}`,
      rawId: dto.idBaseDatos,
      title: dto.nombreRecurso,
      description: dto.descripcionClinica || '',
      accessType: dto.esSuscripcion ? 'Suscripción URP' : 'Acceso Abierto',
      logoFile: dto.logotipoUrl || '',
      accessUrl: dto.esSuscripcion
        ? 'https://test.urp.edu.pe/Intranet/'
        : sanitizeExternalUrl(dto.urlExterno),
      isFeatured: dto.esSuscripcion,
      hasMobileApp: dto.tieneAppMovil,
      tutorialVideoId: cleanVideoId,
      tutorialUrl: cleanVideoId
        ? `https://www.youtube.com/watch?v=${cleanVideoId}`
        : undefined,
      mostrarEnHexagonos: dto.mostrarEnHexagonos ?? false,
      cursos: dto.cursos || [],
    };
  }

  const cleanVideoId = sanitizeYoutubeVideoId(dto.tutorial?.youtubeVideoId);
  const mappedCursos = (dto.subjects || []).map((s, idx) => {
    const found = cursosByName.get(s);
    if (found) return found;
    return {
      idCurso: idx + 1,
      nombreCurso: s,
      ciclo: 1,
      codigoCurso: null,
    };
  });

  return {
    id: `db-${dto.id}`,
    rawId: dto.id,
    title: dto.name,
    description: dto.clinicalDescription || '',
    accessType: dto.isSubscription ? 'Suscripción URP' : 'Acceso Abierto',
    logoFile: dto.logoUrl || '',
    accessUrl: dto.isSubscription
      ? 'https://test.urp.edu.pe/Intranet/'
      : sanitizeExternalUrl(dto.externalUrl),
    isFeatured: dto.isSubscription,
    hasMobileApp: dto.hasMobileApp,
    tutorialVideoId: cleanVideoId,
    tutorialUrl: cleanVideoId
      ? `https://www.youtube.com/watch?v=${cleanVideoId}`
      : undefined,
    mostrarEnHexagonos: dto.mostrarEnHexagonos ?? false,
    cursos: dto.cursos && dto.cursos.length > 0 ? dto.cursos : mappedCursos,
  };
};
