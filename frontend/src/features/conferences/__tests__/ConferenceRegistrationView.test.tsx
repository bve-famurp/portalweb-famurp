import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConferenceRegistrationView } from '../components/attendance/ConferenceRegistrationView';
import { conferenceService } from '../services/conferenceService';
import { ConferenceSummary } from '../types';

vi.mock('../services/conferenceService', () => ({
  conferenceService: {
    checkStudentStatus: vi.fn(),
    registerParticipant: vi.fn(),
  },
}));

describe('ConferenceRegistrationView', () => {
  const onBackToCalendar = vi.fn();

  const mockConference: ConferenceSummary = {
    idConferencia: 42,
    tituloEvento: 'Simposio de Cardiología Intervencionista',
    expositorPonente: 'Dra. Ana Vega',
    entidadEditorial: 'Sociedad Médica URP',
    fechaHoraInicio: '2026-11-15T10:00:00Z',
    fechaHoraFin: '2026-11-15T12:00:00Z',
    modalidad: 'Presencial',
    ubicacion_o_Enlace: 'Aula Magna',
    asistenciaAbierta: true,
    estadoEvento: 'Publicado',
    autoPurgar30Dias: false,
    fechaCaducidadPurge: null,
    totalInscritos: 10,
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
  });

  it('renders DNI label with required asterisk and without optional text', () => {
    render(
      <ConferenceRegistrationView
        conference={mockConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const dniInput = screen.getByRole('textbox', { name: /DNI o CE/i });
    expect(dniInput).toBeInTheDocument();
    expect(screen.queryByText(/Opcional con Código URP/i)).not.toBeInTheDocument();
  });

  it('requires DNI when student is not verified and shows error if missing', async () => {
    render(
      <ConferenceRegistrationView
        conference={mockConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const codigoInput = screen.getByLabelText(/Código URP/i);
    fireEvent.change(codigoInput, { target: { value: '202310452' } });

    const submitBtn = screen.getByRole('button', { name: /Confirmar Pre-inscripción Oficial/i });
    fireEvent.submit(submitBtn);

    expect(await screen.findByText('El DNI o CE es obligatorio.')).toBeInTheDocument();
  });

  it('marks DNI as VALIDADO in green and readOnly when student is verified', async () => {
    vi.mocked(conferenceService.checkStudentStatus).mockResolvedValueOnce({
      status: 'PRESENTE',
      message: 'Estudiante verificado',
    });

    render(
      <ConferenceRegistrationView
        conference={mockConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const codigoInput = screen.getByLabelText(/Código URP/i);
    fireEvent.change(codigoInput, { target: { value: '202310452' } });

    const verifyBtn = screen.getByRole('button', { name: /Verificar/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      const dniInput = screen.getByRole('textbox', { name: /DNI o CE/i }) as HTMLInputElement;
      expect(dniInput.value).toBe('VALIDADO');
      expect(dniInput.readOnly).toBe(true);
      expect(dniInput.required).toBe(false);
      expect(dniInput.className).toContain('bg-emerald-50');
      expect(dniInput.className).toContain('border-emerald-500');
      expect(dniInput.className).toContain('text-[#008744]');
    });
  });

  it('resets verification and returns DNI to editable state when student modifies URP code', async () => {
    vi.mocked(conferenceService.checkStudentStatus).mockResolvedValueOnce({
      status: 'PRESENTE',
      message: 'Estudiante verificado',
    });

    render(
      <ConferenceRegistrationView
        conference={mockConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const codigoInput = screen.getByLabelText(/Código URP/i);
    fireEvent.change(codigoInput, { target: { value: '202310452' } });

    const verifyBtn = screen.getByRole('button', { name: /Verificar/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      const dniInput = screen.getByRole('textbox', { name: /DNI o CE/i }) as HTMLInputElement;
      expect(dniInput.value).toBe('VALIDADO');
    });

    fireEvent.change(codigoInput, { target: { value: '202310453' } });

    const dniInputAfter = screen.getByRole('textbox', { name: /DNI o CE/i }) as HTMLInputElement;
    expect(dniInputAfter.value).toBe('');
    expect(dniInputAfter.readOnly).toBe(false);
    expect(dniInputAfter.required).toBe(true);
    expect(dniInputAfter.className).toContain('bg-white');
    expect(dniInputAfter.className).toContain('border-slate-300');
  });

  it('allows verified student to submit registration without manual DNI', async () => {
    vi.mocked(conferenceService.checkStudentStatus).mockResolvedValueOnce({
      status: 'PRESENTE',
      message: 'Estudiante verificado',
    });
    vi.mocked(conferenceService.registerParticipant).mockResolvedValueOnce({
      message: 'Inscripción exitosa',
    });

    render(
      <ConferenceRegistrationView
        conference={mockConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const codigoInput = screen.getByLabelText(/Código URP/i);
    fireEvent.change(codigoInput, { target: { value: '202310452' } });

    const verifyBtn = screen.getByRole('button', { name: /Verificar/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Tus datos ya fueron validados/i)).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /Confirmar Pre-inscripción Oficial/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(conferenceService.registerParticipant).toHaveBeenCalledWith(
        42,
        expect.objectContaining({
          tipoParticipante: 'Estudiante',
          tipoDocumento: 'CODIGO_URP',
          numeroDocumento: '202310452',
          codigoURP: '202310452',
        })
      );
    });
  });

  it('requires DNI for non-student roles', async () => {
    render(
      <ConferenceRegistrationView
        conference={mockConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    const docenteBtn = screen.getByRole('button', { name: 'Docente' });
    fireEvent.click(docenteBtn);

    const submitBtn = screen.getByRole('button', { name: /Confirmar Pre-inscripción Oficial/i });
    fireEvent.submit(submitBtn);

    expect(await screen.findByText('El DNI o CE es obligatorio.')).toBeInTheDocument();
  });

  it('renders closed registration view when conference is finalized', () => {
    const finalizedConference: ConferenceSummary = {
      ...mockConference,
      estadoEvento: 'Finalizada',
    };

    render(
      <ConferenceRegistrationView
        conference={finalizedConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    expect(screen.getByText('Inscripciones Cerradas')).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes('La conferencia') &&
        content.includes('Simposio de Cardiología Intervencionista') &&
        content.includes('ya ha concluido. No se aceptan nuevas pre-inscripciones.')
      )
    ).toBeInTheDocument();

    const returnBtn = screen.getByRole('button', { name: /Regresar al Calendario/i });
    fireEvent.click(returnBtn);
    expect(onBackToCalendar).toHaveBeenCalled();
  });

  it('renders closed registration view when conference end date is in the past', () => {
    const pastConference: ConferenceSummary = {
      ...mockConference,
      fechaHoraFin: '2020-01-01T12:00:00Z',
    };

    render(
      <ConferenceRegistrationView
        conference={pastConference}
        onBackToCalendar={onBackToCalendar}
      />
    );

    expect(screen.getByText('Inscripciones Cerradas')).toBeInTheDocument();
  });
});
