import React from 'react';
import { NavigationProps } from '@/lib/types/navigation.types';
import styles from './nav.module.scss';

/**
 * Массив элементов навигации по умолчанию
 * Определяет ссылки и метки для навигационного меню
 */
const defaultItems = [
  { href: '#about', label: 'About', sectionId: 'about-section' },
  { href: '#skills', label: 'Skills', sectionId: 'skills-section' },
  { href: '#projects', label: 'Projects', sectionId: 'projects-section' },
  { href: '#gallery', label: 'Gallery', sectionId: 'gallery-section' },
  { href: '#contact', label: 'Contacts', sectionId: 'contact-section' },
];

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
  items = defaultItems,
  className = '',
  onNavigate,
  ...rest
}: NavigationProps & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`${styles.nav__list} ${className}`.trim()} {...rest}>
      {items.map(({ href, label, sectionId }) => (
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
