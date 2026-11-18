import { getVpsApiBase } from '../../../core/apiConfig';
import {
  ConferenceSummary,
  RegisterParticipantRequest,
  MarkAttendanceRequest,
  MarkAttendanceResponse,
  CheckStudentStatusResponse,
} from '../types';

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

  async checkStudentStatus(code: string): Promise<CheckStudentStatusResponse> {
    const response = await fetch(`${getVpsApiBase()}/api/v1/Conferences/check-student-status?code=${encodeURIComponent(code)}`);
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.message || body.mensaje || 'Error al verificar el estado del estudiante.');
    }
    return body;
  },

  async registerParticipant(id: number, data: RegisterParticipantRequest): Promise<{
    message?: string;
    mensaje?: string;
    alreadyRegistered?: boolean;
    participant?: {
      nombres: string;
      apellidos: string;
      apellidoPaterno?: string;
      apellidoMaterno?: string | null;
      tipoDocumento: string;
      numeroDocumento: string;
      tipoParticipante: string;
      correo: string;
      cicloAcademico: number | null;
    };
  }> {
    const response = await fetch(`${getVpsApiBase()}/api/v1/Conferences/${id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await response.json().catch(() => ({}));
    if (response.status === 409) {
      return {
        alreadyRegistered: true,
        message: body.message || body.mensaje,
        ...body,
      };
    }
    if (!response.ok) {
      throw new Error(body.mensaje || body.message || 'Error al procesar la pre-inscripción.');
    }
    return body;
  },

  async markAttendance(id: number, data: MarkAttendanceRequest): Promise<MarkAttendanceResponse> {
    const payload = data.documentoOCodigo
      ? { documentoOCodigo: data.documentoOCodigo }
      : { documentoOCodigo: data.numeroDocumento || '' };

    const response = await fetch(`${getVpsApiBase()}/api/v1/Conferences/${id}/attendances/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const body = await response.json().catch(() => ({}));
    if (response.status === 404 && (body.status === 'NO_ENCONTRADO' || body.status === 'no_encontrado')) {
      return {
        ...body,
        status: 'NO_ENCONTRADO',
      } as MarkAttendanceResponse;
    }
    if (!response.ok) {
      throw new Error(body.mensaje || body.message || 'Error al registrar la marcación de asistencia.');
    }
    return body;
  },
};
