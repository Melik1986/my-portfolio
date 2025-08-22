'use client';

import React from 'react';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';
import type { ScrollSmootherInstance } from '@/lib/gsap/hooks/useScrollSmoother';
import { animationController } from '@/modules/AnimatedCardSection/core/AnimationController';
import { Logo } from '@/lib/ui/Logo/logo';
import { Navigation } from '@/lib/ui/Navigation/Navigation';
import { ContactButton } from '@/lib/ui/Button/ContactButton';
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
export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const elementTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const { scrollTo, isReady, smoother } = useScrollSmoother();

  useEffect(() => {
    if (headerRef.current) {
      elementTimelineRef.current = createElementTimeline(headerRef.current);
      elementTimelineRef.current?.play();
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    console.log('🎯 handleNavigate called with:', sectionId);
    navigateToSection(sectionId, isReady, smoother, scrollTo);
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
          onClick={() => handleNavigate('contact-section')}
        />
      </div>
    </header>
  );
}
