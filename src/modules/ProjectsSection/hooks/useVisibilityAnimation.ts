import { useEffect, useRef } from 'react';

interface UseVisibilityAnimationProps {
  onVisible: () => void;
  onHidden: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useVisibilityAnimation({
  onVisible,
  onHidden,
  threshold = 0.1,
  rootMargin = '0px 0px -15% 0px',
}: UseVisibilityAnimationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible();
        } else {
          onHidden();
        }
      },
      { root: null, threshold, rootMargin },
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onVisible, onHidden, threshold, rootMargin]);

  return containerRef;
}