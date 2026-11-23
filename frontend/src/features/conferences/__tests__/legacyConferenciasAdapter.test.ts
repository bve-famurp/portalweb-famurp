import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LegacyConferenciasAdapter, conferenciasAdapter } from '../adapters/legacyConferenciasAdapter';
import { conferenceService } from '../services/conferenceService';
import { ConferenceSummary } from '../types';

describe('legacyConferenciasAdapter', () => {
  const mockConference: ConferenceSummary = {
    idConferencia: 1,
    tituloEvento: 'Conferencia de Neurología',
    expositorPonente: 'Dr. Roberto Mendoza',
    entidadEditorial: 'Sociedad Peruana de Neurología',
    fechaHoraInicio: '2026-05-10T10:00:00Z',
    fechaHoraFin: '2026-05-10T12:00:00Z',
    modalidad: 'Presencial',
    ubicacion_o_Enlace: 'Auditorio FAMURP',
    asistenciaAbierta: true,
    estadoEvento: 'Publicado',
    autoPurgar30Dias: false,
    fechaCaducidadPurge: null,
    totalInscritos: 25,
    totalAsistentes: 0,
  };

  const mockConferences: ConferenceSummary[] = [mockConference];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches conferences without query params successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockConferences,
    });

    const data = await conferenciasAdapter.getConferences();

    expect(data).toEqual(mockConferences);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/Conferences'),
      expect.objectContaining({
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    );
    const calledUrl = (global.fetch as any).mock.calls[0][0];
    expect(calledUrl).not.toContain('?');
  });

  it('fetches conferences with desde and hasta query params', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockConferences,
    });

    const desde = '2026-05-01T00:00:00Z';
    const hasta = '2026-05-31T23:59:59Z';
    const data = await conferenciasAdapter.getConferences(desde, hasta);

    expect(data).toEqual(mockConferences);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as any).mock.calls[0][0];
    expect(calledUrl).toContain(`desde=${encodeURIComponent(desde)}`);
    expect(calledUrl).toContain(`hasta=${encodeURIComponent(hasta)}`);
  });

  it('fetches single conference by id successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockConference,
    });

    const data = await conferenciasAdapter.getConferenceById(1);

    expect(data).toEqual(mockConference);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/Conferences/1'),
      expect.objectContaining({
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    );
  });

  it('throws descriptive error when getConferences receives non-ok HTTP response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(conferenciasAdapter.getConferences()).rejects.toThrow(
      'Error al cargar la agenda de conferencias.'
    );
  });

  it('throws descriptive error when getConferenceById receives non-ok HTTP response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(conferenciasAdapter.getConferenceById(99)).rejects.toThrow(
      'Error al obtener los detalles de la conferencia.'
    );
  });

  it('propagates network failure when getConferences fetch rejects', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(conferenciasAdapter.getConferences()).rejects.toThrow('Network error');
  });

  it('propagates network failure when getConferenceById fetch rejects', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(conferenciasAdapter.getConferenceById(1)).rejects.toThrow('Network error');
  });

  it('allows instantiation of class and satisfies port contract', () => {
    const customAdapter = new LegacyConferenciasAdapter();

    expect(typeof customAdapter.getConferences).toBe('function');
    expect(typeof customAdapter.getConferenceById).toBe('function');
  });

  it('falls back to direct fetch implementation when conferenceService is not provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockConferences,
    });

    const originalGetConferences = conferenceService.getConferences;
    (conferenceService as any).getConferences = undefined;

    try {
      const data = await conferenciasAdapter.getConferences('2026-05-01', '2026-05-31');
      expect(data).toEqual(mockConferences);
    } finally {
      conferenceService.getConferences = originalGetConferences;
    }
  });

  it('falls back to direct fetch for getConferenceById when conferenceService method is undefined', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockConference,
    });

    const originalGetById = conferenceService.getConferenceById;
    (conferenceService as any).getConferenceById = undefined;

    try {
      const data = await conferenciasAdapter.getConferenceById(1);
      expect(data).toEqual(mockConference);
    } finally {
      conferenceService.getConferenceById = originalGetById;
    }
  });
});
