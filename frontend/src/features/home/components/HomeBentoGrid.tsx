import React from 'react';
import { BentoDatabasesCard } from './BentoDatabasesCard';
import { BentoScheduleCard } from './BentoScheduleCard';
import { BentoFaqCtaCard } from './BentoFaqCtaCard';
import { BentoCollectionsCard } from './BentoCollectionsCard';
import { BentoBoletinCard } from './BentoBoletinCard';

interface HomeBentoGridProps {
  onNavigate?: (view: any, query?: string) => void;
}

export const HomeBentoGrid: React.FC<HomeBentoGridProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch w-full">
      <BentoDatabasesCard onNavigate={onNavigate} />

      <BentoBoletinCard onNavigate={onNavigate} />

      <BentoScheduleCard />

      <BentoFaqCtaCard onNavigate={onNavigate} />

      <BentoCollectionsCard onNavigate={onNavigate} />
    </div>
  );
};
