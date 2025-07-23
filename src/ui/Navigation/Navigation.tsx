import React from 'react';
import { NavigationItem, NavigationProps } from '@/types/navigation.types';
import './nav.module.scss';

/**
 * Меню навигации для хедера
 */
export function Navigation({
  items = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ],
  className = '',
}: NavigationProps) {
  return (
    <ul
      className={`nav__list ${className}`.trim()}
      data-animation="slide-down"
      data-duration="0.6"
      data-ease="power2.out"
      data-delay="0.3"
      data-stagger="0.1"
    >
      {items.map(({ href, label }) => (
        <li className="nav__item" key={href}>
          <a className="nav__link" href={href}>
            <span className="nav__text">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
