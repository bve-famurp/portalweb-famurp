import { MedicalDatabase } from '../data/databasesData';

export interface BasesDeDatosPort {
  getDatabases(): Promise<MedicalDatabase[]>;
  getMatrizHexagonal(): Promise<MedicalDatabase[]>;
  getDatabaseById(id: string | number): Promise<MedicalDatabase | null>;
  getLogoUrl(logoFile?: string | null): string;
}
