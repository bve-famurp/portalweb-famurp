import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '../../../App';
import { ConferencesPage } from '../../../pages/ConferencesPage';
import { conferenciasPort } from '../adapters';
import { ConferenceSummary } from '../types';

vi.mock('../adapters', () => ({
  conferenciasPort: {
    getConferences: vi.fn(),
    getConferenceById: vi.fn(),
  },
}));

describe('ConferencesRouting', () => {
  const mockConference: ConferenceSummary = {
    idConferencia: 4,
    tituloEvento: 'Conferencia de Cardiología Preventiva',
    expositorPonente: 'Dra. Elena Ramos',
    entidadEditorial: 'Auditorio Central URP',
    fechaHoraInicio: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    fechaHoraFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    modalidad: 'Presencial',
    ubicacion_o_Enlace: 'Auditorio Central URP',
    asistenciaAbierta: false,
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
    vi.mocked(conferenciasPort.getConferences).mockResolvedValue([mockConference]);
    vi.mocked(conferenciasPort.getConferenceById).mockResolvedValue(mockConference);
  });

  it('renders general conference calendar and list when accessing general conferences hash', async () => {
    window.location.hash = '#conferencias';
    render(<ConferencesPage />);

    await waitFor(() => {
      expect(screen.getByText('Próximas Actividades')).toBeInTheDocument();
    });

    expect(screen.getByText('Conferencia de Cardiología Preventiva')).toBeInTheDocument();
  });

  it('renders footer on conferences view in App', async () => {
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
