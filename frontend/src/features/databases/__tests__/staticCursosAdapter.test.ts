import { describe, it, expect } from 'vitest';
import { cursosAdapter, StaticCursosAdapter } from '../adapters/staticCursosAdapter';
import { STATIC_CURSOS } from '../data/staticCursosData';

describe('StaticCursosAdapter', () => {
  it('instantiates correctly and implements CursosPort', () => {
    expect(cursosAdapter).toBeInstanceOf(StaticCursosAdapter);
  });

  it('returns all 45 curricular courses of FAMURP medicine with full attributes', async () => {
    const cursos = await cursosAdapter.getCursos();
    expect(cursos).toHaveLength(45);
    expect(cursos).toEqual(STATIC_CURSOS);

    cursos.forEach((curso) => {
      expect(typeof curso.idCurso).toBe('number');
      expect(typeof curso.nombreCurso).toBe('string');
      expect(typeof curso.ciclo).toBe('number');
      expect(curso.ciclo).toBeGreaterThanOrEqual(1);
      expect(curso.ciclo).toBeLessThanOrEqual(13);
    });

    const nombres = await cursosAdapter.getAsignaturas();
    expect(nombres).toHaveLength(45);
    expect(nombres).toContain('Biofísica');
    expect(nombres).toContain('Farmacología');
    expect(nombres).toContain('Morfofisiología Humana I');
    expect(nombres).toContain('Bioquímica');
    expect(nombres).toContain('Cirugía I');
    expect(nombres).toContain('Medicina Interna I');
    expect(nombres).toContain('Internado Médico');
  });
});
