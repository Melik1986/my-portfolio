'use client';

import React from 'react';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
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
   * Функция для плавной прокрутки к секциям
   */
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
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
