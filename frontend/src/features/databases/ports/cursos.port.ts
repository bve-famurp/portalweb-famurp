import { CourseApiDto } from '../types/resourceApiTypes';

export interface CursosPort {
  getCursos(): Promise<CourseApiDto[]>;
  getAsignaturas(): Promise<string[]>;
}
