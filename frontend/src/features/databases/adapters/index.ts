import { BasesDeDatosPort } from '../ports/basesDeDatos.port';
import { CursosPort } from '../ports/cursos.port';
import { StaticBasesDeDatosAdapter } from './staticBasesDeDatosAdapter';
import { StaticCursosAdapter } from './staticCursosAdapter';

export const basesDeDatosPort: BasesDeDatosPort = new StaticBasesDeDatosAdapter();
export const cursosPort: CursosPort = new StaticCursosAdapter();
