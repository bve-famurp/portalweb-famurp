import React from 'react';
import type { AppView } from '../../../core/types/navigation';
import type { HomeMatrixResource } from '../types/homeExternal.types';
import { BentoDatabasesCard } from './BentoDatabasesCard';
import { BentoScheduleCard } from './BentoScheduleCard';
import { BentoFaqCtaCard } from './BentoFaqCtaCard';
import { BentoCollectionsCard } from './BentoCollectionsCard';
import { BentoBoletinCard } from './BentoBoletinCard';

interface HomeBentoGridProps {
  onNavigate?: (view: AppView, query?: string) => void;
  loadMatrixResources?: () => Promise<HomeMatrixResource[]>;
}

export const HomeBentoGrid: React.FC<HomeBentoGridProps> = ({
  onNavigate,
  loadMatrixResources,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch w-full">
      <BentoDatabasesCard onNavigate={onNavigate} loadMatrixResources={loadMatrixResources} />

      <BentoBoletinCard />

      <BentoScheduleCard />

      <BentoFaqCtaCard onNavigate={onNavigate} />

      <BentoCollectionsCard onNavigate={onNavigate} />
    </div>
  );
};
