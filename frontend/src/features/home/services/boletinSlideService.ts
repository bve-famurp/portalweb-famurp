import { getVpsApiBase } from '../../../core/apiConfig';
import { BoletinSlide } from '../types/boletinSlide.types';

export const resolveSlideImageUrl = (url: string): string => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
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
      return [];
    }
    const data: unknown = await response.json();
    if (Array.isArray(data)) {
      return data as BoletinSlide[];
    }
    return [];
  } catch {
    return [];
  }
};

export const boletinSlideService = {
  getBoletinSlides,
  resolveSlideImageUrl,
};
