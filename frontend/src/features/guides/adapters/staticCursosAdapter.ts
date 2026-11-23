import { CursosPort } from '../ports/cursos.port';
import { STATIC_CURSOS } from '../data/staticCursosData';

export class StaticCursosAdapter implements CursosPort {
  getCursos(): Promise<string[]> {
    return Promise.resolve([...STATIC_CURSOS]);
  }
}

export const cursosAdapter = new StaticCursosAdapter();
