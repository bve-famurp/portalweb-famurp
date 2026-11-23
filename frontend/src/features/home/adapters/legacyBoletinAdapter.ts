import { getVpsApiBase } from '../../../core/apiConfig';
import { BoletinPort } from '../ports/boletin.port';
import { BoletinSlide } from '../types/boletinSlide.types';
import { boletinSlideService } from '../services/boletinSlideService';

export class LegacyBoletinAdapter implements BoletinPort {
  async getSlides(): Promise<BoletinSlide[]> {
    if (boletinSlideService && typeof boletinSlideService.getBoletinSlides === 'function') {
      return boletinSlideService.getBoletinSlides();
    }
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
  }

  resolveImageUrl(url: string): string {
    if (!url) {
      return '';
    }
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const base = getVpsApiBase();
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${base}${cleanPath}`;
  }
}

export const boletinAdapter = new LegacyBoletinAdapter();
