import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AppView } from '../../../core/types/navigation';

interface BentoFaqCtaCardProps {
  onNavigate?: (view: AppView) => void;
  className?: string;
}

export const BentoFaqCtaCard: React.FC<BentoFaqCtaCardProps> = ({
  onNavigate,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('faq');
    }
  };

  return (
    <a
      href="#faq"
      onClick={handleClick}
      className={`col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-1 lg:col-start-1 lg:row-start-4 rounded-lg bg-white border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-[#008744] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between min-h-[85px] ${className}`}
    >
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#008744] block">
          CENTRO DE AYUDA
        </span>
        <span className="font-display text-base sm:text-lg font-black text-[#0F172A] group-hover:text-[#008744] transition-colors block mt-0.5">
          Preguntas Frecuentes
        </span>
      </div>

      <div className="w-10 h-10 rounded-full bg-[#008744] group-hover:bg-[#00A859] text-white flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-45 shrink-0 shadow-xs">
        <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
      </div>
    </a>
  );
};
