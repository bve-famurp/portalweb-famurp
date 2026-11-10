import { describe, it, expect } from 'vitest';
import {
  sanitizeDocumentNumber,
  getDefaultDocAndCycleForParticipantType,
  resolveRegistrationDocument,
  validateParticipantFields,
} from '../utils/participantValidation';

describe('participantValidation', () => {
  describe('sanitizeDocumentNumber', () => {
    it('restricts DNI to 8 numeric digits', () => {
      expect(sanitizeDocumentNumber('DNI', '12.345.678')).toBe('12345678');
      expect(sanitizeDocumentNumber('DNI', '1234567890')).toBe('12345678');
      expect(sanitizeDocumentNumber('DNI', 'abc-123-xyz')).toBe('123');
    });

    it('restricts CODIGO_URP to 9 numeric digits', () => {
      expect(sanitizeDocumentNumber('CODIGO_URP', '2023-12345')).toBe('202312345');
      expect(sanitizeDocumentNumber('CODIGO_URP', '202312345678')).toBe('202312345');
    });

    it('cleans other document types to uppercase alphanumeric with max 9 chars', () => {
      expect(sanitizeDocumentNumber('CE', 'ce-12345-ab')).toBe('CE12345AB');
      expect(sanitizeDocumentNumber('CE', '1234567890123')).toBe('123456789');
    });
  });

  describe('getDefaultDocAndCycleForParticipantType', () => {
    it('returns CODIGO_URP and cycle 1 for Pregrado or Estudiante', () => {
      expect(getDefaultDocAndCycleForParticipantType('Pregrado')).toEqual({
        defaultTipoDocumento: 'CODIGO_URP',
        defaultCiclo: 1,
      });
      expect(getDefaultDocAndCycleForParticipantType('Estudiante')).toEqual({
        defaultTipoDocumento: 'CODIGO_URP',
        defaultCiclo: 1,
      });
    });

    it('returns DNI and null cycle for Docente and other types', () => {
      expect(getDefaultDocAndCycleForParticipantType('Docente')).toEqual({
        defaultTipoDocumento: 'DNI',
        defaultCiclo: null,
      });
      expect(getDefaultDocAndCycleForParticipantType('Posgrado')).toEqual({
        defaultTipoDocumento: 'DNI',
        defaultCiclo: null,
      });
      expect(getDefaultDocAndCycleForParticipantType('Otro')).toEqual({
        defaultTipoDocumento: 'DNI',
        defaultCiclo: null,
      });
    });
  });

  describe('validateParticipantFields', () => {
    const baseValid = {
      tipoDocumento: 'DNI' as const,
      numeroDocumento: '12345678',
      nombres: 'María',
      apellidos: 'García',
      correo: 'maria.garcia@urp.edu.pe',
    };

    it('validates correct DNI participant', () => {
      const result = validateParticipantFields(baseValid);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('rejects DNI with invalid length', () => {
      const result = validateParticipantFields({
        ...baseValid,
        numeroDocumento: '1234567',
      });
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('8 dígitos');
    });

    it('rejects CODIGO_URP with invalid length', () => {
      const result = validateParticipantFields({
        ...baseValid,
        tipoDocumento: 'CODIGO_URP',
        numeroDocumento: '20231234',
      });
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('9 dígitos');
    });

    it('validates correct CODIGO_URP participant', () => {
      const result = validateParticipantFields({
        ...baseValid,
        tipoDocumento: 'CODIGO_URP',
        numeroDocumento: '202312345',
      });
      expect(result.isValid).toBe(true);
    });

    it('rejects empty names or surnames', () => {
      const resultEmptyName = validateParticipantFields({
        ...baseValid,
        nombres: '   ',
      });
      expect(resultEmptyName.isValid).toBe(false);
      expect(resultEmptyName.errorMessage).toContain('nombres y apellidos');

      const resultEmptySurname = validateParticipantFields({
        ...baseValid,
        apellidos: '',
      });
      expect(resultEmptySurname.isValid).toBe(false);
      expect(resultEmptySurname.errorMessage).toContain('nombres y apellidos');
    });

    it('rejects invalid email formats', () => {
      const resultNoAt = validateParticipantFields({
        ...baseValid,
        correo: 'correo-sin-arroba.com',
      });
      expect(resultNoAt.isValid).toBe(false);
      expect(resultNoAt.errorMessage).toContain('correo');

      const resultEmptyEmail = validateParticipantFields({
        ...baseValid,
        correo: ' ',
      });
      expect(resultEmptyEmail.isValid).toBe(false);
    });
  });

  describe('resolveRegistrationDocument', () => {
    it('resolves student with only URP code as CODIGO_URP', () => {
      const result = resolveRegistrationDocument('', '202310452');
      expect(result).toEqual({
        effectiveDoc: '202310452',
        tipoDoc: 'CODIGO_URP',
      });
    });

    it('resolves student with both 8-digit DNI and URP code preferring DNI', () => {
      const result = resolveRegistrationDocument('74829103', '202310452');
      expect(result).toEqual({
        effectiveDoc: '74829103',
        tipoDoc: 'DNI',
      });
    });

    it('resolves participant with only 8-digit DNI as DNI', () => {
      const result = resolveRegistrationDocument('74829103', '');
      expect(result).toEqual({
        effectiveDoc: '74829103',
        tipoDoc: 'DNI',
      });
    });

    it('resolves participant with 9-digit CE document as CE', () => {
      const result = resolveRegistrationDocument('001293847', '202310452');
      expect(result).toEqual({
        effectiveDoc: '001293847',
        tipoDoc: 'CE',
      });
    });

    it('resolves participant with alphanumeric CE document as CE', () => {
      const result = resolveRegistrationDocument('CE1234567', '');
      expect(result).toEqual({
        effectiveDoc: 'CE1234567',
        tipoDoc: 'CE',
      });
    });
  });
});
