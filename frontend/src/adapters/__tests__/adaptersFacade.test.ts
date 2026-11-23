import { describe, it, expect } from 'vitest';
import {
  boletinAdapter,
  conferenciasAdapter,
  basesDeDatosAdapter,
  cursosAdapter,
} from '../index';

describe('adapters facade', () => {
  it('exports all 4 adapters as defined instances', () => {
    expect(boletinAdapter).toBeDefined();
    expect(typeof boletinAdapter.getSlides).toBe('function');
    expect(typeof boletinAdapter.resolveImageUrl).toBe('function');

    expect(conferenciasAdapter).toBeDefined();
    expect(typeof conferenciasAdapter.getConferences).toBe('function');
    expect(typeof conferenciasAdapter.getConferenceById).toBe('function');

    expect(basesDeDatosAdapter).toBeDefined();
    expect(typeof basesDeDatosAdapter.getDatabases).toBe('function');
    expect(typeof basesDeDatosAdapter.getMatrizHexagonal).toBe('function');
    expect(typeof basesDeDatosAdapter.getDatabaseById).toBe('function');
    expect(typeof basesDeDatosAdapter.getLogoUrl).toBe('function');

    expect(cursosAdapter).toBeDefined();
    expect(typeof cursosAdapter.getCursos).toBe('function');
  });
});
