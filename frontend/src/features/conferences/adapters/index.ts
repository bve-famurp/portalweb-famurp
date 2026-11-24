import { ConferenciasPort } from '../ports/conferencias.port';
import { LegacyConferenciasAdapter } from './legacyConferenciasAdapter';

export const conferenciasPort: ConferenciasPort = new LegacyConferenciasAdapter();
