import { describe, it, expect } from 'vitest';
import { cursosAdapter, StaticCursosAdapter } from '../adapters/staticCursosAdapter';
import { STATIC_CURSOS } from '../data/staticCursosData';

describe('StaticCursosAdapter', () => {
  it('instantiates correctly and implements CursosPort', () => {
    expect(cursosAdapter).toBeInstanceOf(StaticCursosAdapter);
  });

  it('returns all 12 curricular courses of FAMURP medicine', async () => {
    const cursos = await cursosAdapter.getCursos();
    expect(cursos).toHaveLength(12);
    expect(cursos).toEqual(STATIC_CURSOS);
    expect(cursos).toContain('Medicina General');
    expect(cursos).toContain('Farmacología');
    expect(cursos).toContain('Anatomía Humana');
    expect(cursos).toContain('Fisiología Médica');
    expect(cursos).toContain('Patología Clínica');
    expect(cursos).toContain('Pediatría');
    expect(cursos).toContain('Ginecología y Obstetricia');
    expect(cursos).toContain('Cirugía General');
    expect(cursos).toContain('Medicina Interna');
    expect(cursos).toContain('Cardiología');
    expect(cursos).toContain('Neurología');
    expect(cursos).toContain('Salud Pública y Epidemiología');
  });
});
