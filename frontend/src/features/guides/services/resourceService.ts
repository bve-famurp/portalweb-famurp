import { getVpsApiBase } from '../../../core/apiConfig';
import {
  ResourceApiDto,
  ResourcePublicApiDto,
  CourseApiDto,
  SubjectApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../types/resourceApiTypes';

const resourceDetailCache = new Map<number, ResourceApiDto>();

const normalizeResource = (item: ResourcePublicApiDto): ResourceApiDto => ({
  ...item,
  id: item.idBaseDatos,
  name: item.nombreRecurso,
  logoUrl: item.logotipoUrl,
  clinicalDescription: item.descripcionClinica,
  isSubscription: item.esSuscripcion,
  hasMobileApp: item.tieneAppMovil,
  externalUrl: item.urlExterno,
  isActive: item.estadoActivo,
  subjects: item.cursos ? item.cursos.map((c) => c.nombreCurso) : [],
});

export const resourceService = {
  getCachedLiteResources(): ResourceApiDto[] {
    try {
      const cached = localStorage.getItem('medlib_cached_lite_resources');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [];
  },

  async getResources(lite: boolean = false): Promise<ResourceApiDto[]> {
    const url = `${getVpsApiBase()}/api/resources`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener recursos: ${response.statusText}`);
    }
    const rawData: ResourcePublicApiDto[] = await response.json();
    const data: ResourceApiDto[] = Array.isArray(rawData) ? rawData.map(normalizeResource) : [];
    if (lite && data.length > 0) {
      try {
        localStorage.setItem('medlib_cached_lite_resources', JSON.stringify(data));
      } catch {}
    }
    return data;
  },

  async getMatrizHexagonal(): Promise<ResourceApiDto[]> {
    try {
      const response = await fetch(`${getVpsApiBase()}/api/resources/matriz-hexagonal`);
      if (response.ok) {
        const rawData: ResourcePublicApiDto[] = await response.json();
        if (Array.isArray(rawData)) {
          return rawData.map(normalizeResource);
        }
      }
    } catch {}
    return [];
  },

  async getResourceNames(): Promise<string[]> {
    try {
      const resources = await this.getResources(true);
      if (resources && resources.length > 0) {
        return resources.map((r) => r.name);
      }
    } catch {}
    return this.getCachedLiteResources().map((r) => r.name);
  },

  async getAdminResources(): Promise<ResourceApiDto[]> {
    return await this.getResources();
  },

  async getResourceById(id: number): Promise<ResourceApiDto> {
    const cached = resourceDetailCache.get(id);
    if (cached) {
      return cached;
    }
    const all = await this.getResources();
    const found = all.find((r) => r.id === id || r.idBaseDatos === id);
    if (found) {
      resourceDetailCache.set(id, found);
      return found;
    }
    throw new Error(`Error al obtener recurso con ID ${id}`);
  },

  clearDetailCache(id?: number): void {
    if (id !== undefined) {
      resourceDetailCache.delete(id);
    } else {
      resourceDetailCache.clear();
    }
  },

  async getAsignaturas(): Promise<string[]> {
    try {
      const response = await fetch(`${getVpsApiBase()}/api/resources/cursos`);
      if (response.ok) {
        const cursos: CourseApiDto[] = await response.json();
        if (Array.isArray(cursos)) {
          return cursos.map((c) => c.nombreCurso);
        }
      }
    } catch {}
    return [];
  },

  async getMaterias(): Promise<string[]> {
    return await this.getAsignaturas();
  },

  async getSubjects(): Promise<SubjectApiDto[]> {
    try {
      const response = await fetch(`${getVpsApiBase()}/api/resources/cursos`);
      if (response.ok) {
        const cursos: CourseApiDto[] = await response.json();
        if (Array.isArray(cursos)) {
          return cursos.map((c) => ({ id: c.idCurso, name: c.nombreCurso }));
        }
      }
    } catch {}
    return [];
  },

  async getCursos(): Promise<CourseApiDto[]> {
    const response = await fetch(`${getVpsApiBase()}/api/resources/cursos`);
    if (!response.ok) {
      throw new Error(`Error al obtener cursos: ${response.statusText}`);
    }
    return await response.json();
  },

  async createResource(_request: CreateResourceApiRequest): Promise<ResourceApiDto> {
    throw new Error('La administracion de recursos se gestiona exclusivamente en ControlLab.');
  },

  async updateResource(_id: number, _request: UpdateResourceApiRequest): Promise<ResourceApiDto> {
    throw new Error('La administracion de recursos se gestiona exclusivamente en ControlLab.');
  },

  async deleteResource(_id: number): Promise<void> {
    throw new Error('La administracion de recursos se gestiona exclusivamente en ControlLab.');
  },

  async uploadLogo(_file: File): Promise<string> {
    throw new Error('La carga de logotipos se gestiona exclusivamente en ControlLab.');
  },

  async toggleHexagonDisplay(_id: number): Promise<ResourceApiDto> {
    throw new Error('La modificacion de la matriz se gestiona exclusivamente en ControlLab.');
  },

  async setHexagonMatrix(_resourceIds: number[]): Promise<ResourceApiDto[]> {
    throw new Error('La modificacion de la matriz se gestiona exclusivamente en ControlLab.');
  },
};
