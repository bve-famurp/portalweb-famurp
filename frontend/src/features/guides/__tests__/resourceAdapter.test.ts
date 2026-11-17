import { describe, it, expect } from 'vitest';
import { mapApiResourceToMedicalDatabase } from '../utils/resourceAdapter';
import { ResourceApiDto, ResourcePublicApiDto } from '../types/resourceApiTypes';

describe('resourceAdapter', () => {
  const baseDto: ResourceApiDto = {
    id: 42,
    name: 'ClinicalKey',
    logoUrl: '/logos/clinicalkey.png',
    clinicalDescription: 'Plataforma de recursos médicos clínicos',
    isSubscription: true,
    hasMobileApp: true,
    externalUrl: 'https://www.clinicalkey.es',
    isActive: true,
    mostrarEnHexagonos: true,
    subjects: ['Medicina Interna', 'Cirugía'],
    tutorial: {
      id: 10,
      youtubeVideoId: 'dQw4w9WgXcQ',
      guidePdfUrl: null,
    },
  };

  it('maps subscription resource correctly', () => {
    const result = mapApiResourceToMedicalDatabase(baseDto);

    expect(result.id).toBe('db-42');
    expect(result.rawId).toBe(42);
    expect(result.title).toBe('ClinicalKey');
    expect(result.accessType).toBe('Suscripción URP');
    expect(result.isFeatured).toBe(true);
    expect(result.hasMobileApp).toBe(true);
    expect(result.mostrarEnHexagonos).toBe(true);
    expect(result.tutorialVideoId).toBe('dQw4w9WgXcQ');
    expect(result.tutorialUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result.tags).toEqual(['Medicina Interna', 'Cirugía']);
  });

  it('maps open access resource correctly', () => {
    const openAccessDto: ResourceApiDto = {
      ...baseDto,
      isSubscription: false,
      externalUrl: null,
      tutorial: null,
      mostrarEnHexagonos: false,
    };

    const result = mapApiResourceToMedicalDatabase(openAccessDto);

    expect(result.accessType).toBe('Acceso Abierto');
    expect(result.isFeatured).toBe(false);
    expect(result.accessUrl).toBe('https://test.urp.edu.pe/Intranet/');
    expect(result.tutorialVideoId).toBeUndefined();
    expect(result.tutorialUrl).toBeUndefined();
    expect(result.mostrarEnHexagonos).toBe(false);
  });

  it('assigns default subject tag when subjects list is empty', () => {
    const emptySubjectsDto: ResourceApiDto = {
      ...baseDto,
      subjects: [],
    };

    const result = mapApiResourceToMedicalDatabase(emptySubjectsDto);

    expect(result.tags).toEqual(['Medicina Humana']);
  });

  it('handles empty or null clinical description and logo', () => {
    const minimalDto: ResourceApiDto = {
      ...baseDto,
      clinicalDescription: null,
      logoUrl: null,
    };

    const result = mapApiResourceToMedicalDatabase(minimalDto);

    expect(result.description).toBe('');
    expect(result.logoFile).toBe('');
  });

  it('maps raw ResourcePublicApiDto from ControlLab correctly', () => {
    const publicDto: ResourcePublicApiDto = {
      idBaseDatos: 1,
      nombreRecurso: 'PubMed / MEDLINE',
      logotipoUrl: '/api/static/logos_bd/1.webp',
      descripcionClinica: 'Motor de búsqueda de libre acceso',
      esSuscripcion: false,
      tieneAppMovil: true,
      urlExterno: 'https://pubmed.ncbi.nlm.nih.gov/',
      estadoActivo: true,
      mostrarEnHexagonos: true,
      youtubeVideoId: null,
      cursos: [
        { idCurso: 1, nombreCurso: 'Biofísica', ciclo: 1, codigoCurso: null },
        { idCurso: 2, nombreCurso: 'Bioquímica', ciclo: 3, codigoCurso: null },
      ],
    };

    const result = mapApiResourceToMedicalDatabase(publicDto);

    expect(result.id).toBe('db-1');
    expect(result.rawId).toBe(1);
    expect(result.title).toBe('PubMed / MEDLINE');
    expect(result.accessType).toBe('Acceso Abierto');
    expect(result.logoFile).toBe('/api/static/logos_bd/1.webp');
    expect(result.accessUrl).toBe('https://pubmed.ncbi.nlm.nih.gov/');
    expect(result.isFeatured).toBe(false);
    expect(result.hasMobileApp).toBe(true);
    expect(result.mostrarEnHexagonos).toBe(true);
    expect(result.tags).toEqual(['Biofísica', 'Bioquímica']);
  });
});
