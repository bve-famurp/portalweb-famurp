import { BoletinPort } from '../ports/boletin.port';
import { LegacyBoletinAdapter } from './legacyBoletinAdapter';

export const boletinPort: BoletinPort = new LegacyBoletinAdapter();
