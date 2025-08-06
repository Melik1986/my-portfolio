'use client';

import React from 'react';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
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
        // Если секция всегда видима, можно запускать сразу с небольшой задержкой
        setTimeout(() => {
          elementTimelineRef.current?.play();
        }, 300);
        // Если нужна точная видимость, можно заменить на IntersectionObserver
      }
      // --- END HERO AUTO PLAY ---
    }
  }, []);

  return (
    <header ref={headerRef} className={styles.header} id="header">
      <div className={styles.header__content}>
        <Logo data-animation="slide-left-scale" data-duration="1.1" data-ease="power3.out" />
        <Navigation
          data-animation="slide-down-blur"
          data-duration="1.1"
          data-ease="power3.out"
          data-delay="0.7"
        />
        <ContactButton data-animation="slide-right" data-duration="1.1" data-ease="power3.out" />
      </div>
    </header>
  );
}
