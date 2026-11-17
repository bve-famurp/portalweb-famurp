import { getVpsApiBase } from '../../../core/apiConfig';

export type AccessType = 'Suscripción URP' | 'Acceso Abierto';

export interface MedicalDatabase {
  id: string;
  rawId?: number;
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
  tags: string[];
}

export const getDatabaseLogoUrl = (logoFile?: string | null): string => {
  if (!logoFile) return '';
  if (logoFile.startsWith('http://') || logoFile.startsWith('https://')) {
    return logoFile;
  }
  const cleanPath = logoFile.startsWith('/') ? logoFile : `/api/static/logos_bd/${logoFile}`;
  const base = getVpsApiBase();
  return base ? `${base}${cleanPath}` : cleanPath;
};
