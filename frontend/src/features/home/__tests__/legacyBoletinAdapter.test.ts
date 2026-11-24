import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LegacyBoletinAdapter, boletinAdapter } from '../adapters/legacyBoletinAdapter';
import { FormatoSlide, BoletinSlide } from '../types/boletinSlide.types';
import { getVpsApiBase } from '../../../core/apiConfig';

vi.mock('../../../core/apiConfig', () => ({
  getVpsApiBase: vi.fn(() => 'https://vps.example.test'),
}));

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
    {
      idSlide: 3,
      titulo: 'Boletín Embebido',
      descripcion: null,
      imagenUrl: 'data:image/png;base64,abc123',
      formato: FormatoSlide.Vertical,
      enlaceUrl: null,
    },
    {
      idSlide: 4,
      titulo: 'Boletín Ruta Relativa',
      descripcion: null,
      imagenUrl: 'api/static/boletines/pic.webp',
      formato: FormatoSlide.Vertical,
      enlaceUrl: null,
    },
    {
      idSlide: 5,
      titulo: 'Boletín Sin Imagen',
      descripcion: null,
      imagenUrl: '',
      formato: FormatoSlide.Vertical,
      enlaceUrl: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVpsApiBase).mockReturnValue('https://vps.example.test');
  });

  it('fetches slides and resolves image URLs when VPS base URL is configured', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSlides,
    });

    const slides = await boletinAdapter.getSlides();

    expect(slides).toHaveLength(5);
    expect(slides[0].imagenUrl).toBe('https://vps.example.test/api/static/boletines/mayo.webp');
    expect(slides[1].imagenUrl).toBe('https://cdn.example.com/junio.png');
    expect(slides[2].imagenUrl).toBe('data:image/png;base64,abc123');
    expect(slides[3].imagenUrl).toBe('https://vps.example.test/api/static/boletines/pic.webp');
    expect(slides[4].imagenUrl).toBe('');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://vps.example.test/api/boletinslides',
      expect.objectContaining({
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    );
  });

  it('normalizes relative image paths cleanly when VPS base URL is empty', async () => {
    vi.mocked(getVpsApiBase).mockReturnValue('');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSlides,
    });

    const slides = await boletinAdapter.getSlides();

    expect(slides[0].imagenUrl).toBe('/api/static/boletines/mayo.webp');
    expect(slides[3].imagenUrl).toBe('/api/static/boletines/pic.webp');
    expect(global.fetch).toHaveBeenCalledWith('/api/boletinslides', expect.any(Object));
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
  });
});
