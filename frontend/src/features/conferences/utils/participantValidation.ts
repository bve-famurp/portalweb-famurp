import { TipoParticipante, TipoDocumento } from '../types';

export interface ParticipantValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function sanitizeDocumentNumber(tipoDocumento: TipoDocumento, value: string): string {
  if (tipoDocumento === 'DNI') {
    return value.replace(/\D/g, '').slice(0, 8);
  }
  if (tipoDocumento === 'CODIGO_URP') {
    return value.replace(/\D/g, '').slice(0, 9);
  }
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9);
}

export function getDefaultDocAndCycleForParticipantType(tipo: TipoParticipante): {
  defaultTipoDocumento: TipoDocumento;
  defaultCiclo: number | null;
} {
  if (tipo === 'Pregrado' || tipo === 'Estudiante') {
    return { defaultTipoDocumento: 'CODIGO_URP', defaultCiclo: 1 };
  }
  return { defaultTipoDocumento: 'DNI', defaultCiclo: null };
}

export function resolveRegistrationDocument(
  cleanDni: string,
  cleanCodigo: string
): { effectiveDoc: string; tipoDoc: TipoDocumento } {
  const effectiveDoc = cleanDni || cleanCodigo;
  const isDocDni = cleanDni ? cleanDni.length === 8 && /^\d+$/.test(cleanDni) : false;
  const tipoDoc: TipoDocumento = isDocDni ? 'DNI' : (cleanDni ? 'CE' : 'CODIGO_URP');
  return { effectiveDoc, tipoDoc };
}

export function validateParticipantFields(params: {
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
}): ParticipantValidationResult {
  const { tipoDocumento, numeroDocumento, nombres, apellidos, correo } = params;

  if (tipoDocumento === 'DNI' && numeroDocumento.length !== 8) {
    return {
      isValid: false,
      errorMessage: 'El DNI debe contener exactamente 8 dígitos numéricos.',
    };
  }

  if (tipoDocumento === 'CODIGO_URP' && numeroDocumento.length !== 9) {
    return {
      isValid: false,
      errorMessage: 'El código de estudiante URP debe tener exactamente 9 dígitos numéricos.',
    };
  }

  if (tipoDocumento === 'CE' && numeroDocumento.length !== 9) {
    return {
      isValid: false,
      errorMessage: 'El Carné de Extranjería (CE) debe contener exactamente 9 caracteres.',
    };
  }

  if (!nombres.trim() || !apellidos.trim()) {
    return {
      isValid: false,
      errorMessage: 'Debe ingresar sus nombres y apellidos completos.',
    };
  }

  if (!correo.trim() || !correo.includes('@')) {
    return {
      isValid: false,
      errorMessage: 'Debe ingresar un correo electrónico institucional o de contacto válido.',
    };
  }

  return { isValid: true };
}
