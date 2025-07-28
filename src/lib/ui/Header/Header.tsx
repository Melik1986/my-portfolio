'use client';

import React from 'react';
import { useGsap } from '@/lib/hooks/useGsap';
import { Logo } from '@/lib/ui/Logo/logo';
import { Navigation } from '@/lib/ui/Navigation/Navigation';
import { ContactButton } from '@/lib/ui/Button/ContactButton';
import styles from './header.module.scss';

/**
 * Компонент шапки сайта
 * Содержит логотип, навигацию и кнопку контакта
 */
export function Header() {
  const { containerRef: headerRef } = useGsap({});

  return (
    <header ref={headerRef} className={styles.header} id="header">
      <div
        className={styles.header__content}
        data-animation="slide-down"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.1"
      >
        <Logo />
        <Navigation />
        <ContactButton />
      </div>
    </header>
  );
}
