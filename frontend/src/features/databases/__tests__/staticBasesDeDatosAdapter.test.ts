import { describe, it, expect } from 'vitest';
import { basesDeDatosAdapter, StaticBasesDeDatosAdapter } from '../adapters/staticBasesDeDatosAdapter';
import { getDatabaseLogoUrl } from '../data/databasesData';
import { STATIC_DATABASES } from '../data/staticDatabasesData';

describe('StaticBasesDeDatosAdapter', () => {
  it('instantiates correctly and implements BasesDeDatosPort', () => {
    expect(basesDeDatosAdapter).toBeInstanceOf(StaticBasesDeDatosAdapter);
  });

  it('retrieves all 46 medical databases', async () => {
    const databases = await basesDeDatosAdapter.getDatabases();
    expect(databases).toHaveLength(46);
    databases.forEach((db, idx) => {
      expect(db.id).toBe(STATIC_DATABASES[idx].id);
      expect(db.rawId).toBe(STATIC_DATABASES[idx].rawId);
      expect(Array.isArray(db.cursos)).toBe(true);
    });
  });

  it('ensures each database has valid webp logoFile, resolved logoUrl and required fields', async () => {
    const databases = await basesDeDatosAdapter.getDatabases();
    databases.forEach((db) => {
      expect(db.id).toBeTruthy();
      expect(db.title).toBeTruthy();
      expect(db.description).toBeTruthy();
      expect(['Suscripción URP', 'Acceso Abierto']).toContain(db.accessType);
      expect(db.logoFile).toMatch(/\.webp$/);
      expect(db.logoUrl).toMatch(/^\/logos_bd\/.+\.webp$/);
      expect(db.accessUrl).toMatch(/^https?:\/\//);
      expect(Array.isArray(db.cursos)).toBe(true);
    });
  });

  it('retrieves maximum 15 databases for the hexagonal molecular matrix', async () => {
    const hex = await basesDeDatosAdapter.getMatrizHexagonal();
    expect(hex.length).toBeLessThanOrEqual(15);
    expect(hex.length).toBeGreaterThan(0);
    hex.forEach((item) => {
      expect(item.mostrarEnHexagonos === true || item.isFeatured === true).toBe(true);
    });
  });

  it('retrieves database by string id or rawId', async () => {
    const byId = await basesDeDatosAdapter.getDatabaseById('clinicalkey-espanol');
    expect(byId).not.toBeNull();
    expect(byId?.title).toBe('ClinicalKey Español');

    const byPrefixedId = await basesDeDatosAdapter.getDatabaseById('db-clinicalkey-espanol');
    expect(byPrefixedId).not.toBeNull();
    expect(byPrefixedId?.title).toBe('ClinicalKey Español');

    const byRawId = await basesDeDatosAdapter.getDatabaseById(1);
    expect(byRawId).not.toBeNull();
    expect(byRawId?.rawId).toBe(1);

    const fiveMinuteConsult = await basesDeDatosAdapter.getDatabaseById('5minute-consult');
    expect(fiveMinuteConsult).not.toBeNull();
    expect(fiveMinuteConsult?.id).toBe('5minute-consult');
    expect(fiveMinuteConsult?.rawId).toBe(8);

    const nonExistent = await basesDeDatosAdapter.getDatabaseById('non-existent-id');
    expect(nonExistent).toBeNull();
  });

  it('normalizes logo URLs accurately to webp static paths', () => {
    expect(getDatabaseLogoUrl('accessmedicina-espanol.png')).toBe(
      '/logos_bd/accessmedicina-espanol.webp'
    );
    expect(getDatabaseLogoUrl('/api/static/logos_bd/pubmed.png')).toBe(
      '/logos_bd/pubmed.webp'
    );
    expect(getDatabaseLogoUrl('/logos_bd/dynamedex.webp')).toBe(
      '/logos_bd/dynamedex.webp'
    );
    expect(getDatabaseLogoUrl('ebooksdeovid.jpg')).toBe(
      '/logos_bd/ebooksdeovid.webp'
    );
    expect(getDatabaseLogoUrl('https://example.com/logo.png')).toBe(
      'https://example.com/logo.png'
    );
    expect(getDatabaseLogoUrl('')).toBe('');
    expect(getDatabaseLogoUrl(undefined)).toBe('');
    expect(getDatabaseLogoUrl(null)).toBe('');
  });
});
