import { getApiBase } from '../../../core/apiConfig';
import {
  ResourceApiDto,
  SubjectApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../types/resourceApiTypes';

const resourceDetailCache = new Map<number, ResourceApiDto>();


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
    const url = lite ? `${getApiBase()}/api/v1/resources?lite=true` : `${getApiBase()}/api/v1/resources`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener recursos: ${response.statusText}`);
    }
    const data = await response.json();
    if (lite && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('medlib_cached_lite_resources', JSON.stringify(data));
      } catch {}
    }
    return data;
  },

  async getResourceNames(): Promise<string[]> {
    try {
      const response = await fetch(`${getApiBase()}/api/v1/resources/names`);
      if (response.ok) {
        const names = await response.json();
        if (Array.isArray(names) && names.length > 0) {
          return names;
        }
      }
    } catch {}

    return this.getCachedLiteResources().map((r) => r.name);
  },

  async getAdminResources(): Promise<ResourceApiDto[]> {
    try {
      const response = await fetch(`${getApiBase()}/api/v1/admin/resources`);
      if (!response.ok) {
        return await this.getResources();
      }
      return await response.json();
    } catch {
      return await this.getResources();
    }
  },

  async getResourceById(id: number): Promise<ResourceApiDto> {
    const cached = resourceDetailCache.get(id);
    if (cached) {
      return cached;
    }
    const response = await fetch(`${getApiBase()}/api/v1/resources/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener recurso con ID ${id}`);
    }
    const data = await response.json();
    resourceDetailCache.set(id, data);
    return data;
  },

  clearDetailCache(id?: number): void {
    if (id !== undefined) {
      resourceDetailCache.delete(id);
    } else {
      resourceDetailCache.clear();
    }
  },

  async getMaterias(): Promise<string[]> {
    try {
      const response = await fetch(`${getApiBase()}/api/v1/resources/materias`);
      if (response.ok) {
        const materias = await response.json();
        if (Array.isArray(materias)) {
          return materias;
        }
      }
    } catch {}
    return [];
  },

  async getSubjects(): Promise<SubjectApiDto[]> {
    const response = await fetch(`${getApiBase()}/api/v1/subjects`);
    if (!response.ok) {
      throw new Error(`Error al obtener materias: ${response.statusText}`);
    }
    return await response.json();
  },

  async createResource(request: CreateResourceApiRequest): Promise<ResourceApiDto> {
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al crear recurso' }));
      throw new Error(err.message || 'Error al crear recurso');
    }

    return await response.json();
  },

  async updateResource(id: number, request: UpdateResourceApiRequest): Promise<ResourceApiDto> {
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al actualizar recurso' }));
      throw new Error(err.message || 'Error al actualizar recurso');
    }

    this.clearDetailCache(id);
    return await response.json();
  },

  async deleteResource(id: number): Promise<void> {
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al eliminar recurso' }));
      throw new Error(err.message || 'Error al eliminar recurso');
    }

    this.clearDetailCache(id);
  },

  async uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/upload-logo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al subir imagen del logo' }));
      throw new Error(err.message || 'Error al subir imagen del logo');
    }

    const data = await response.json();
    return data.logoUrl;
  },

  async toggleHexagonDisplay(id: number): Promise<ResourceApiDto> {
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/${id}/toggle-hexagonos`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al cambiar visibilidad en hexágonos' }));
      throw new Error(err.message || 'Error al cambiar visibilidad en hexágonos');
    }

    this.clearDetailCache(id);
    return await response.json();
  },

  async setHexagonMatrix(resourceIds: number[]): Promise<ResourceApiDto[]> {
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/hexagon-matrix`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resourceIds }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al actualizar matriz de hexágonos' }));
      throw new Error(err.message || 'Error al actualizar matriz de hexágonos');
    }

    this.clearDetailCache();
    return await response.json();
  },
};
