import React, { useState, useMemo } from 'react';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  FaqCategoryNav,
  FaqAccordionItem,
  FaqRulesAside,
  type FaqCategoryId,
} from '../features/faq';

export const FaqPage: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<FaqCategoryId>('all');
  const [openIds, setOpenIds] = useState<number[]>([]);

  const filteredItems = useMemo(() => {
    if (currentCategory === 'all') {
      return FAQ_ITEMS;
    }
    return FAQ_ITEMS.filter((item) => item.category === currentCategory);
  }, [currentCategory]);

  const activeCategoryTitle = useMemo(() => {
    const cat = FAQ_CATEGORIES.find((c) => c.id === currentCategory);
    return cat ? cat.name : 'Todas las Preguntas';
  }, [currentCategory]);

  const allAreOpen = useMemo(() => {
    if (filteredItems.length === 0) return false;
    return filteredItems.every((item) => openIds.includes(item.id));
  }, [filteredItems, openIds]);

  const handleToggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (allAreOpen) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredItems.map((item) => item.id));
    }
  };

  const handleCategoryChange = (catId: FaqCategoryId) => {
    setCurrentCategory(catId);
  };

  return (
    <main className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 pt-8 pb-16 flex flex-col flex-1">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-lora font-bold text-[#0F172A] tracking-tight">
          Preguntas <span className="italic font-bold text-[#008744]">Frecuentes</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
        <FaqCategoryNav
          categories={FAQ_CATEGORIES}
          currentCategory={currentCategory}
          onSelectCategory={handleCategoryChange}
        />

        <section className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-2xl font-display font-black text-[#0F172A]">
              {activeCategoryTitle}
            </h2>

            <button
              type="button"
              onClick={handleToggleAll}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-[#008744] text-xs font-bold text-[#0F172A] hover:text-[#008744] font-sans transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              {allAreOpen ? 'Collapse All -' : 'Expand All +'}
            </button>
          </div>

          <div className="divide-y divide-slate-200 border-b border-slate-200">
            {filteredItems.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                isOpen={openIds.includes(item.id)}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </section>

        <FaqRulesAside />
      </div>
    </main>
  );
};
