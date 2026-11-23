import { ConferenceSummary } from '../types';

export interface ConferenciasPort {
  getConferences(desde?: string, hasta?: string): Promise<ConferenceSummary[]>;
  getConferenceById(id: number): Promise<ConferenceSummary>;
}
