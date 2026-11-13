import { getVpsApiBase } from '../../../core/apiConfig';
import { BoletinSlide, FormatoSlide } from '../types/boletinSlide.types';

export const FALLBACK_SLIDES: BoletinSlide[] = [
  {
    idSlide: 1,
    titulo: 'Infografía Oficial ClinicalKey',
    descripcion: null,
    imagenUrl: '/carousel/infografia-clinicalkey.png',
    formato: FormatoSlide.Vertical,
    enlaceUrl: 'https://www.clinicalkey.com',
  },
  {
    idSlide: 2,
    titulo: 'Capacitación AccessMedicina para Ricardo Palma',
    descripcion: 'Sesión de inducción clínica virtual para estudiantes y docentes de la Facultad de Medicina Humana.',
    imagenUrl: '/carousel/capacitacion-accessmedicina.jpg',
    formato: FormatoSlide.Bipartito,
    enlaceUrl: 'https://accessmedicina.mhmedical.com',
  },
];

export const resolveSlideImageUrl = (url: string): string => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/carousel/')) {
    return url;
  }
  const base = getVpsApiBase();
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${base}${cleanPath}`;
};

export const getBoletinSlides = async (): Promise<BoletinSlide[]> => {
  try {
    const base = getVpsApiBase();
    const response = await fetch(`${base}/api/boletinslides`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (!response.ok) {
      return FALLBACK_SLIDES;
    }
    const data: unknown = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data as BoletinSlide[];
    }
    return FALLBACK_SLIDES;
  } catch {
    return FALLBACK_SLIDES;
  }
};

export const boletinSlideService = {
  getBoletinSlides,
  resolveSlideImageUrl,
};
