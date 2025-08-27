'use client';

import React from 'react';
import { NavigationProps } from '@/lib/types/navigation.types';
import styles from './nav.module.scss';
import { useI18n } from '@/i18n';

/**
 * Массив элементов навигации по умолчанию
 * Определяет ссылки и метки для навигационного меню
 */
function buildDefaultItems(t: (k: string) => string) {
  return [
    { href: '#about', label: t('nav.about'), sectionId: 'about-section' },
    { href: '#skills', label: t('nav.skills'), sectionId: 'skills-section' },
    { href: '#projects', label: t('nav.projects'), sectionId: 'projects-section' },
    { href: '#gallery', label: t('nav.gallery'), sectionId: 'gallery-section' },
    { href: '#contact', label: t('nav.contacts'), sectionId: 'contact-section' },
  ];
}

/**
 * Компонент элемента навигации
 * Рендерит отдельный пункт навигационного меню
 */
function NavigationItem({
  href,
  label,
  sectionId,
  onNavigate,
}: {
  href: string;
  label: string;
  sectionId: string;
  onNavigate?: (sectionId: string) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <li className={styles.nav__item}>
      <a className={styles.nav__link} href={href} onClick={handleClick}>
        <span className={styles.nav__text}>{label}</span>
      </a>
    </li>
  );
}

/**
 * Компонент навигации с анимацией
 * Отображает список ссылок с GSAP анимацией и плавной прокруткой
 */
export function Navigation({
  items,
  className = '',
  onNavigate,
  ...rest
}: NavigationProps & React.HTMLAttributes<HTMLUListElement>) {
  const { t } = useI18n();
  const navItems = items ?? buildDefaultItems(t);
  return (
    <ul className={`${styles.nav__list} ${className}`.trim()} {...rest}>
      {navItems.map(({ href, label, sectionId }) => (
        <NavigationItem
          key={href}
          href={href}
          label={label}
          sectionId={sectionId}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}
