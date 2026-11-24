import React, { useCallback } from 'react';
import type { AppView } from '../core/types/navigation';
import { conferenciasPort } from '../features/conferences';
import { basesDeDatosPort } from '../features/databases';
import {
  HomeHero,
  HomeBentoGrid,
  type HomeMatrixResource,
} from '../features/home';

interface HomePageProps {
  onNavigate: (view: AppView, query?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const loadActivities = useCallback(() => conferenciasPort.getConferences(), []);

  const loadMatrixResources = useCallback(async (): Promise<HomeMatrixResource[]> => {
    const data = await basesDeDatosPort.getMatrizHexagonal();
    return data.map((db) => ({
      id: db.rawId,
      title: db.title,
      logoUrl: db.logoUrl,
      mostrarEnHexagonos: db.mostrarEnHexagonos,
      primaryCourse: db.cursos?.[0]?.nombreCurso,
    }));
  }, []);

  return (
    <main className="w-full bg-white text-slate-900 overflow-hidden">
      <HomeHero onNavigate={onNavigate} loadActivities={loadActivities} />

      <section className="max-w-[1280px] mx-auto px-6 py-16 pb-24">
        <div className="w-full max-w-[1280px] mx-auto">
          <HomeBentoGrid onNavigate={onNavigate} loadMatrixResources={loadMatrixResources} />
        </div>
      </section>
    </main>
  );
};
