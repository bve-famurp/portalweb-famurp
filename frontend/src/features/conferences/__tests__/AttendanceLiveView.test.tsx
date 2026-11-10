import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AttendanceLiveView } from '../components/attendance/AttendanceLiveView';
import { conferenceService } from '../services/conferenceService';
import { ConferenceSummary } from '../types';

vi.mock('../services/conferenceService', () => ({
  conferenceService: {
    markAttendance: vi.fn(),
    registerParticipant: vi.fn(),
  },
}));

describe('AttendanceLiveView', () => {
  const onBackToCalendar = vi.fn();

  const mockOpenConference: ConferenceSummary = {
    idConferencia: 10,
    tituloEvento: 'Conferencia de Medicina Tropical y Bioética',
    expositorPonente: 'Dr. Mario Vargas',
    entidadEditorial: 'Auditorio Principal',
    fechaHoraInicio: '2026-11-10T09:00:00Z',
    fechaHoraFin: '2026-11-10T11:00:00Z',
    modalidad: 'Presencial',
    ubicacion_o_Enlace: 'Auditorio Principal',
    asistenciaAbierta: true,
    estadoEvento: 'EnVivo',
    autoPurgar30Dias: false,
    fechaCaducidadPurge: null,
    totalInscritos: 25,
    totalAsistentes: 12,
  };

  const mockClosedConference: ConferenceSummary = {
    ...mockOpenConference,
    asistenciaAbierta: false,
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
  });

  it('renders closed attendance state when asistenciaAbierta is false', () => {
    render(
      <AttendanceLiveView
        conference={mockClosedConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    expect(screen.getByText('Marcación de Asistencia Cerrada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regresar al calendario/i })).toBeInTheDocument();
  });

  it('renders open conference details and fast kiosk interface', () => {
    render(
      <AttendanceLiveView
        conference={mockOpenConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    expect(screen.getByText('Control de Acceso para Conferencia')).toBeInTheDocument();
    expect(screen.getByText('Confirmación de Asistencia')).toBeInTheDocument();
    expect(screen.getByText('Marcación Abierta')).toBeInTheDocument();
    expect(screen.getByText('Conferencia de Medicina Tropical y Bioética')).toBeInTheDocument();
    expect(
      screen.getByText('Confirma tu Asistencia ingresando tu código o DNI o CE')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Ej. 202310452 o 74829103')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /confirmar asistencia/i })
    ).toBeInTheDocument();
  });

  it('marks attendance successfully for accredited participant and displays success card with DNI o CE', async () => {
    vi.mocked(conferenceService.markAttendance).mockResolvedValueOnce({
      status: 'ACREDITADO',
      mensaje: 'Asistencia registrada con éxito',
      nombreCompleto: 'Ana Sofía Paredes',
      hora: '09:15:00',
    });

    render(
      <AttendanceLiveView
        conference={mockOpenConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const input = screen.getByPlaceholderText('Ej. 202310452 o 74829103');
    fireEvent.change(input, { target: { value: '74829103' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar asistencia/i }));

    await waitFor(() => {
      expect(screen.getByText('¡Asistencia Marcada con Éxito!')).toBeInTheDocument();
    });

    expect(screen.getByText(/Ana Sofía Paredes/)).toBeInTheDocument();
    expect(screen.getByText('DNI o CE:')).toBeInTheDocument();
    expect(screen.getByText('74829103')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /marcar otra asistencia/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /marcar otra asistencia/i }));
    expect(screen.getByPlaceholderText('Ej. 202310452 o 74829103')).toBeInTheDocument();
  });

  it('displays informational warning when participant status is YA_REGISTRADO', async () => {
    vi.mocked(conferenceService.markAttendance).mockResolvedValueOnce({
      status: 'YA_REGISTRADO',
      mensaje: 'Ya registraste tu asistencia para esta sesión.',
    });

    render(
      <AttendanceLiveView
        conference={mockOpenConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const input = screen.getByPlaceholderText('Ej. 202310452 o 74829103');
    fireEvent.change(input, { target: { value: '202310999' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar asistencia/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Ya registraste tu asistencia para esta sesión.')
      ).toBeInTheDocument();
    });
  });

  it('opens door quick registration form when participant is NO_ENCONTRADO and completes registration', async () => {
    vi.mocked(conferenceService.markAttendance).mockResolvedValueOnce({
      status: 'NO_ENCONTRADO',
      mensaje: 'Participante no pre-inscrito',
    });

    render(
      <AttendanceLiveView
        conference={mockOpenConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const scanInput = screen.getByPlaceholderText('Ej. 202310452 o 74829103');
    fireEvent.change(scanInput, { target: { value: '71234567' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar asistencia/i }));

    await waitFor(() => {
      expect(screen.getByText('Registro Rápido en Puerta')).toBeInTheDocument();
    });

    const dniInput = screen.getByPlaceholderText('Ej. 74829103');
    expect(dniInput).toHaveValue('71234567');

    const codigoInput = screen.getByPlaceholderText('Ej. 202310452');
    fireEvent.change(codigoInput, { target: { value: '202310452' } });

    const paternoInput = screen.getByPlaceholderText('Ej. Mendoza');
    const nombresInput = screen.getByPlaceholderText('Ej. Carlos Eduardo');
    const correoInput = screen.getByPlaceholderText('Ej. carlos.mendoza@urp.edu.pe');

    fireEvent.change(paternoInput, { target: { value: 'Gómez' } });
    fireEvent.change(nombresInput, { target: { value: 'Luis' } });
    fireEvent.change(correoInput, { target: { value: 'luis.gomez@urp.edu.pe' } });

    vi.mocked(conferenceService.registerParticipant).mockResolvedValueOnce({
      message: 'Inscripción exitosa',
    });

    vi.mocked(conferenceService.markAttendance).mockResolvedValueOnce({
      status: 'ACREDITADO',
      mensaje: 'Asistencia registrada',
      nombreCompleto: 'Luis Gómez',
      hora: '09:20:00',
    });

    fireEvent.click(
      screen.getByRole('button', { name: /completar registro y confirmar asistencia/i })
    );

    await waitFor(() => {
      expect(conferenceService.registerParticipant).toHaveBeenCalled();
      expect(screen.getByText('¡Asistencia Marcada con Éxito!')).toBeInTheDocument();
    });

    expect(screen.getByText(/Luis Gómez/)).toBeInTheDocument();
  });
});
