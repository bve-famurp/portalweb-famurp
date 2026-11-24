import { CourseApiDto } from '../types/resourceApiTypes';

export type AccessType = 'Suscripción URP' | 'Acceso Abierto';

export interface CleanMedicalDatabase {
  id: string;
  rawId: number;
  title: string;
  description: string;
  accessType: AccessType;
  logoFile: string;
  accessUrl: string;
  isFeatured?: boolean;
  hasMobileApp?: boolean;
  tutorialUrl?: string;
  tutorialVideoId?: string;
  mostrarEnHexagonos?: boolean;
}

export interface MedicalDatabase extends CleanMedicalDatabase {
  logoUrl: string;
  cursos: CourseApiDto[];
}

export const getDatabaseLogoUrl = (logoFile?: string | null): string => {
  if (!logoFile) return '';
  if (logoFile.startsWith('http://') || logoFile.startsWith('https://')) {
    return logoFile;
  }
  let clean = logoFile.trim();
  clean = clean.replace(/^\/api\/static\/logos_bd\//, '');
  clean = clean.replace(/^\/logos_bd\//, '');
  clean = clean.replace(/^\//, '');
  clean = clean.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  return `/logos_bd/${clean}.webp`;
};
