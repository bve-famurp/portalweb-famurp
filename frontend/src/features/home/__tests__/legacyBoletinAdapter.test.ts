import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LegacyBoletinAdapter, boletinAdapter } from '../adapters/legacyBoletinAdapter';
import { FormatoSlide, BoletinSlide } from '../types/boletinSlide.types';

describe('legacyBoletinAdapter', () => {
  const mockSlides: BoletinSlide[] = [
    {
      idSlide: 1,
      titulo: 'Boletín Científico Mayo',
      descripcion: 'Edición mensual con novedades clínicas.',
      imagenUrl: '/api/static/boletines/mayo.webp',
      formato: FormatoSlide.Vertical,
      enlaceUrl: 'https://www.clinicalkey.es',
    },
    {
      idSlide: 2,
      titulo: 'Boletín Semanal Junio',
      descripcion: null,
      imagenUrl: 'https://cdn.example.com/junio.png',
      formato: FormatoSlide.Bipartito,
      enlaceUrl: null,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves image URLs correctly for empty, external, data and relative paths', () => {
    expect(boletinAdapter.resolveImageUrl('')).toBe('');
    expect(boletinAdapter.resolveImageUrl('https://example.com/image.png')).toBe('https://example.com/image.png');
    expect(boletinAdapter.resolveImageUrl('http://example.com/image.png')).toBe('http://example.com/image.png');
    expect(boletinAdapter.resolveImageUrl('data:image/png;base64,abc123')).toBe('data:image/png;base64,abc123');
    expect(boletinAdapter.resolveImageUrl('/api/static/boletines/pic.webp')).toContain('/api/static/boletines/pic.webp');
    expect(boletinAdapter.resolveImageUrl('api/static/boletines/pic.webp')).toContain('/api/static/boletines/pic.webp');
  });

  it('fetches and returns slides when HTTP response is ok and data is an array', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSlides,
    });

    const slides = await boletinAdapter.getSlides();

    expect(slides).toEqual(mockSlides);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/boletinslides'),
      expect.objectContaining({
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    );
  });

  it('returns empty array when HTTP response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const slides = await boletinAdapter.getSlides();

    expect(slides).toEqual([]);
  });

  it('returns empty array when network error occurs during fetch', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    const slides = await boletinAdapter.getSlides();

    expect(slides).toEqual([]);
  });

  it('returns empty array when payload is not an array', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'unexpected object format' }),
    });

    const slides = await boletinAdapter.getSlides();

    expect(slides).toEqual([]);
  });

  it('allows instantiation of class and satisfies port contract', () => {
    const customAdapter = new LegacyBoletinAdapter();

    expect(typeof customAdapter.getSlides).toBe('function');
    expect(typeof customAdapter.resolveImageUrl).toBe('function');
  });
});
