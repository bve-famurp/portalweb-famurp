import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '../../../App';
import { ConferencesPage } from '../../../pages/ConferencesPage';
import { conferenceService } from '../services/conferenceService';
import { ConferenceSummary } from '../types';

vi.mock('../services/conferenceService', () => ({
  conferenceService: {
    getConferences: vi.fn(),
    getConferenceById: vi.fn(),
    markAttendance: vi.fn(),
    registerParticipant: vi.fn(),
  },
}));

describe('ConferencesRouting and Direct Deep-Links', () => {
  const mockConference: ConferenceSummary = {
    idConferencia: 4,
    tituloEvento: 'Conferencia de Cardiología Preventiva',
    expositorPonente: 'Dra. Elena Ramos',
    entidadEditorial: 'Auditorio Central URP',
    fechaHoraInicio: '2026-11-20T10:00:00Z',
    fechaHoraFin: '2026-11-20T12:00:00Z',
    modalidad: 'Presencial',
    ubicacion_o_Enlace: 'Auditorio Central URP',
    asistenciaAbierta: true,
    estadoEvento: 'Publicado',
    autoPurgar30Dias: false,
    fechaCaducidadPurge: null,
    totalInscritos: 15,
    totalAsistentes: 0,
  };

  beforeAll(() => {
    window.scrollTo = vi.fn();
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
      createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '';
    vi.mocked(conferenceService.getConferences).mockResolvedValue([mockConference]);
    vi.mocked(conferenceService.getConferenceById).mockResolvedValue(mockConference);
  });

  it('renders registration view without hook violations when accessing deep-link with inscripcion', async () => {
    window.location.hash = '#conferencias?inscripcion=4';
    render(<ConferencesPage />);

    await waitFor(() => {
      expect(screen.getByText('Pre-inscripción a Conferencia')).toBeInTheDocument();
    });

    expect(screen.getByText('Conferencia de Cardiología Preventiva')).toBeInTheDocument();
  });

  it('renders live attendance view without hook violations when accessing deep-link with asistencia', async () => {
    window.location.hash = '#conferencias?asistencia=4';
    render(<ConferencesPage />);

    await waitFor(() => {
      expect(screen.getByText('Confirmación de Asistencia')).toBeInTheDocument();
    });

    expect(screen.getByText('Conferencia de Cardiología Preventiva')).toBeInTheDocument();
  });

  it('renders general conference calendar and list when accessing general conferences hash', async () => {
    window.location.hash = '#conferencias';
    render(<ConferencesPage />);

    await waitFor(() => {
      expect(screen.getByText('Próximas Actividades')).toBeInTheDocument();
    });

    expect(screen.getByText('Conferencia de Cardiología Preventiva')).toBeInTheDocument();
  });

  it('hides footer on focused conference deep-links in App', async () => {
    window.location.hash = '#conferencias?inscripcion=4';
    const { unmount } = render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pre-inscripción a Conferencia')).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/Biblioteca Virtual y Especializada de la Facultad de Medicina Humana/i)
    ).not.toBeInTheDocument();
    unmount();

    window.location.hash = '#conferencias';
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Próximas Actividades')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Biblioteca Virtual y Especializada de la Facultad de Medicina Humana/i)
    ).toBeInTheDocument();
  });
});
