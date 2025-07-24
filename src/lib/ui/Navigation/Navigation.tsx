import React from 'react';
import { NavigationProps } from '@/types/navigation.types';
import './nav.module.scss';

const defaultItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

function NavigationItem({ href, label }: { href: string; label: string }) {
  return (
    <li className="nav__item">
      <a className="nav__link" href={href}>
        <span className="nav__text">{label}</span>
      </a>
    </li>
  );
}

export function Navigation({ items = defaultItems, className = '' }: NavigationProps) {
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
        <NavigationItem key={href} href={href} label={label} />
      ))}
    </ul>
  );
}
