import { CursosPort } from '../ports/cursos.port';
import { STATIC_CURSOS } from '../data/staticCursosData';
import { CourseApiDto } from '../types/resourceApiTypes';

export class StaticCursosAdapter implements CursosPort {
  getCursos(): Promise<CourseApiDto[]> {
    return Promise.resolve([...STATIC_CURSOS]);
  }

  getAsignaturas(): Promise<string[]> {
    return Promise.resolve(STATIC_CURSOS.map((c) => c.nombreCurso));
  }
}

export const cursosAdapter = new StaticCursosAdapter();
