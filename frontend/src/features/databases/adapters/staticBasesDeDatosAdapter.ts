import { BasesDeDatosPort } from '../ports/basesDeDatos.port';
import { CleanMedicalDatabase, MedicalDatabase, getDatabaseLogoUrl } from '../data/databasesData';
import { STATIC_DATABASES } from '../data/staticDatabasesData';
import { STATIC_CURSOS } from '../data/staticCursosData';
import { BASE_CURSO_RELATIONS } from '../data/staticRelacionesData';
import { CourseApiDto } from '../types/resourceApiTypes';

const cursosById = new Map<number, CourseApiDto>(STATIC_CURSOS.map((c) => [c.idCurso, c]));

const hydrateDatabase = (cleanDb: CleanMedicalDatabase): MedicalDatabase => {
  const cursoIds = BASE_CURSO_RELATIONS[cleanDb.rawId] || [];
  const cursos = cursoIds
    .map((id) => cursosById.get(id))
    .filter((c): c is CourseApiDto => Boolean(c));
  return {
    ...cleanDb,
    cursos,
  };
};

const HYDRATED_DATABASES: MedicalDatabase[] = STATIC_DATABASES.map(hydrateDatabase);

export class StaticBasesDeDatosAdapter implements BasesDeDatosPort {
  getDatabases(): Promise<MedicalDatabase[]> {
    return Promise.resolve([...HYDRATED_DATABASES]);
  }

  getMatrizHexagonal(): Promise<MedicalDatabase[]> {
    const hexagonDatabases = HYDRATED_DATABASES.filter(
      (db) => db.mostrarEnHexagonos === true || db.isFeatured === true
    ).slice(0, 15);
    return Promise.resolve([...hexagonDatabases]);
  }

  getDatabaseById(id: string | number): Promise<MedicalDatabase | null> {
    const strId = String(id).trim();
    const normalizedSlug = strId.startsWith('db-') ? strId.slice(3) : strId;
    const exactSlugMatch = HYDRATED_DATABASES.find(
      (db) => db.id === strId || db.id === normalizedSlug
    );
    if (exactSlugMatch) {
      return Promise.resolve(exactSlugMatch);
    }

    let numId: number | null = null;
    if (typeof id === 'number' && !Number.isNaN(id)) {
      numId = id;
    } else if (/^\d+$/.test(strId)) {
      numId = Number(strId);
    } else if (/^db-\d+$/.test(strId)) {
      numId = Number(strId.slice(3));
    }

    if (numId !== null) {
      const byRawId = HYDRATED_DATABASES.find((db) => db.rawId === numId);
      return Promise.resolve(byRawId ?? null);
    }

    return Promise.resolve(null);
  }

  getLogoUrl(logoFile?: string | null): string {
    return getDatabaseLogoUrl(logoFile);
  }
}

export const basesDeDatosAdapter = new StaticBasesDeDatosAdapter();
