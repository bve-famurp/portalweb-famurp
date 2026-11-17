import { MedicalDatabase } from '../data/databasesData';
import { ResourceApiDto, ResourcePublicApiDto } from '../types/resourceApiTypes';

const isPublicDto = (dto: ResourceApiDto | ResourcePublicApiDto): dto is ResourcePublicApiDto => {
  return 'nombreRecurso' in dto && typeof (dto as ResourcePublicApiDto).nombreRecurso === 'string';
};

export const mapApiResourceToMedicalDatabase = (
  dto: ResourceApiDto | ResourcePublicApiDto
): MedicalDatabase => {
  if (isPublicDto(dto)) {
    return {
      id: `db-${dto.idBaseDatos}`,
      rawId: dto.idBaseDatos,
      title: dto.nombreRecurso,
      description: dto.descripcionClinica || '',
      accessType: dto.esSuscripcion ? 'Suscripción URP' : 'Acceso Abierto',
      logoFile: dto.logotipoUrl || '',
      accessUrl: dto.esSuscripcion
        ? 'https://test.urp.edu.pe/Intranet/'
        : dto.urlExterno || 'https://test.urp.edu.pe/Intranet/',
      isFeatured: dto.esSuscripcion,
      hasMobileApp: dto.tieneAppMovil,
      tutorialVideoId: dto.youtubeVideoId || undefined,
      tutorialUrl: dto.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${dto.youtubeVideoId}`
        : undefined,
      mostrarEnHexagonos: dto.mostrarEnHexagonos ?? false,
      tags:
        dto.cursos && dto.cursos.length > 0
          ? dto.cursos.map((c) => c.nombreCurso)
          : ['Medicina Humana'],
    };
  }

  return {
    id: `db-${dto.id}`,
    rawId: dto.id,
    title: dto.name,
    description: dto.clinicalDescription || '',
    accessType: dto.isSubscription ? 'Suscripción URP' : 'Acceso Abierto',
    logoFile: dto.logoUrl || '',
    accessUrl: dto.externalUrl || 'https://test.urp.edu.pe/Intranet/',
    isFeatured: dto.isSubscription,
    hasMobileApp: dto.hasMobileApp,
    tutorialVideoId: dto.tutorial?.youtubeVideoId || undefined,
    tutorialUrl: dto.tutorial?.youtubeVideoId
      ? `https://www.youtube.com/watch?v=${dto.tutorial.youtubeVideoId}`
      : undefined,
    mostrarEnHexagonos: dto.mostrarEnHexagonos ?? false,
    tags: dto.subjects && dto.subjects.length > 0 ? dto.subjects : ['Medicina Humana'],
  };
};
