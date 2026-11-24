import React from 'react';
import { BookOpen, Newspaper, GraduationCap, ArrowRight } from 'lucide-react';
import type { AppView } from '../../../core/types/navigation';
import {
  BENTO_COLLECTIONS,
  BentoCollectionItem,
} from '../constants/bentoCollectionsData';

interface BentoCollectionsCardProps {
  className?: string;
  onNavigate?: (view: AppView) => void;
}

export const BentoCollectionsCard: React.FC<BentoCollectionsCardProps> = ({
  className = '',
  onNavigate,
}) => {
  const renderIcon = (type: BentoCollectionItem['type']) => {
    switch (type) {
      case 'books':
        return <BookOpen className="w-5 h-5" />;
      case 'journals':
        return <Newspaper className="w-5 h-5" />;
      case 'theses':
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 lg:col-start-3 lg:row-start-3 rounded-lg bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm min-h-[360px] lg:min-h-[419px] ${className}`}
    >
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#008744]">
            ACCESO CENTRALIZADO
          </span>
          <h3 className="text-2xl font-display font-black text-[#0F172A]">
            Colecciones &amp; Repositorios
          </h3>
        </div>
      </div>

      <div className="divide-y divide-slate-100 py-2 flex-1 flex flex-col justify-around">
        {BENTO_COLLECTIONS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noreferrer' : undefined}
            title={`Ir a ${item.title}`}
            aria-label={`Ir a ${item.title}`}
            onClick={(e) => {
              if (!item.isExternal && onNavigate) {
                e.preventDefault();
                onNavigate('directory');
              }
            }}
            className="py-3.5 px-3.5 rounded-lg hover:bg-[#008744] text-slate-900 hover:text-white transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-[#008744]/10 text-[#008744] group-hover:bg-white group-hover:text-[#008744] flex items-center justify-center shrink-0 transition-colors">
                {renderIcon(item.type)}
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#0F172A] group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 group-hover:text-white/80 transition-colors mt-0.5 max-w-xl">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span className="sm:hidden font-sans text-xs font-bold text-[#008744] group-hover:text-white transition-colors">
                Ir a {item.title}
              </span>
              <div
                className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-white group-hover:bg-white text-[#0F172A] group-hover:text-[#008744] flex items-center justify-center transition-all shrink-0 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
        <span className="font-bold text-[#008744]">Repositorios URP oficiales</span>
      </div>
    </div>
  );
};
