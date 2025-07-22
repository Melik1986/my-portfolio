import React from 'react';
import { SpriteIcon } from '@/ui/SpriteIcon';
import { LogoProps } from '@/types/logo.types';

/**
 * Логотип компании с использованием SVG-спрайта
 */
export function Logo({ className = '', iconClassName = '', ...rest }: LogoProps) {
  return (
    <a
      href="#header"
      className={`header__logo-link ${className}`.trim()}
      data-animation="slide-left"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0"
      {...rest}
    >
      <SpriteIcon
        id="logo"
        className={`header__logo-icon ${iconClassName}`.trim()}
        width={50}
        height={50}
        aria-label="Logo"
      />
    </a>
  );
}
