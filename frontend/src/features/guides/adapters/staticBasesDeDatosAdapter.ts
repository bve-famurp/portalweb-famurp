import { BasesDeDatosPort } from '../ports/basesDeDatos.port';
import { MedicalDatabase } from '../data/databasesData';
import { STATIC_DATABASES } from '../data/staticDatabasesData';

export class StaticBasesDeDatosAdapter implements BasesDeDatosPort {
  getDatabases(): Promise<MedicalDatabase[]> {
    return Promise.resolve([...STATIC_DATABASES]);
  }

  getMatrizHexagonal(): Promise<MedicalDatabase[]> {
    const hexagonDatabases = STATIC_DATABASES.filter(
      (db) => db.mostrarEnHexagonos === true || db.isFeatured === true
    ).slice(0, 15);
    return Promise.resolve([...hexagonDatabases]);
  }

  getDatabaseById(id: string | number): Promise<MedicalDatabase | null> {
    const strId = String(id).trim();
    const numId = typeof id === 'number' ? id : Number(strId.replace(/\D/g, ''));
    const found = STATIC_DATABASES.find(
      (db) =>
        db.id === strId ||
        `db-${db.id}` === strId ||
        (strId.startsWith('db-') && db.id === strId.substring(3)) ||
        (db.rawId !== undefined && !isNaN(numId) && db.rawId === numId)
    );
    return Promise.resolve(found ?? null);
  }

  getLogoUrl(logoFile?: string | null): string {
    if (!logoFile) return '';
    if (logoFile.startsWith('http://') || logoFile.startsWith('https://')) {
      return logoFile;
    }
    let clean = logoFile.trim();
    clean = clean.replace(/^\/api\/static\/logos_bd\//, '');
    clean = clean.replace(/^\/logos_bd\//, '');
    clean = clean.replace(/^\//, '');
    clean = clean.replace(/\.(png|jpg|jpeg|webp)$/i, '');
    return `/logos_bd/${clean}.webp`;
  }
}

export const basesDeDatosAdapter = new StaticBasesDeDatosAdapter();
