import { useEffect, RefObject } from 'react';

/**
 * Управляет классом is-paused в зависимости от видимости элемента в вьюпорте
 */
export function useMarqueeVisibility<T extends HTMLElement>(ref: RefObject<T | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        el.classList.toggle('is-paused', !entry.isIntersecting);
      },
      { root: null, threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
