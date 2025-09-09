import { useState, useEffect, useCallback } from 'react';

/**
 * Хук для проверки соответствия медиа-запросу
 * @param query - строка медиа-запроса, например '(max-width: 768px)'
 * @param defaultValue - значение по умолчанию для SSR
 * @returns boolean
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const getMatch = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return defaultValue;
    return window.matchMedia(query).matches;
  }, [query, defaultValue]);

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQueryList = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', handler);
    setMatches(mediaQueryList.matches);
    return () => {
      mediaQueryList.removeEventListener('change', handler);
    };
  }, [query, getMatch]);

  return matches;
}
