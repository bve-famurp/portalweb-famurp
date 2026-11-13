import { describe, it, expect, vi, beforeEach } from 'vitest';
import { boletinSlideService, resolveSlideImageUrl, FALLBACK_SLIDES } from '../services/boletinSlideService';

describe('boletinSlideService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves image URLs correctly', () => {
    expect(resolveSlideImageUrl('')).toBe('');
    expect(resolveSlideImageUrl('https://example.com/art.png')).toBe('https://example.com/art.png');
    expect(resolveSlideImageUrl('/carousel/infografia-clinicalkey.png')).toBe('/carousel/infografia-clinicalkey.png');
    expect(resolveSlideImageUrl('/api/static/boletines/file.png')).toContain('/api/static/boletines/file.png');
  });

  it('returns data from API when fetch succeeds', async () => {
    const mockData = [
      {
        idSlide: 99,
        titulo: 'Slide Remoto',
        descripcion: null,
        imagenUrl: '/api/static/boletines/test.webp',
        formato: 1,
        enlaceUrl: null,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await boletinSlideService.getBoletinSlides();
    expect(result).toEqual(mockData);
  });

  it('returns FALLBACK_SLIDES when fetch fails or response is not ok', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await boletinSlideService.getBoletinSlides();
    expect(result).toEqual(FALLBACK_SLIDES);
  });
});
