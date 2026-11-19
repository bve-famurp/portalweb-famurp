import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MedicalDatabase } from '../../data/databasesData';

interface DatabaseMasonryProps {
  items: MedicalDatabase[];
  renderItem: (item: MedicalDatabase, index: number) => React.ReactNode;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right';
  blurToFocus?: boolean;
}

const MEDIA_QUERIES = ['(min-width: 1024px)', '(min-width: 768px)'];
const MEDIA_VALUES = [3, 2];
const DEFAULT_COLUMNS = 1;

const useMediaColumns = (): number => {
  const getColumns = (): number => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS;
    for (let i = 0; i < MEDIA_QUERIES.length; i++) {
      if (window.matchMedia(MEDIA_QUERIES[i]).matches) {
        return MEDIA_VALUES[i];
      }
    }
    return DEFAULT_COLUMNS;
  };

  const [columns, setColumns] = useState<number>(getColumns);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaList = MEDIA_QUERIES.map((q) => window.matchMedia(q));
    const update = () => setColumns(getColumns());
    mediaList.forEach((mql) => mql.addEventListener('change', update));
    return () => {
      mediaList.forEach((mql) => mql.removeEventListener('change', update));
    };
  }, []);

  return columns;
};

const getInitialPosition = (direction: 'bottom' | 'top' | 'left' | 'right') => {
  switch (direction) {
    case 'top':
      return { x: 0, y: -16 };
    case 'bottom':
      return { x: 0, y: 16 };
    case 'left':
      return { x: -16, y: 0 };
    case 'right':
      return { x: 16, y: 0 };
    default:
      return { x: 0, y: 16 };
  }
};

const getDynamicOrder = (originalIndex: number, columns: number): number => {
  if (columns <= 1) return originalIndex;

  const row = Math.floor(originalIndex / columns);
  const col = originalIndex % columns;

  if (columns === 3) {
    let rankInRow = 0;
    if (row % 2 === 0) {
      if (col === 0) rankInRow = 0;
      else if (col === 2) rankInRow = 1;
      else rankInRow = 2;
    } else {
      if (col === 2) rankInRow = 0;
      else if (col === 1) rankInRow = 1;
      else rankInRow = 2;
    }
    return row * columns + rankInRow;
  }

  if (columns === 2) {
    const rankInRow = row % 2 === 0 ? (col === 0 ? 0 : 1) : (col === 1 ? 0 : 1);
    return row * columns + rankInRow;
  }

  return originalIndex;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const DatabaseMasonry: React.FC<DatabaseMasonryProps> = ({
  items,
  renderItem,
  ease = 'power2.out',
  duration = 0.5,
  stagger = 0.03,
  animateFrom = 'bottom',
  blurToFocus = true,
}) => {
  const columns = useMediaColumns();
  const containerRef = useRef<HTMLDivElement>(null);

  const columnGroups = useMemo(() => {
    const groups: Array<
      Array<{ item: MedicalDatabase; originalIndex: number; dynamicOrder: number }>
    > = Array.from({ length: columns }, () => []);

    items.forEach((item, index) => {
      const dynamicOrder = getDynamicOrder(index, columns);
      groups[index % columns].push({ item, originalIndex: index, dynamicOrder });
    });

    return groups;
  }, [items, columns]);

  const itemsKey = useMemo(() => items.map((i) => i.id).join('|'), [items]);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const itemElements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('.masonry-item')
    );

    if (itemElements.length === 0) return;

    itemElements.sort((a, b) => {
      const orderA = Number(a.getAttribute('data-dynamic-order') ?? 0);
      const orderB = Number(b.getAttribute('data-dynamic-order') ?? 0);
      return orderA - orderB;
    });

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      itemElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      return;
    }

    const initialPos = getInitialPosition(animateFrom);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemElements,
        {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          filter: blurToFocus ? 'blur(2px)' : 'none',
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: blurToFocus ? 'blur(0px)' : 'none',
          duration,
          ease,
          stagger: (index) => Math.min(index * stagger, 0.35),
          clearProps: 'transform,filter',
          overwrite: 'auto',
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [itemsKey, duration, ease, stagger, animateFrom, blurToFocus, columns]);

  return (
    <div
      ref={containerRef}
      className="grid gap-4 items-start w-full"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {columnGroups.map((group, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {group.map(({ item, originalIndex, dynamicOrder }) => (
            <div
              key={item.id}
              data-key={item.id}
              data-index={originalIndex}
              data-dynamic-order={dynamicOrder}
              className="masonry-item"
            >
              {renderItem(item, originalIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
