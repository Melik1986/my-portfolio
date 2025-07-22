import React from 'react';
import { NavigationItem, NavigationProps } from '@/types/navigation.types';

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
      className={`header__nav ${className}`.trim()}
      data-animation="slide-down"
      data-duration="0.6"
      data-ease="power2.out"
      data-delay="0.3"
      data-stagger="0.1"
    >
      {items.map(({ href, label }) => (
        <li className="header__nav-item" key={href}>
          <a className="header__nav-link" href={href}>
            <span className="header__nav-text">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
