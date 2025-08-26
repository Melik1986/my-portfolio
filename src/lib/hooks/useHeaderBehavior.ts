import { useCallback, useEffect, useRef, useState } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';

export function useHeaderAnimation() {
  const headerRef = useRef<HTMLElement>(null);
  const elementTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const tl = createElementTimeline(headerRef.current);
    elementTimelineRef.current = tl;

    const start = () => elementTimelineRef.current?.play();
    const preloaderRoot = document.querySelector('[data-preloader-root]');

    if (preloaderRoot) {
      document.addEventListener('preloader:complete', start as EventListener, { once: true });
    } else {
      start();
    }
    return () => document.removeEventListener('preloader:complete', start as EventListener);
  }, []);

  return { headerRef } as const;
}

export function useMobileNavigation() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMobileNav();
    }
    if (isMobileNavOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen, closeMobileNav]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768 && isMobileNavOpen) setIsMobileNavOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMobileNavOpen]);

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (
        isMobileNavOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeMobileNav();
      }
    }
    if (isMobileNavOpen) document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isMobileNavOpen, closeMobileNav]);

  const toggleMobileNav = () => setIsMobileNavOpen((v) => !v);

  return { isMobileNavOpen, toggleMobileNav, closeMobileNav, dropdownRef } as const;
}
