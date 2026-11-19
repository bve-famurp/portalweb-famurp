import { useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface GsapEntranceOptions {
  x?: number;
  y?: number;
  blur?: number;
  duration?: number;
  stagger?: number | ((index: number, target: HTMLElement, list: HTMLElement[]) => number);
  ease?: string;
  clearProps?: string;
  skip?: boolean;
}

export const useGsapEntrance = (
  containerRef: React.RefObject<HTMLElement | null>,
  itemSelector: string,
  deps: React.DependencyList,
  options?: GsapEntranceOptions
): void => {
  useIsomorphicLayoutEffect(() => {
    if (options?.skip) return;
    if (!containerRef.current) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(itemSelector)
    );
    if (elements.length === 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      elements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      return;
    }

    const initialX = options?.x ?? 0;
    const initialY = options?.y ?? 0;
    const blurAmount = options?.blur ?? 0;
    const duration = options?.duration ?? 0.85;
    const ease = options?.ease ?? 'power3.out';
    const stagger = options?.stagger ?? 0.12;
    const clearProps = options?.clearProps ?? 'transform,filter';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          x: initialX,
          y: initialY,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: blurAmount > 0 ? 'blur(0px)' : 'none',
          duration,
          ease,
          stagger,
          clearProps,
          overwrite: 'auto',
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, deps);
};
