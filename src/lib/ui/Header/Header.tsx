'use client';

import React from 'react';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';
import { animationController } from '@/modules/AnimatedCardSection/core/AnimationController';
import { Logo } from '@/lib/ui/Logo/logo';
import { Navigation } from '@/lib/ui/Navigation/Navigation';
import { ContactButton } from '@/lib/ui/Button/ContactButton';
import styles from './header.module.scss';

/**
 * Компонент шапки сайта
 * Содержит логотип, навигацию и кнопку контакта
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const elementTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const { scrollTo, isReady, smoother } = useScrollSmoother();

  useEffect(() => {
    if (headerRef.current) {
      elementTimelineRef.current = createElementTimeline(headerRef.current);

      // --- HERO AUTO PLAY ---
      // Автозапуск анимации элементов Header после появления секции
      if (elementTimelineRef.current) {
        // Запускаем анимацию сразу без задержки
        elementTimelineRef.current.play();
      }
      // --- END HERO AUTO PLAY ---
    }
  }, []);

  /**
   * Функция для навигации к секциям с использованием AnimationController
   */
  const handleNavigate = (sectionId: string) => {
    console.log('Navigation clicked for:', sectionId);
    
    // Получаем индекс карточки по ID секции
    const cardIndex = animationController.getCardIndexBySectionId(sectionId);
    
    if (cardIndex === -1) {
      console.warn(`Section '${sectionId}' not found in animation controller`);
      
      // Fallback к стандартной навигации
      const element = document.getElementById(sectionId);
      if (element) {
        if (isReady && smoother && scrollTo) {
          try {
            scrollTo(element, true, 'top top');
          } catch (error) {
            console.error('ScrollSmoother navigation failed:', error);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    // Используем AnimationController для навигации к карточке
    if (animationController.isReady()) {
      console.log('Using AnimationController for navigation to card:', cardIndex);
      animationController.navigateToCard(cardIndex);
    } else {
      console.warn('AnimationController not ready, falling back to standard navigation');
      
      // Fallback к стандартной навигации
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header ref={headerRef} className={styles.header} id="header">
      <div className={styles.header__content}>
        <Logo
          data-animation="slide-left-scale"
          data-duration="1.0"
          data-ease="power2.out"
          data-delay="0"
        />
        <Navigation
          data-animation="slide-down-blur"
          data-duration="0.8"
          data-ease="power2.out"
          data-delay="0.3"
          onNavigate={handleNavigate}
        />
        <ContactButton
          data-animation="slide-right"
          data-duration="1.0"
          data-ease="power2.out"
          data-delay="0"
        />
      </div>
    </header>
  );
}
