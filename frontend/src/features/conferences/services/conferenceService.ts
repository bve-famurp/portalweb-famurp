import { getVpsApiBase } from '../../../core/apiConfig';
import { ConferenceSummary } from '../types';

export const conferenceService = {
  async getConferences(desde?: string, hasta?: string): Promise<ConferenceSummary[]> {
    const params = new URLSearchParams();
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${getVpsApiBase()}/api/v1/Conferences${qs}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (!response.ok) {
      throw new Error('Error al cargar la agenda de conferencias.');
    }
    return await response.json();
  },

  async getConferenceById(id: number): Promise<ConferenceSummary> {
    const response = await fetch(`${getVpsApiBase()}/api/v1/Conferences/${id}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los detalles de la conferencia.');
    }
    return await response.json();
  },
};
