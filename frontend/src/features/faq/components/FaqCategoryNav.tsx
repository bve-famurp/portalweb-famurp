import React from 'react';
import type { FaqCategory, FaqCategoryId } from '../types/faqTypes';

interface FaqCategoryNavProps {
  categories: FaqCategory[];
  currentCategory: FaqCategoryId;
  onSelectCategory: (id: FaqCategoryId) => void;
}

export const FaqCategoryNav: React.FC<FaqCategoryNavProps> = ({
  categories,
  currentCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="lg:col-span-3 bg-[#0F172A] rounded-2xl p-3 sm:p-4 text-white flex flex-col h-full shadow-sm">
      <div className="flex flex-col gap-1">
        {categories.map((cat) => {
          const isActive = cat.id === currentCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-sans transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-[#1E293B] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
