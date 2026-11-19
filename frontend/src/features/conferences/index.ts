export type {
  TipoParticipante,
  TipoDocumento,
  ConferenceSummary,
  RegisterParticipantRequest,
  MarkAttendanceRequest,
  MarkAttendanceResponse,
  CheckStudentStatusResponse,
} from './types';
export { conferenceService } from './services/conferenceService';

export { ConferenceMonthlyCalendar } from './components/calendar/ConferenceMonthlyCalendar';
export { ConferenceCard } from './components/calendar/ConferenceCard';

export {
  ConferenceParticipantFormFields,
  ConferenceRoleSelector,
} from './components/attendance/ConferenceParticipantFormFields';
export { ConferenceRegistrationView } from './components/attendance/ConferenceRegistrationView';
export { ConferenceRegistrationSuccessCard } from './components/attendance/ConferenceRegistrationSuccessCard';
export { AttendanceLiveView } from './components/attendance/AttendanceLiveView';
export { AttendanceLiveSuccessCard } from './components/attendance/AttendanceLiveSuccessCard';
