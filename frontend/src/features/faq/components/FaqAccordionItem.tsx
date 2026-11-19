import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../types/faqTypes';

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="py-4 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3.5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span
          className={`flex items-center justify-center shrink-0 transition-transform duration-200 mt-1 ${
            isOpen ? 'rotate-180 text-[#008744]' : 'text-slate-400 group-hover:text-[#008744]'
          }`}
        >
          <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
        </span>
        <span
          className={`font-display text-sm sm:text-base font-bold transition-colors leading-snug ${
            isOpen ? 'text-[#008744]' : 'text-[#0F172A] group-hover:text-[#008744]'
          }`}
        >
          {item.question}
        </span>
      </button>

      {isOpen && (
        <div className="pt-3 pl-7 pr-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100 mt-3 animate-in fade-in duration-200">
          <div dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
        </div>
      )}
    </div>
  );
};
