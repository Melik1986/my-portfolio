'use client';

import React from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';
import type { ScrollSmootherInstance } from '@/lib/gsap/hooks/useScrollSmoother';
import { animationController } from '@/modules/AnimatedCardSection/core/AnimationController';
import { Logo } from '@/lib/ui';
import { Navigation } from '@/lib/ui';
import { ContactButton } from '@/lib/ui';
import { GlassCard } from '@/lib/ui';
import styles from './header.module.scss';

/**
 * Навигация к секциям с использованием AnimationController
 */
const navigateToSection = (
  sectionId: string,
  isReady: boolean,
  smoother: ScrollSmootherInstance | null,
  scrollTo:
    | ((target: string | number | Element, smooth?: boolean, position?: string) => void)
    | null,
) => {
  console.log('🔍 Navigation attempt:', { sectionId, isReady });

  const cardIndex = animationController.getCardIndexBySectionId(sectionId);
  console.log('📍 Card index for section:', cardIndex);

  if (cardIndex !== -1 && animationController.isReady()) {
    console.log('✅ Using AnimationController navigation');
    animationController.navigateToCard(cardIndex);
    return;
  }

  const element = document.getElementById(sectionId);
  console.log('🎯 Element found:', !!element);
  if (!element) return;

  if (isReady && smoother && scrollTo) {
    console.log('🚀 Using ScrollSmoother navigation');
    try {
      scrollTo(element, true, 'top top');
    } catch {
      console.log('⚠️ ScrollSmoother failed, using fallback');
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    console.log('📜 Using native scrollIntoView');
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Компонент шапки сайта
 */
// eslint-disable-next-line max-lines-per-function
export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const elementTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const { scrollTo, isReady, smoother } = useScrollSmoother();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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

    return () => {
      document.removeEventListener('preloader:complete', start as EventListener);
    };
  }, []);

  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
    }
    if (isMobileNavOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // lock scroll
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
      if (window.innerWidth > 768 && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMobileNavOpen]);

  const handleNavigate = (sectionId: string) => {
    console.log('🎯 handleNavigate called with:', sectionId);
    navigateToSection(sectionId, isReady, smoother, scrollTo);
    closeMobileNav();
  };

  const handleButtonClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMobileNavOpen((v) => !v);
    } else {
      handleNavigate('contact-section');
    }
  };

  return (
    <header ref={headerRef} className={styles.header} id="header">
      <div className={styles.header__content}>
        <Logo
          className={styles['header__logo']}
          data-animation="slide-left-scale"
          data-duration="1.0"
          data-ease="power2.out"
          data-delay="0"
        />
        <Navigation
          className={styles['header__navigation']}
          data-animation="slide-down-blur"
          data-duration="0.8"
          data-ease="power2.out"
          data-delay="0.3"
          onNavigate={handleNavigate}
        />
        <ContactButton
          className={styles['header__contact-button']}
          data-animation="slide-right"
          data-duration="1.0"
          data-ease="power2.out"
          data-delay="0"
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav-panel"
          aria-haspopup="menu"
          onClick={handleButtonClick}
        >
          <span className={styles.header__btnTextDesktop}>Contact me</span>
          <span className={styles.header__btnTextMobile}>Navigation</span>
        </ContactButton>
      </div>

      {/* Mobile overlay and dropdown */}
      {isMobileNavOpen && (
        <>
          <button
            type="button"
            className={styles.header__overlay}
            aria-label="Close navigation"
            onClick={closeMobileNav}
          />
          <div id="mobile-nav-panel" className={styles.header__dropdown} role="navigation" aria-label="Mobile navigation">
            <GlassCard className={styles.header__dropdownCard} variant="content-focused">
              <Navigation className={styles.header__dropdownNav} onNavigate={handleNavigate} />
            </GlassCard>
          </div>
        </>
      )}
    </header>
  );
}
