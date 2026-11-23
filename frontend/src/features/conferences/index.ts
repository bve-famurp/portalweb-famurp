export type { ConferenceSummary } from './types';
export type { ConferenciasPort } from './ports/conferencias.port';
export { LegacyConferenciasAdapter, conferenciasAdapter } from './adapters/legacyConferenciasAdapter';
export { conferenceService } from './services/conferenceService';
export { ConferenceMonthlyCalendar } from './components/calendar/ConferenceMonthlyCalendar';
export { ConferenceCard } from './components/calendar/ConferenceCard';
